'use client'

import React from 'react'
import { RunCitation } from '@/types/gallery'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface CitationHighlightProps {
  responseText: string
  citations: RunCitation[]
  onCitationClick?: (citation: RunCitation) => void
}

interface TextSegment {
  text: string
  citation?: RunCitation
}

export function CitationHighlight({
  responseText,
  citations,
  onCitationClick,
}: CitationHighlightProps) {
  // Build text segments with citations
  const segments = React.useMemo(() => {
    if (!citations.length || !responseText) {
      return [{ text: responseText }]
    }

    // Sort citations by position
    const sortedCitations = [...citations].sort(
      (a, b) => a.position_in_response - b.position_in_response
    )

    const result: TextSegment[] = []
    let currentPos = 0

    for (const citation of sortedCitations) {
      const span = citation.citation_span
      if (!span) continue

      // Find the citation span in the text starting from current position
      const spanIndex = responseText.indexOf(span, currentPos)
      if (spanIndex === -1) continue

      // Add text before citation if any
      if (spanIndex > currentPos) {
        result.push({
          text: responseText.substring(currentPos, spanIndex),
        })
      }

      // Add citation segment
      result.push({
        text: span,
        citation,
      })

      currentPos = spanIndex + span.length
    }

    // Add remaining text
    if (currentPos < responseText.length) {
      result.push({
        text: responseText.substring(currentPos),
      })
    }

    return result
  }, [responseText, citations])

  return (
    <div
      className="whitespace-pre-wrap leading-relaxed"
      data-testid="citation-highlight"
    >
      <TooltipProvider delayDuration={200}>
        {segments.map((segment, index) => {
          if (!segment.citation) {
            return <span key={index}>{segment.text}</span>
          }

          const { citation } = segment
          const isTarget = citation.is_target_brand

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span
                  className={`
                    ${
                      isTarget
                        ? 'bg-orange-100 dark:bg-orange-900/30 border-b-2 border-orange-500'
                        : 'bg-blue-100 dark:bg-blue-900/30 border-b-2 border-blue-300'
                    }
                    cursor-help transition-colors duration-200 hover:opacity-80
                  `}
                  aria-label={`Citation: ${citation.cited_brand}`}
                  onClick={() => onCitationClick?.(citation)}
                >
                  {segment.text}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-4 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">
                      {citation.cited_brand}
                    </span>
                    {isTarget && (
                      <Badge
                        variant="default"
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        타겟 브랜드
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">신뢰도:</span>
                      <span className="font-medium">
                        {(citation.confidence_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">추출 방법:</span>
                      <span className="font-medium text-xs">
                        {citation.extraction_method}
                      </span>
                    </div>
                  </div>

                  {(citation.context_before || citation.context_after) && (
                    <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                      {citation.context_before && (
                        <div>
                          <span className="font-medium">앞 문맥: </span>
                          <span className="italic">
                            {citation.context_before}
                          </span>
                        </div>
                      )}
                      {citation.context_after && (
                        <div>
                          <span className="font-medium">뒤 문맥: </span>
                          <span className="italic">
                            {citation.context_after}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
