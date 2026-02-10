'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

interface BeforeAfterCompareProps {
  originalContent: string
  improvedContent: string
  originalScore: number
  improvedScore: number
  className?: string
}

export function BeforeAfterCompare({
  originalContent,
  improvedContent,
  originalScore,
  improvedScore,
  className,
}: BeforeAfterCompareProps) {
  const scoreDelta = improvedScore - originalScore

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 50) return 'secondary'
    return 'destructive'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            개선 전후 비교
          </CardTitle>
          {scoreDelta > 0 && (
            <div className="flex items-center gap-2 text-emerald-600">
              <ArrowRight className="h-5 w-5" />
              <span className="font-semibold text-lg">
                +{scoreDelta}점 개선
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Content */}
          <div className="space-y-3 md:border-r md:pr-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">원본</h3>
              <Badge variant={getScoreBadgeVariant(originalScore)}>
                {originalScore}/100
              </Badge>
            </div>
            <div className="relative">
              <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-muted/50 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {originalContent || '내용이 없습니다.'}
                </p>
              </div>
            </div>
          </div>

          {/* Improved Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">개선안</h3>
              <Badge variant={getScoreBadgeVariant(improvedScore)}>
                {improvedScore}/100
              </Badge>
            </div>
            <div className="relative">
              <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-emerald-50/50 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {improvedContent || '개선된 내용이 없습니다.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
