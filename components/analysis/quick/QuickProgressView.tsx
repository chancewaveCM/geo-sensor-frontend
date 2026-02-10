'use client'

import { useState, useEffect, useRef } from 'react'
import { ProgressTracker } from '@/components/analysis/shared/ProgressTracker'
import { getJobStatus, getJobCategories, cancelJob } from '@/lib/api/analysis'
import type { PipelineJobStatus, PipelineCategory } from '@/types/pipeline'
import { ACTIVE_PIPELINE_STATUSES } from '@/types/pipeline'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickProgressViewProps {
  jobId: number
  onComplete: (jobId: number) => void
  onBack: () => void
  className?: string
}

export function QuickProgressView({
  jobId,
  onComplete,
  onBack,
  className
}: QuickProgressViewProps) {
  const [jobStatus, setJobStatus] = useState<PipelineJobStatus | null>(null)
  const [categories, setCategories] = useState<PipelineCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Use ref to avoid stale closure in polling useEffect
  // The ref pattern prevents onComplete from being added to the dependency array,
  // which would cause unnecessary effect re-runs while still ensuring the latest
  // callback is always invoked when the job completes.
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    let isActive = true

    const fetchStatus = async () => {
      try {
        const status = await getJobStatus(jobId)

        if (!isActive) return

        setJobStatus(status)

        // Fetch categories when available
        if (status.status === 'completed' || ACTIVE_PIPELINE_STATUSES.includes(status.status)) {
          try {
            const { categories: cats } = await getJobCategories(jobId)
            if (isActive) {
              setCategories(cats)
            }
          } catch (err) {
            // Categories might not be available yet, continue polling
            console.warn('Failed to load categories:', err)
          }
        }

        // Handle completion
        if (status.status === 'completed') {
          if (interval) clearInterval(interval)
          onCompleteRef.current(jobId)
        }

        // Handle failure
        if (status.status === 'failed') {
          if (interval) clearInterval(interval)
          setError(status.error_message || '분석 중 오류가 발생했습니다')
        }
      } catch (err) {
        if (!isActive) return
        setError(err instanceof Error ? err.message : '상태 조회 중 오류가 발생했습니다')
        if (interval) clearInterval(interval)
      }
    }

    // Initial fetch
    fetchStatus()

    // Poll every 3 seconds
    interval = setInterval(fetchStatus, 3000)

    return () => {
      isActive = false
      if (interval) clearInterval(interval)
    }
  }, [jobId])

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await cancelJob(jobId)
      setError('분석이 취소되었습니다')
    } catch (err) {
      setError(err instanceof Error ? err.message : '취소 중 오류가 발생했습니다')
    } finally {
      setIsCancelling(false)
    }
  }

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <p className="font-medium">오류 발생</p>
              </div>
              <p className="text-sm text-muted-foreground">{error}</p>
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
    return (
      <div className={cn('space-y-6', className)}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">상태 조회 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress Tracker */}
      <ProgressTracker
        job={jobStatus}
        categories={categories}
      />

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

        {ACTIVE_PIPELINE_STATUSES.includes(jobStatus.status) && (
          <Button
            onClick={handleCancel}
            disabled={isCancelling}
            variant="destructive"
            className="flex-1"
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                취소 중...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                분석 취소
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
