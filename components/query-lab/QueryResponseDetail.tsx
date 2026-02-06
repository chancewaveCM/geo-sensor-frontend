"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock, Zap, MessageSquare } from "lucide-react"
import type { ExpandedQuery, RawLLMResponse } from "@/types/pipeline"

interface QueryResponseDetailProps {
  query: ExpandedQuery;
  responses: RawLLMResponse[];
  isLoading: boolean;
  error?: string | null;
}

const providerConfig: Record<string, { name: string; color: string }> = {
  gemini: { name: 'Gemini', color: 'bg-chart-4' },
  openai: { name: 'OpenAI', color: 'bg-chart-3' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function QueryResponseDetail({ query, responses, isLoading, error }: QueryResponseDetailProps) {
  return (
    <div className="space-y-4">
      {/* Query Text */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            쿼리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{query.text}</p>
        </CardContent>
      </Card>

      {/* Responses */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">응답 로딩 중...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          {error}
        </div>
      ) : responses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          응답이 없습니다
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {responses.map((response) => {
            const config = providerConfig[response.llm_provider] || {
              name: response.llm_provider,
              color: 'bg-gray-500'
            }

            return (
              <Card key={response.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      <CardTitle className="text-sm font-medium">
                        {config.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {response.llm_model}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Response Content */}
                  <div className="max-h-[300px] overflow-y-auto rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">
                    {response.error_message ? (
                      <span className="text-destructive">{response.error_message}</span>
                    ) : (
                      response.content
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {response.tokens_used && (
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {response.tokens_used.toLocaleString()} 토큰
                      </span>
                    )}
                    {response.latency_ms && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {(response.latency_ms / 1000).toFixed(2)}초
                      </span>
                    )}
                    <span>{formatDate(response.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
