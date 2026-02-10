'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react'

interface SentenceScore {
  text: string
  score: number
  issues: string[]
  suggestions: string[]
}

interface SentenceHighlighterProps {
  sentences: SentenceScore[]
  className?: string
}

export function SentenceHighlighter({
  sentences,
  className,
}: SentenceHighlighterProps) {
  const [openPopover, setOpenPopover] = useState<number | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
    if (score >= 50) return 'bg-yellow-50 text-yellow-900 hover:bg-yellow-100'
    return 'bg-red-50 text-red-900 hover:bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '양호'
    if (score >= 50) return '보통'
    return '개선필요'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 50) return 'secondary'
    return 'destructive'
  }

  if (!sentences || sentences.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        분석할 문장이 없습니다.
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium text-foreground">색상 범례:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-50 border border-emerald-200" />
          <span className="text-muted-foreground">양호 (80+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-50 border border-yellow-200" />
          <span className="text-muted-foreground">보통 (50-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
          <span className="text-muted-foreground">개선필요 (0-49)</span>
        </div>
      </div>

      {/* Content with highlighted sentences */}
      <div className="space-y-2 leading-relaxed">
        {sentences.map((sentence, index) => (
          <Popover
            key={index}
            open={openPopover === index}
            onOpenChange={(open) => setOpenPopover(open ? index : null)}
          >
            <PopoverTrigger asChild>
              <span
                className={cn(
                  'cursor-pointer transition-colors rounded px-1 py-0.5',
                  getScoreColor(sentence.score)
                )}
              >
                {sentence.text}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                {/* Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">문장 점수</span>
                  <Badge variant={getScoreBadgeVariant(sentence.score)}>
                    {sentence.score}/100 ({getScoreLabel(sentence.score)})
                  </Badge>
                </div>

                {/* Issues */}
                {sentence.issues.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span>발견된 문제</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {sentence.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-destructive">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {sentence.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                      <Lightbulb className="h-4 w-4" />
                      <span>개선 제안</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {sentence.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* No issues */}
                {sentence.issues.length === 0 &&
                  sentence.suggestions.length === 0 && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>문제가 발견되지 않았습니다.</span>
                    </div>
                  )}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  )
}
