'use client'

import { useState, useEffect } from 'react'
import { getJobStatus, getJobCategories, getJobQueries, getQueryResponses } from '@/lib/api/pipeline'
import type { PipelineJobStatus, PipelineCategory, ExpandedQuery, RawLLMResponse } from '@/types/pipeline'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { ArrowLeft, Clock, Eye, ChevronRight } from 'lucide-react'

interface JobDetailProps {
  jobId: number
  onBack: () => void
  className?: string
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function JobDetail({ jobId, onBack, className }: JobDetailProps) {
  const [job, setJob] = useState<PipelineJobStatus | null>(null)
  const [categories, setCategories] = useState<PipelineCategory[]>([])
  const [queries, setQueries] = useState<ExpandedQuery[]>([])
  const [expandedQueryId, setExpandedQueryId] = useState<number | null>(null)
  const [responses, setResponses] = useState<Record<number, RawLLMResponse[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingResponses, setLoadingResponses] = useState<number | null>(null)

  useEffect(() => {
    async function loadJobDetail() {
      try {
        setLoading(true)
        setError(null)

        const [jobData, categoriesData, queriesData] = await Promise.all([
          getJobStatus(jobId),
          getJobCategories(jobId),
          getJobQueries(jobId),
        ])

        setJob(jobData)
        setCategories(categoriesData.categories)
        setQueries(queriesData.queries)
      } catch (err) {
        setError(err instanceof Error ? err.message : '작업 상세 정보를 불러오는데 실패했습니다')
        console.error('Failed to load job detail:', err)
      } finally {
        setLoading(false)
      }
    }
    loadJobDetail()
  }, [jobId])

  async function toggleQueryResponses(queryId: number) {
    if (expandedQueryId === queryId) {
      setExpandedQueryId(null)
      return
    }

    setExpandedQueryId(queryId)

    if (!responses[queryId]) {
      try {
        setLoadingResponses(queryId)
        const data = await getQueryResponses(queryId)
        setResponses(prev => ({ ...prev, [queryId]: data.responses }))
      } catch (err) {
        console.error('Failed to load responses:', err)
        setResponses(prev => ({ ...prev, [queryId]: [] }))
      } finally {
        setLoadingResponses(null)
      }
    }
  }

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className={cn('space-y-4', className)}>
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error || '작업을 찾을 수 없습니다'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>작업 #{job.id}</CardTitle>
            <StatusBadge status={job.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">시작 시간</div>
              <div className="font-medium">{formatDateTime(job.started_at)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">완료 시간</div>
              <div className="font-medium">{formatDateTime(job.completed_at)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">진행률</div>
              <div className="font-medium">{job.progress_percentage}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">쿼리 수</div>
              <div className="font-medium">
                {job.completed_queries}/{job.total_queries}
                {job.failed_queries > 0 && (
                  <span className="ml-2 text-sm text-destructive">
                    ({job.failed_queries} 실패)
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">LLM 제공자</div>
              <div className="flex gap-2 mt-1">
                {job.llm_providers.map(provider => (
                  <Badge key={provider} variant="outline">
                    {provider}
                  </Badge>
                ))}
              </div>
            </div>
            {job.elapsed_seconds !== null && (
              <div>
                <div className="text-sm text-muted-foreground">소요 시간</div>
                <div className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor(job.elapsed_seconds / 60)}분 {job.elapsed_seconds % 60}초
                </div>
              </div>
            )}
          </div>

          {job.error_message && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="text-sm font-medium text-destructive">오류</div>
              <div className="mt-1 text-sm text-muted-foreground">{job.error_message}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>카테고리 및 쿼리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => {
            const categoryQueries = queries.filter(q => q.category_id === category.id)

            return (
              <div key={category.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{category.llm_provider}</Badge>
                    <Badge variant="secondary">{categoryQueries.length}개 쿼리</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  {categoryQueries.map(query => (
                    <div key={query.id}>
                      <div
                        className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleQueryResponses(query.id)}
                      >
                        <div className="flex-1">
                          <div className="text-sm">{query.text}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {query.status}
                            </Badge>
                            {query.response_count > 0 && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {query.response_count}개 응답
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 text-muted-foreground transition-transform',
                            expandedQueryId === query.id && 'rotate-90'
                          )}
                        />
                      </div>

                      {expandedQueryId === query.id && (
                        <div className="mt-2 space-y-2 pl-4">
                          {loadingResponses === query.id ? (
                            <div className="p-4 border rounded-md">
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ) : responses[query.id]?.length > 0 ? (
                            responses[query.id].map(response => (
                              <div key={response.id} className="rounded-md border p-3 bg-muted/30">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline">{response.llm_provider}</Badge>
                                  <div className="flex gap-2 text-xs text-muted-foreground">
                                    {response.tokens_used !== null && (
                                      <span>{response.tokens_used} tokens</span>
                                    )}
                                    {response.latency_ms !== null && (
                                      <span>{response.latency_ms}ms</span>
                                    )}
                                  </div>
                                </div>
                                {response.error_message ? (
                                  <p className="text-sm text-destructive">{response.error_message}</p>
                                ) : (
                                  <p className="text-sm whitespace-pre-wrap">{response.content}</p>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 border rounded-md text-sm text-muted-foreground">
                              응답이 없습니다
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {categories.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              카테고리가 없습니다
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
