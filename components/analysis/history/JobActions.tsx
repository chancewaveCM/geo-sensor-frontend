'use client'

import { useState } from 'react'
import { rerunQuerySet, cancelJob } from '@/lib/api/pipeline'
import type { PipelineJobSummary } from '@/types/pipeline'
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
import { cn } from '@/lib/utils'
import { RefreshCw, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface JobActionsProps {
  job: PipelineJobSummary
  onRerun: (newJobId: number) => void
  onRefresh: () => void
  className?: string
}

const RUNNING_STATUSES = ['pending', 'generating_categories', 'expanding_queries', 'executing_queries']

export function JobActions({ job, onRerun, onRefresh, className }: JobActionsProps) {
  const [rerunning, setRerunning] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showRerunDialog, setShowRerunDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const isRunning = RUNNING_STATUSES.includes(job.status)
  const canRerun = job.query_set_id !== null

  async function handleRerun() {
    if (!job.query_set_id) return

    try {
      setRerunning(true)
      const response = await rerunQuerySet(job.query_set_id, job.llm_providers)

      toast.success('재실행 시작', {
        description: `작업 #${response.job_id}이 시작되었습니다`,
      })

      onRerun(response.job_id)
    } catch (err) {
      toast.error('재실행 실패', {
        description: err instanceof Error ? err.message : '작업을 재실행하는데 실패했습니다',
      })
      console.error('Failed to rerun query set:', err)
    } finally {
      setRerunning(false)
      setShowRerunDialog(false)
    }
  }

  async function handleCancel() {
    try {
      setCancelling(true)
      await cancelJob(job.id)

      toast.success('작업 취소', {
        description: `작업 #${job.id}이 취소되었습니다`,
      })

      onRefresh()
    } catch (err) {
      toast.error('취소 실패', {
        description: err instanceof Error ? err.message : '작업을 취소하는데 실패했습니다',
      })
      console.error('Failed to cancel job:', err)
    } finally {
      setCancelling(false)
      setShowCancelDialog(false)
    }
  }

  return (
    <>
      <div className={cn('flex items-center gap-2', className)}>
        {canRerun && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRerunDialog(true)}
            disabled={rerunning || isRunning}
            className="gap-2"
          >
            {rerunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            재실행
          </Button>
        )}

        {isRunning && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCancelDialog(true)}
            disabled={cancelling}
            className="gap-2 text-destructive hover:text-destructive"
          >
            {cancelling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            취소
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={rerunning || cancelling}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          새로고침
        </Button>
      </div>

      <AlertDialog open={showRerunDialog} onOpenChange={setShowRerunDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작업 재실행</AlertDialogTitle>
            <AlertDialogDescription>
              동일한 쿼리 세트로 새로운 작업을 시작합니다.
              <br />
              <br />
              <strong>기업:</strong> {job.company_name}
              <br />
              <strong>쿼리 수:</strong> {job.total_queries}개
              <br />
              <strong>LLM 제공자:</strong> {job.llm_providers.join(', ')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rerunning}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleRerun} disabled={rerunning}>
              {rerunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  재실행 중...
                </>
              ) : (
                '재실행'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작업 취소</AlertDialogTitle>
            <AlertDialogDescription>
              실행 중인 작업을 취소하시겠습니까?
              <br />
              이미 완료된 쿼리는 유지되지만, 진행 중인 작업은 중단됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>아니오</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  취소 중...
                </>
              ) : (
                '예, 취소합니다'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
