"use client"

import type { ComponentType } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  GitBranch,
  Layers,
  Loader2,
  XCircle,
  Zap,
} from "lucide-react"
import type { PipelineCategory, PipelineJobStatus, PipelineStatus } from "@/types/pipeline"
import { ACTIVE_PIPELINE_STATUSES } from "@/types/pipeline"

interface PipelineProgressProps {
  job: PipelineJobStatus
  onCancel: () => void
  isCancelling: boolean
  categories?: PipelineCategory[]
  onViewResults?: () => void
}

const statusConfig: Record<
  PipelineStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline" | "success"
    icon: ComponentType<{ className?: string }>
  }
> = {
  pending: { label: "대기 중", variant: "secondary", icon: Clock },
  generating_categories: { label: "카테고리 생성 중", variant: "default", icon: Layers },
  expanding_queries: { label: "쿼리 확장 중", variant: "default", icon: GitBranch },
  executing_queries: { label: "쿼리 실행 중", variant: "default", icon: Zap },
  completed: { label: "완료", variant: "success", icon: CheckCircle2 },
  failed: { label: "실패", variant: "destructive", icon: XCircle },
  cancelled: { label: "취소됨", variant: "outline", icon: AlertCircle },
}

const PIPELINE_STEPS = [
  { status: "generating_categories", label: "카테고리 생성", icon: Layers },
  { status: "expanding_queries", label: "쿼리 확장", icon: GitBranch },
  { status: "executing_queries", label: "쿼리 실행", icon: Zap },
] as const

function getStepState(stepStatus: PipelineStatus, currentStatus: PipelineStatus) {
  const order: PipelineStatus[] = [
    "pending",
    "generating_categories",
    "expanding_queries",
    "executing_queries",
    "completed",
  ]

  if (currentStatus === "failed" || currentStatus === "cancelled") {
    return "upcoming" as const
  }

  const currentIdx = order.indexOf(currentStatus)
  const stepIdx = order.indexOf(stepStatus)

  if (currentIdx > stepIdx) return "completed" as const
  if (currentIdx === stepIdx) return "current" as const
  return "upcoming" as const
}

function formatElapsed(seconds: number | null): string {
  if (seconds === null) return "-"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
}

export function PipelineProgress({
  job,
  onCancel,
  isCancelling,
  categories = [],
  onViewResults,
}: PipelineProgressProps) {
  const config = statusConfig[job.status]
  const StatusIcon = config.icon
  const isRunning = ACTIVE_PIPELINE_STATUSES.includes(job.status)

  const showIndeterminate =
    job.status === "generating_categories" || job.status === "expanding_queries"

  const processedQueries = job.completed_queries + job.failed_queries

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">파이프라인 진행 상태</CardTitle>
        <Badge variant={config.variant} className="flex items-center gap-1">
          <StatusIcon className={`h-3 w-3 ${isRunning && job.status !== "pending" ? "animate-spin" : ""}`} />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {PIPELINE_STEPS.map((step, index) => {
            const Icon = step.icon
            const state = getStepState(step.status, job.status)

            return (
              <div key={step.status} className="flex items-center gap-2">
                <div
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs",
                    state === "current" ? "border-primary text-primary" : "",
                    state === "completed" ? "border-success text-success" : "",
                    state === "upcoming" ? "border-muted-foreground/30 text-muted-foreground" : "",
                  ].join(" ")}
                >
                  {state === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className={`h-4 w-4 ${state === "current" ? "animate-spin" : ""}`} />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{step.label}</span>
                {index < PIPELINE_STEPS.length - 1 && (
                  <span className="mx-1 hidden flex-1 border-t border-dashed border-border md:block" />
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>진행률</span>
            <span>{showIndeterminate ? "진행 중..." : `${job.progress_percentage}%`}</span>
          </div>
          {showIndeterminate ? (
            <Progress value={100} className="animate-pulse" />
          ) : (
            <Progress value={job.progress_percentage} />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{job.completed_queries}</div>
            <div className="text-muted-foreground">완료</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{job.failed_queries}</div>
            <div className="text-muted-foreground">실패</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{job.total_queries}</div>
            <div className="text-muted-foreground">전체</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>경과 시간</span>
          <span>{formatElapsed(job.elapsed_seconds)}</span>
        </div>

        {(job.status === "expanding_queries" || job.status === "executing_queries" || job.status === "completed") && (
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">
              카테고리 {categories.length}개 생성됨
              {job.status === "executing_queries" || job.status === "completed"
                ? ` · 쿼리 ${processedQueries}/${job.total_queries} 처리`
                : ""}
            </p>
            {categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {categories.slice(0, 6).map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {job.error_message && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {job.error_message}
          </div>
        )}

        {isRunning && (
          <Button variant="outline" className="w-full" onClick={onCancel} disabled={isCancelling}>
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                취소 중...
              </>
            ) : (
              "파이프라인 취소"
            )}
          </Button>
        )}

        {job.status === "completed" && onViewResults && (
          <Button className="w-full" onClick={onViewResults}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            분석 결과 보기
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
