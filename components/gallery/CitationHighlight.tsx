'use client'

import type { RunCitation } from '@/lib/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CitationHighlightProps {
  text: string
  citations: RunCitation[]
  onCitationClick?: (citation: RunCitation) => void
}

interface HighlightSegment {
  text: string
  citation?: RunCitation
  start: number
  end: number
}

export function CitationHighlight({ text, citations, onCitationClick }: CitationHighlightProps) {
  const segments: HighlightSegment[] = []

  const citationsWithSnippets = citations
    .filter((c) => c.context_snippet && c.context_snippet.trim().length > 0)
    .sort((a, b) => a.position - b.position)

  const matches: Array<{ start: number; end: number; citation: RunCitation }> = []

  for (const citation of citationsWithSnippets) {
    const snippet = citation.context_snippet!.trim()
    const index = text.toLowerCase().indexOf(snippet.toLowerCase())
    if (index !== -1) {
      matches.push({
        start: index,
        end: index + snippet.length,
        citation,
      })
    }
  }

  matches.sort((a, b) => a.start - b.start)

  let currentPos = 0
  for (const match of matches) {
    if (match.start > currentPos) {
      segments.push({
        text: text.slice(currentPos, match.start),
        start: currentPos,
        end: match.start,
      })
    }

    segments.push({
      text: text.slice(match.start, match.end),
      citation: match.citation,
      start: match.start,
      end: match.end,
    })

    currentPos = match.end
  }

  if (currentPos < text.length) {
    segments.push({
      text: text.slice(currentPos),
      start: currentPos,
      end: text.length,
    })
  }

  return (
    <TooltipProvider>
      <div className="whitespace-pre-wrap leading-relaxed text-foreground">
        {segments.map((segment, idx) => {
          if (segment.citation) {
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <span
                    className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                    onClick={() => onCitationClick?.(segment.citation!)}
                  >
                    {segment.text}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-orange-500">
                      {segment.citation.brand_name}
                    </div>
                    {segment.citation.domain && (
                      <div className="text-xs text-muted-foreground">
                        {segment.citation.domain}
                      </div>
                    )}
                    <div className="text-xs">
                      Position: #{segment.citation.position} | Confidence:{' '}
                      {(segment.citation.confidence_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          }
          return <span key={idx}>{segment.text}</span>
        })}
      </div>
    </TooltipProvider>
  )
}
