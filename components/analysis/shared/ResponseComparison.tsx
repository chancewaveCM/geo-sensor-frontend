'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles, Clock, Zap } from 'lucide-react'
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
    async function fetchResponses() {
      try {
        setLoading(true)
        setError(null)
        const data = await getQueryResponses(queryId)
        setResponses(data.responses)
      } catch (err) {
        setError(err instanceof Error ? err.message : '응답을 불러오는데 실패했습니다')
      } finally {
        setLoading(false)
      }
    }
    fetchResponses()
  }, [queryId])

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

  return (
    <div className={cn('space-y-4', className)}>
      {/* Query Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">쿼리</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{queryText}</p>
        </CardContent>
      </Card>

      {/* Response Comparison Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {responses.map((response) => (
          <Card key={response.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={response.error_message ? 'destructive' : 'default'}>
                  {response.llm_provider}
                </Badge>
                <span className="text-xs text-muted-foreground">{response.llm_model}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {/* Response Content */}
              {response.error_message ? (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {response.error_message}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {response.content}
                  </p>
                </div>
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
        ))}
      </div>
    </div>
  )
}
