'use client'

import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { PipelineJobStatus, PipelineCategory } from '@/types/pipeline'

interface ProgressTrackerProps {
  job: PipelineJobStatus
  categories?: PipelineCategory[]
  onCancel?: () => void
  onViewResults?: () => void
  className?: string
}

const STATUS_CONFIG = {
  pending: { label: '대기 중', icon: Clock, variant: 'secondary' as const },
  generating_categories: { label: '카테고리 생성 중', icon: Loader2, variant: 'default' as const },
  expanding_queries: { label: '쿼리 확장 중', icon: Loader2, variant: 'default' as const },
  executing_queries: { label: '쿼리 실행 중', icon: Loader2, variant: 'default' as const },
  completed: { label: '완료', icon: CheckCircle2, variant: 'success' as const },
  failed: { label: '실패', icon: XCircle, variant: 'destructive' as const },
  cancelled: { label: '취소됨', icon: AlertCircle, variant: 'secondary' as const },
}

export function ProgressTracker({ job, categories, onCancel, onViewResults, className }: ProgressTrackerProps) {
  const statusConfig = STATUS_CONFIG[job.status]
  const StatusIcon = statusConfig.icon
  const isRunning = ['pending', 'generating_categories', 'expanding_queries', 'executing_queries'].includes(job.status)

  const steps = [
    { key: 'generating_categories', label: '카테고리 생성', active: job.status === 'generating_categories' },
    { key: 'expanding_queries', label: '쿼리 확장', active: job.status === 'expanding_queries' },
    { key: 'executing_queries', label: '쿼리 실행', active: job.status === 'executing_queries' },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === job.status)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn('h-5 w-5', isRunning && StatusIcon === Loader2 && 'animate-spin')} />
            <span>파이프라인 진행 상황</span>
          </div>
          <Badge variant={statusConfig.variant}>
            {statusConfig.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx
            const isActive = step.active
            return (
              <div key={step.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold',
                      isCompleted && 'border-primary bg-primary text-primary-foreground',
                      isActive && 'border-primary bg-background text-primary',
                      !isCompleted && !isActive && 'border-muted bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 flex-1',
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">진행률</span>
            <span className="text-muted-foreground">{job.progress_percentage.toFixed(0)}%</span>
          </div>
          <Progress value={job.progress_percentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{job.completed_queries}</div>
            <div className="text-xs text-muted-foreground">완료</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-destructive">{job.failed_queries}</div>
            <div className="text-xs text-muted-foreground">실패</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{job.total_queries}</div>
            <div className="text-xs text-muted-foreground">전체</div>
          </div>
        </div>

        {/* Elapsed Time */}
        {job.elapsed_seconds !== null && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>경과 시간: {Math.floor(job.elapsed_seconds / 60)}분 {Math.floor(job.elapsed_seconds % 60)}초</span>
          </div>
        )}

        {/* Error Message */}
        {job.error_message && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{job.error_message}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isRunning && onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              취소
            </Button>
          )}
          {job.status === 'completed' && onViewResults && (
            <Button onClick={onViewResults} className="flex-1">
              결과 보기
            </Button>
          )}
        </div>

        {/* Category Count */}
        {categories && categories.length > 0 && (
          <div className="border-t pt-4">
            <div className="text-sm font-medium">생성된 카테고리: {categories.length}개</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge key={cat.id} variant="outline">
                  {cat.name} ({cat.query_count})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
