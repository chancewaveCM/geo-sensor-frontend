"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryAccordion } from "./CategoryAccordion"
import { QueryResponseDetail } from "./QueryResponseDetail"
import { getQueryResponses } from "@/lib/api/pipeline"
import type { PipelineCategory, ExpandedQuery, RawLLMResponse } from "@/types/pipeline"
import { FileText } from "lucide-react"

interface PipelineResultsProps {
  jobId: number;
  categories: PipelineCategory[];
}

export function PipelineResults({ jobId, categories }: PipelineResultsProps) {
  const [selectedQuery, setSelectedQuery] = useState<ExpandedQuery | null>(null)
  const [responses, setResponses] = useState<RawLLMResponse[]>([])
  const [isLoadingResponses, setIsLoadingResponses] = useState(false)
  const [responsesError, setResponsesError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedQuery) {
      setResponses([])
      setResponsesError(null)
      return
    }

    let cancelled = false

    setIsLoadingResponses(true)
    setResponsesError(null)
    getQueryResponses(selectedQuery.id)
      .then(data => {
        if (!cancelled) {
          setResponses(data.responses)
        }
      })
      .catch(error => {
        if (!cancelled) {
          console.error(error)
          setResponsesError("응답을 불러오는데 실패했습니다")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingResponses(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedQuery])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Left: Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            생성된 카테고리 ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryAccordion
            categories={categories}
            jobId={jobId}
            onQuerySelect={setSelectedQuery}
            selectedQueryId={selectedQuery?.id}
          />
        </CardContent>
      </Card>

      {/* Right: Response Detail */}
      <div>
        {selectedQuery ? (
          <QueryResponseDetail
            query={selectedQuery}
            responses={responses}
            isLoading={isLoadingResponses}
            error={responsesError}
          />
        ) : (
          <Card className="h-full min-h-[400px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>쿼리를 선택하면 LLM 응답을 확인할 수 있습니다</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
