'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles, Clock, Zap, Type, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import { getQueryResponses } from '@/lib/api/analysis'
import type { RawLLMResponse } from '@/types/pipeline'

interface ResponseComparisonProps {
  queryId: number
  queryText: string
  className?: string
}

export function ResponseComparison({ queryId, queryText, className }: ResponseComparisonProps) {
  const [responses, setResponses] = useState<RawLLMResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchResponses() {
      try {
        setLoading(true)
        setError(null)
        const data = await getQueryResponses(queryId)
        if (!abortController.signal.aborted) {
          setResponses(data.responses)
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : '응답을 불러오는데 실패했습니다')
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }
    fetchResponses()

    return () => {
      abortController.abort()
    }
  }, [queryId])

  // Calculate word count for a response
  const getWordCount = (content: string | null): number => {
    if (!content) return 0
    // Simple word count: split by whitespace
    return content.trim().split(/\s+/).length
  }

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('text-sm text-destructive', className)}>
        에러: {error}
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <div className={cn('rounded-lg border border-dashed p-8', className)}>
        <EmptyState
          icon={<Sparkles className="h-6 w-6" />}
          title="응답 없음"
          description="이 쿼리에 대한 LLM 응답이 없습니다"
        />
      </div>
    )
  }

  // Determine grid layout based on number of responses
  const gridClass = responses.length === 1
    ? 'grid gap-4'
    : responses.length === 2
    ? 'grid gap-4 md:grid-cols-2'
    : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Query Display */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900">쿼리</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800">{queryText}</p>
        </CardContent>
      </Card>

      {/* Response Count Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">응답 비교</h3>
        <Badge variant="secondary">{responses.length}개 제공자</Badge>
      </div>

      {/* Response Comparison Grid */}
      <div className={gridClass}>
        {responses.map((response) => {
          const wordCount = getWordCount(response.content)

          return (
            <Card key={response.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={response.error_message ? 'destructive' : 'default'}
                    className="text-sm"
                  >
                    {response.llm_provider}
                  </Badge>
                  {response.error_message && (
                    <Badge variant="destructive" className="text-xs">
                      실패
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{response.llm_model}</div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Response Content */}
                {response.error_message ? (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    ❌ {response.error_message}
                  </div>
                ) : (
                  <>
                    {/* Content Stats */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">단어 수</span>
                          <span className="text-sm font-semibold">{wordCount}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">문자 수</span>
                          <span className="text-sm font-semibold">
                            {response.content?.length ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Response Text */}
                    <div className="max-h-64 overflow-y-auto border rounded-md p-3 bg-background">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {response.content}
                      </p>
                    </div>
                  </>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 pt-4 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>{response.tokens_used ?? '-'} tokens</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{response.latency_ms != null ? `${response.latency_ms}ms` : '-'}</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground">
                  {new Date(response.created_at).toLocaleString('ko-KR')}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
