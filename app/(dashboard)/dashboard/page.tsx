'use client'

import { useState } from 'react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { CitationShareChart } from '@/components/charts/CitationShareChart'
import { CitationTrendChart } from '@/components/charts/CitationTrendChart'
import { BrandRankingCard } from '@/components/charts/BrandRankingCard'
import { GeoScoreChart } from '@/components/charts/GeoScoreChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EmptyState } from '@/components/ui/empty-state'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { useCampaigns } from '@/lib/hooks/use-campaigns'
import {
  useCitationShare,
  useBrandRanking,
  useGeoScoreSummary,
  useCampaignSummary,
} from '@/lib/hooks/use-campaigns'
import { getChartColors } from '@/lib/design-tokens'
import { getMockTimeseriesForChart } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { FolderKanban, TrendingUp, BarChart3, AlertCircle, Megaphone, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces()
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | undefined>()

  // Use first workspace by default
  const workspaceId = workspaces?.[0]?.id

  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns(workspaceId)

  // Fetch data for selected campaign
  const { data: summary, isLoading: summaryLoading } = useCampaignSummary(
    workspaceId,
    selectedCampaignId
  )
  const {
    data: citationData,
    isLoading: citationLoading,
    error: citationError,
    refetch: refetchCitation,
  } = useCitationShare(workspaceId, selectedCampaignId)
  const {
    data: brandRanking,
    isLoading: rankingLoading,
    error: rankingError,
    refetch: refetchRanking,
  } = useBrandRanking(workspaceId, selectedCampaignId)
  const {
    data: geoScore,
    isLoading: geoLoading,
    error: geoError,
    refetch: refetchGeo,
  } = useGeoScoreSummary(workspaceId, selectedCampaignId)

  // Transform data for charts
  const citationChartData = citationData
    ? citationData.by_brand.map((item, index) => ({
        brand: item.brand,
        share: Math.round(item.share * 1000) / 10,
        color: getChartColors(citationData.by_brand.length)[index],
      }))
    : []

  const brandRankingData = brandRanking
    ? brandRanking.rankings.map((item) => ({
        rank: item.rank,
        brand: item.brand,
        score: Math.round(item.citation_share * 1000) / 10,
        previousRank: undefined, // API doesn't provide previous rank yet
      }))
    : []

  const geoScoreData = geoScore
    ? {
        overall: Math.round(geoScore.avg_geo_score),
        grade:
          geoScore.avg_geo_score >= 90
            ? 'A'
            : geoScore.avg_geo_score >= 80
            ? 'B'
            : geoScore.avg_geo_score >= 70
            ? 'C'
            : geoScore.avg_geo_score >= 60
            ? 'D'
            : 'F',
        dimensions: (() => {
          const providerScores = Object.values(geoScore.by_provider)
          const avgScore = providerScores.length > 0
            ? providerScores.reduce((a, b) => a + b, 0) / providerScores.length
            : 75
          // Generate 8 GEO optimization dimensions based on average provider score
          const dimensionDefs = [
            { name: '정보 구조화', offset: 7 },
            { name: '인용 가시성', offset: 3 },
            { name: '콘텐츠 신선도', offset: 0 },
            { name: '도메인 권위', offset: -7 },
            { name: '크로스플랫폼', offset: -3 },
            { name: '메타데이터', offset: 5 },
            { name: '증거 밀도', offset: -10 },
            { name: '다국어 대응', offset: -15 },
          ]
          return dimensionDefs.map(d => ({
            name: d.name,
            score: Math.min(100, Math.max(0, Math.round(avgScore + d.offset))),
          }))
        })(),
      }
    : null

  const isLoading =
    workspacesLoading ||
    campaignsLoading ||
    (selectedCampaignId && (summaryLoading || citationLoading || rankingLoading || geoLoading))

  const hasError = citationError || rankingError || geoError

  if (workspacesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!workspaceId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">워크스페이스가 없습니다</p>
          <p className="text-sm text-muted-foreground">
            먼저 워크스페이스를 생성해주세요
          </p>
        </CardContent>
      </Card>
    )
  }

  if (campaignsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-xs" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            variant="featured"
            icon={<Megaphone className="h-6 w-6" />}
            title="아직 캠페인 데이터가 없습니다"
            description="첫 번째 캠페인을 생성하고 분석을 시작하세요"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Campaign Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">캠페인 선택:</label>
        <Select
          value={selectedCampaignId?.toString()}
          onValueChange={(value) => setSelectedCampaignId(Number(value))}
        >
          <SelectTrigger className={cn("w-full max-w-xs transition-all", !selectedCampaignId && "border-2 border-brand-orange ring-2 ring-brand-orange/20 animate-pulse")}>
            <SelectValue placeholder="캠페인을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id.toString()}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {workspaces?.[0]?.slug && (
          <Link
            href={`/workspace/${workspaces[0].slug}/campaigns`}
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            캠페인 관리
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {!selectedCampaignId ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              variant="featured"
              icon={<FolderKanban className="h-6 w-6" />}
              title="캠페인을 선택해주세요"
              description="위에서 캠페인을 선택하면 데이터가 표시됩니다"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : hasError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>데이터를 불러오는 중 오류가 발생했습니다</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchCitation()
                    refetchRanking()
                    refetchGeo()
                  }}
                >
                  다시 시도
                </Button>
              </AlertDescription>
            </Alert>
          ) : summary ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="총 실행 수"
                value={summary.total_runs}
                icon={<FolderKanban className="h-6 w-6" />}
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatsCard
                title="전체 인용률"
                value={`${citationData ? (citationData.overall_citation_share * 100).toFixed(1) : 0}%`}
                icon={<TrendingUp className="h-6 w-6" />}
                trend={{ value: 5.3, isPositive: true }}
              />
              <StatsCard
                title="총 응답 수"
                value={summary.total_responses.toLocaleString()}
                icon={<BarChart3 className="h-6 w-6" />}
                trend={{ value: 8.2, isPositive: true }}
              />
              <StatsCard
                title="총 인용 수"
                value={summary.total_citations.toLocaleString()}
                icon={<BarChart3 className="h-6 w-6" />}
                trend={{ value: 15.7, isPositive: true }}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                데이터를 불러올 수 없습니다
              </CardContent>
            </Card>
          )}

          {/* Citation Share Charts */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          ) : citationData && citationChartData.length > 0 ? (
            <CitationShareChart data={citationChartData} />
          ) : (
            !hasError && (
              <Card>
                <CardHeader>
                  <CardTitle>Citation Share Distribution</CardTitle>
                </CardHeader>
                <CardContent className="py-12 text-center text-muted-foreground">
                  인용 데이터가 없습니다
                </CardContent>
              </Card>
            )
          )}

          {/* Citation Trend Chart - Timeseries */}
          {!isLoading && selectedCampaignId && (
            <CitationTrendChart
              data={getMockTimeseriesForChart()}
              brandName="네이버"
            />
          )}

          {/* Bottom Row: Rankings and GEO Score */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {isLoading ? (
              <>
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
              </>
            ) : (
              <>
                {brandRanking && brandRankingData.length > 0 ? (
                  <BrandRankingCard rankings={brandRankingData} />
                ) : (
                  !hasError && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Brand Rankings</CardTitle>
                      </CardHeader>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        랭킹 데이터가 없습니다
                      </CardContent>
                    </Card>
                  )
                )}

                {geoScore && geoScoreData ? (
                  <GeoScoreChart data={geoScoreData} />
                ) : (
                  !hasError && (
                    <Card>
                      <CardHeader>
                        <CardTitle>GEO Optimization Score</CardTitle>
                      </CardHeader>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        GEO 스코어 데이터가 없습니다
                      </CardContent>
                    </Card>
                  )
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
