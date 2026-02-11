'use client'

import { useState } from 'react'
import { PerformanceMetricCard } from '@/components/stitch/dashboard/strategic/PerformanceMetricCard'
import { CitationShareChart } from '@/components/charts/CitationShareChart'
import { BrandRankingTable, BrandRanking } from '@/components/stitch/dashboard/strategic/BrandRankingTable'
import { TrendChart } from '@/components/stitch/dashboard/strategic/TrendChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { CampaignSelector } from '@/components/stitch/dashboard/CampaignSelector'
import { useDashboardCampaign } from '@/lib/hooks/use-dashboard-campaign'
import {
  useCitationShare,
  useBrandRanking,
  useTimeseries,
  useCampaignSummary,
  useGeoScoreSummary
} from '@/lib/hooks/use-campaigns'

export default function StrategicAnalysisPage() {
  const [timeRange, setTimeRange] = useState('30D')

  const { workspaceId, campaignId } = useDashboardCampaign()
  const { data: citationShare, isLoading: csLoading, isError: csError } = useCitationShare(workspaceId, campaignId)
  const { data: brandRanking, isLoading: brLoading, isError: brError } = useBrandRanking(workspaceId, campaignId)
  const { data: timeseries, isLoading: tsLoading, isError: tsError } = useTimeseries(workspaceId, campaignId)
  const { data: summary, isLoading: smLoading, isError: smError } = useCampaignSummary(workspaceId, campaignId)
  const { data: geoScore, isLoading: gsLoading, isError: gsError } = useGeoScoreSummary(workspaceId, campaignId)

  const isLoading = csLoading || brLoading || tsLoading || smLoading || gsLoading
  const isError = csError || brError || tsError || smError || gsError

  if (!campaignId) {
    return (
      <div className="space-y-6">
        <CampaignSelector />
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Select a campaign above to view strategic analytics.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CampaignSelector />
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <CampaignSelector />
        <div className="flex items-center justify-center h-64 text-destructive">
          Failed to load analytics data. Please try again later.
        </div>
      </div>
    )
  }

  // Map real data for components
  const pawcScore = (geoScore?.avg_geo_score ?? 0) * 100
  const strokeDashoffset = 552.9 * (1 - (pawcScore / 100))

  const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']
  const citationData = (citationShare?.by_brand ?? []).map((b, i) => ({
    brand: b.brand,
    share: b.share * 100,
    color: chartColors[i % chartColors.length],
  }))

  const brandRankings: BrandRanking[] = (brandRanking?.rankings ?? []).map(r => ({
    rank: r.rank,
    brand: r.brand,
    mentions: r.citation_count,
    share: r.citation_share * 100,
    change: 0, // Phase 2: historical comparison
  }))

  const trendData = (timeseries?.time_series ?? []).map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Target Brand': point.citation_share_overall * 100,
  }))
  const trendBrands = [{ name: 'Target Brand', color: 'hsl(var(--chart-1))' }]

  return (
    <div className="space-y-6 animate-fade-in">
      <CampaignSelector />

      {/* Hero Section - PAWC Score Card */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-navy via-brand-navy-light to-chart-4 text-white p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 w-full md:w-auto">
            <div>
              <h3 className="text-white/70 font-medium tracking-wide text-sm uppercase">
                Overall Performance Index
              </h3>
              <div className="flex items-baseline gap-4 mt-1">
                <span className="text-7xl font-bold">{pawcScore.toFixed(1)}</span>
                <div className="flex items-center bg-success/20 text-success px-2 py-1 rounded-full text-sm font-bold border border-success/30">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  --
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-2">PAWC Score Card</h2>
            </div>
            <p className="text-white/70 max-w-md">
              Track your AI citation performance across search engines. Detailed trend analysis available below.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg">
              Generate Detailed Strategy
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" role="img" aria-label={`${pawcScore.toFixed(1)}% efficiency rating`}>
              <circle
                className="text-white/10"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
              />
              <circle
                className="text-primary"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeDasharray="552.9"
                strokeDashoffset={strokeDashoffset}
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{pawcScore.toFixed(1)}%</span>
              <span className="text-xs text-white/70 uppercase font-bold tracking-widest">
                Efficiency
              </span>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
      </section>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Key Performance Drivers</h2>
        <div className="flex bg-muted p-1 rounded-lg">
          {['7D', '30D', '90D', 'Custom'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                timeRange === range
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <PerformanceMetricCard
          title="Citation Share"
          value={`${((citationShare?.overall_citation_share ?? 0) * 100).toFixed(1)}%`}
          change={0}
          trend="up"
        />
        <PerformanceMetricCard
          title="Total Mentions"
          value={(summary?.total_citations ?? 0).toLocaleString()}
          change={0}
          trend="up"
        />
        <PerformanceMetricCard
          title="Response Quality"
          value={((geoScore?.avg_geo_score ?? 0) * 10).toFixed(1)}
          change={0}
          trend="up"
          unit="/10"
        />
        <PerformanceMetricCard
          title="Coverage Rate"
          value={`${summary?.latest_run ? Math.round((summary.latest_run.completed_queries / Math.max(summary.latest_run.total_queries, 1)) * 100) : 0}%`}
          change={0}
          trend="up"
        />
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Citation Share Chart */}
        <CitationShareChart data={citationData} title="Citation Share Distribution" />

        {/* Brand Rankings */}
        <BrandRankingTable brands={brandRankings} />

        {/* SHAP Contribution Analysis */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">SHAP Contribution Analysis</CardTitle>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <AlertCircle className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Schema Markup Enhancement', value: 18.5, width: 75, positive: true },
                { label: 'Content Freshness Cycle', value: 12.3, width: 55, positive: true },
                { label: 'Page Load Latency', value: -2.1, width: 15, positive: false },
                { label: 'E-E-A-T Signal Depth', value: 4.8, width: 25, positive: true },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">{item.label}</span>
                    <span className={`font-bold ${item.positive ? 'text-primary' : 'text-error'}`}>
                      {item.value > 0 ? '+' : ''}{item.value}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.positive ? 'bg-primary' : 'bg-error'
                      }`}
                      style={{ width: `${item.width}%`, opacity: item.positive ? 0.7 : 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <TrendChart
          data={trendData}
          brands={trendBrands}
          timeRange={timeRange}
          title="Performance Trends Over Time"
        />
      </div>

      {/* Report Footer */}
      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold">Latest Citations Report Available</p>
              <p className="text-xs text-muted-foreground">
                Data refreshed on page load • Source: Multi-LLM API Bridge
              </p>
            </div>
          </div>
          <Button variant="outline" className="hover:border-primary/50">
            View Detailed Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <div className="h-64 rounded-lg bg-muted animate-pulse" />

      {/* Metrics grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>

      {/* Charts grid skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-80 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}
