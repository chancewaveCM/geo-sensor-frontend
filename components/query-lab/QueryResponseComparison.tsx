'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { getQueryResponses } from '@/lib/api/pipeline'
import type { RawLLMResponse } from '@/types/pipeline'
import type { Citation } from '@/types/query-lab'

interface QueryResponseComparisonProps {
  queryId: number
  queryText: string
}

export function QueryResponseComparison({
  queryId,
  queryText,
}: QueryResponseComparisonProps) {
  const [responses, setResponses] = useState<RawLLMResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResponses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getQueryResponses(queryId)
      setResponses(data.responses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load responses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResponses()
  }, [queryId])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-6 w-6" />}
        title="응답을 불러올 수 없습니다"
        description={error}
        action={
          <Button onClick={fetchResponses} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        }
      />
    )
  }

  if (responses.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-6 w-6" />}
        title="이 쿼리에 대한 응답이 없습니다"
        description="아직 LLM 응답이 생성되지 않았습니다."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Query Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Query</h2>
        <p className="text-sm text-muted-foreground">{queryText}</p>
      </div>

      {/* Provider Responses Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {responses.map((response) => (
          <ResponseCard key={response.id} response={response} />
        ))}
      </div>
    </div>
  )
}

interface ResponseCardProps {
  response: RawLLMResponse
}

function ResponseCard({ response }: ResponseCardProps) {
  // Parse citations from response content if available
  // In a real implementation, citations would come from the backend
  const citations: Citation[] = []
  const wordCount = response.content.split(/\s+/).length

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="capitalize">
            {response.llm_provider}
          </Badge>
          <span className="text-xs text-muted-foreground">{response.llm_model}</span>
        </div>
        <CardTitle className="text-base font-semibold">Response</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Response Text */}
        <div className="max-h-[300px] overflow-y-auto rounded-lg border bg-muted/30 p-4">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {response.content}
          </p>
        </div>

        {/* Citations (if available) */}
        {citations.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">인용된 브랜드:</p>
            <div className="flex flex-wrap gap-2">
              {citations.map((citation, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs"
                >
                  {citation.brandName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <p>
              <span className="font-medium">Citations:</span>{' '}
              {citations.length}
            </p>
            <p>
              <span className="font-medium">Words:</span> {wordCount}
            </p>
          </div>
          <div className="space-y-1 text-right">
            {response.tokens_used && (
              <p>
                <span className="font-medium">Tokens:</span>{' '}
                {response.tokens_used.toLocaleString()}
              </p>
            )}
            {response.latency_ms && (
              <p>
                <span className="font-medium">Latency:</span>{' '}
                {response.latency_ms}ms
              </p>
            )}
          </div>
        </div>

        {/* Error Message (if any) */}
        {response.error_message && (
          <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
            <p className="font-medium">Error:</p>
            <p className="mt-1">{response.error_message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Query Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
