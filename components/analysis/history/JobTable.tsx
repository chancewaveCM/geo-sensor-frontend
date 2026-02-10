'use client'

import { useState, useEffect } from 'react'
import { getJobs } from '@/lib/api/pipeline'
import type { PipelineJobSummary, PipelineJobListResponse } from '@/types/pipeline'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { History, ChevronRight } from 'lucide-react'

interface JobTableProps {
  onSelectJob: (jobId: number) => void
  className?: string
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function calculateElapsedTime(startedAt: string | null, completedAt: string | null): string {
  if (!startedAt) return '-'

  const start = new Date(startedAt)
  const end = completedAt ? new Date(completedAt) : new Date()
  const diffMs = end.getTime() - start.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60

  if (hours > 0) {
    return `${hours}시간 ${mins}분`
  }
  if (mins > 0) {
    return `${mins}분`
  }
  return `${diffSecs}초`
}

export function JobTable({ onSelectJob, className }: JobTableProps) {
  const [jobs, setJobs] = useState<PipelineJobSummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [offset, setOffset] = useState(0)
  const limit = 20

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true)
        setError(null)
        const data = await getJobs(undefined, limit, offset)

        // Apply status filter on client side
        let filteredJobs = data.jobs
        if (statusFilter !== 'all') {
          filteredJobs = data.jobs.filter(job => job.status === statusFilter)
        }

        setJobs(filteredJobs)
        setTotal(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : '작업 목록을 불러오는데 실패했습니다')
        console.error('Failed to load jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [offset, statusFilter])

  const handleRetry = () => {
    setOffset(0)
    setStatusFilter('all')
  }

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상태</TableHead>
                <TableHead>기업명</TableHead>
                <TableHead>쿼리 수</TableHead>
                <TableHead>진행률</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>소요시간</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <EmptyState
          icon={<History className="h-6 w-6" />}
          title="오류가 발생했습니다"
          description={error}
          action={
            <Button onClick={handleRetry} variant="outline">
              다시 시도
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
            <SelectItem value="executing_queries">실행중</SelectItem>
            <SelectItem value="failed">실패</SelectItem>
            <SelectItem value="cancelled">취소됨</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={<History className="h-6 w-6" />}
          title="실행 기록이 없습니다"
          description="파이프라인을 실행하면 여기에 기록이 표시됩니다"
        />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상태</TableHead>
                  <TableHead>기업명</TableHead>
                  <TableHead>쿼리 수</TableHead>
                  <TableHead>진행률</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>소요시간</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectJob(job.id)}
                  >
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {job.company_name || '-'}
                    </TableCell>
                    <TableCell>
                      {job.completed_queries}/{job.total_queries}
                      {job.failed_queries > 0 && (
                        <span className="ml-1 text-xs text-destructive">
                          ({job.failed_queries} 실패)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{job.progress_percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.started_at ? formatRelativeTime(job.started_at) : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {calculateElapsedTime(job.started_at, job.completed_at)}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              총 {total}개 중 {offset + 1}-{Math.min(offset + limit, total)}개 표시
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
              >
                다음
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
