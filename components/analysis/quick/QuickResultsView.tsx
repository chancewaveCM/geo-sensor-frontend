'use client'

import { useState, useEffect } from 'react'
import { ResultsBrowser } from '@/components/analysis/shared/ResultsBrowser'
import { getJobStatus, getJobCategories } from '@/lib/api/pipeline'
import type { PipelineJobStatus, PipelineCategory } from '@/types/pipeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, ArrowLeft, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickResultsViewProps {
  jobId: number
  onBack: () => void
  onNewAnalysis: () => void
  className?: string
}

export function QuickResultsView({
  jobId,
  onBack,
  onNewAnalysis,
  className
}: QuickResultsViewProps) {
  const [jobStatus, setJobStatus] = useState<PipelineJobStatus | null>(null)
  const [categories, setCategories] = useState<PipelineCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [status, categoriesResponse] = await Promise.all([
          getJobStatus(jobId),
          getJobCategories(jobId)
        ])

        setJobStatus(status)
        setCategories(categoriesResponse.categories)
      } catch (err) {
        setError(err instanceof Error ? err.message : '결과 조회 중 오류가 발생했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [jobId])

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button onClick={onBack} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!jobStatus) {
    return null
  }

  // Calculate stats from job status (not categories)
  const totalQueries = jobStatus.total_queries
  const successQueries = jobStatus.completed_queries
  const failedQueries = jobStatus.failed_queries

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">분석 완료</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {jobStatus.completed_at
                    ? new Date(jobStatus.completed_at).toLocaleString('ko-KR')
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">총 쿼리</p>
              <p className="text-2xl font-bold">{totalQueries}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">성공</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-green-600">{successQueries}</p>
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  {totalQueries > 0 ? Math.round((successQueries / totalQueries) * 100) : 0}%
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">실패</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-red-600">{failedQueries}</p>
                {failedQueries > 0 && (
                  <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                    {totalQueries > 0 ? Math.round((failedQueries / totalQueries) * 100) : 0}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Browser */}
      <ResultsBrowser jobId={jobId} categories={categories} />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
        <Button
          onClick={onNewAnalysis}
          className="flex-1"
        >
          <Zap className="mr-2 h-4 w-4" />
          새 분석
        </Button>
      </div>
    </div>
  )
}
