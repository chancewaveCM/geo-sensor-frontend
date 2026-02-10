'use client'

import { useEffect, useState, useRef } from 'react'
import { ProgressTracker } from '@/components/analysis/shared/ProgressTracker'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { getJobStatus, getJobCategories, cancelJob } from '@/lib/api/pipeline'
import { ACTIVE_PIPELINE_STATUSES } from '@/types/pipeline'
import type { PipelineJobStatus, PipelineCategory } from '@/types/pipeline'
import { cn } from '@/lib/utils'

interface AdvancedProgressViewProps {
  jobId: number
  onComplete: (jobId: number) => void
  onBack: () => void
  className?: string
}

export function AdvancedProgressView({
  jobId,
  onComplete,
  onBack,
  className,
}: AdvancedProgressViewProps) {
  const [job, setJob] = useState<PipelineJobStatus | null>(null)
  const [categories, setCategories] = useState<PipelineCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Use ref to avoid stale closure in polling useEffect
  // The ref pattern prevents onComplete from being added to the dependency array,
  // which would cause unnecessary effect re-runs while still ensuring the latest
  // callback is always invoked when the job completes.
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let mounted = true
    let intervalId: NodeJS.Timeout

    const pollStatus = async () => {
      try {
        const statusData = await getJobStatus(jobId)

        if (!mounted) return

        setJob(statusData)
        setError(null)

        // Refresh categories on each poll
        try {
          const { categories } = await getJobCategories(jobId)
          if (mounted) {
            setCategories(categories)
          }
        } catch {
          // Non-critical, categories may not exist yet
        }

        if (statusData.status === 'completed') {
          clearInterval(intervalId)
          onCompleteRef.current(jobId)
        } else if (statusData.status === 'failed') {
          clearInterval(intervalId)
          setError(statusData.error_message || '분석 실행 중 오류가 발생했습니다')
        }
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : '상태 조회 실패')
      }
    }

    // Initial poll
    pollStatus()

    // Poll every 3 seconds
    intervalId = setInterval(pollStatus, 3000)

    return () => {
      mounted = false
      clearInterval(intervalId)
    }
  }, [jobId])

  const handleCancelClick = () => {
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {
    setShowCancelDialog(false)
    setIsCancelling(true)
    try {
      await cancelJob(jobId)
      onBack()
    } catch (err) {
      setError(err instanceof Error ? err.message : '취소 실패')
      setIsCancelling(false)
    }
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isRunning = ACTIVE_PIPELINE_STATUSES.includes(job.status)

  return (
    <div className={cn('space-y-6', className)}>
      <ProgressTracker
        job={job}
        categories={categories}
        onCancel={isRunning ? handleCancelClick : undefined}
      />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isCancelling}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로
        </Button>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>분석을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              진행 중인 분석이 중단됩니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>돌아가기</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>
              취소하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
