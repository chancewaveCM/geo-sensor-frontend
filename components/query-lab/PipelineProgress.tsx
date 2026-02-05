"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, XCircle, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import type { PipelineJobStatus } from "@/types/pipeline"

interface PipelineProgressProps {
  job: PipelineJobStatus;
  onCancel: () => void;
  isCancelling: boolean;
}

const statusConfig = {
  pending: { label: '대기 중', variant: 'secondary' as const, icon: Clock },
  running: { label: '실행 중', variant: 'default' as const, icon: Loader2 },
  completed: { label: '완료', variant: 'success' as const, icon: CheckCircle2 },
  failed: { label: '실패', variant: 'destructive' as const, icon: XCircle },
  cancelled: { label: '취소됨', variant: 'outline' as const, icon: AlertCircle },
}

function formatElapsed(seconds: number | null): string {
  if (seconds === null) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
}

export function PipelineProgress({ job, onCancel, isCancelling }: PipelineProgressProps) {
  const config = statusConfig[job.status]
  const StatusIcon = config.icon
  const isRunning = job.status === 'running' || job.status === 'pending'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">파이프라인 진행 상황</CardTitle>
        <Badge variant={config.variant} className="flex items-center gap-1">
          <StatusIcon className={`h-3 w-3 ${job.status === 'running' ? 'animate-spin' : ''}`} />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>진행률</span>
            <span>{job.progress_percentage}%</span>
          </div>
          <Progress
            value={job.progress_percentage}
            className={job.status === 'running' ? 'animate-pulse' : ''}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{job.completed_queries}</div>
            <div className="text-muted-foreground">완료</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{job.failed_queries}</div>
            <div className="text-muted-foreground">실패</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{job.total_queries}</div>
            <div className="text-muted-foreground">전체</div>
          </div>
        </div>

        {/* Elapsed Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>경과 시간</span>
          <span>{formatElapsed(job.elapsed_seconds)}</span>
        </div>

        {/* Error Message */}
        {job.error_message && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {job.error_message}
          </div>
        )}

        {/* Cancel Button */}
        {isRunning && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                취소 중...
              </>
            ) : (
              '파이프라인 취소'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
