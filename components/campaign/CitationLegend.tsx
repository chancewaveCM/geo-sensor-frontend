'use client'

import React from 'react'
import { RunCitation } from '@/types/gallery'
import { Card, CardContent } from '@/components/ui/card'

interface CitationLegendProps {
  citations: RunCitation[]
}

export function CitationLegend({ citations }: CitationLegendProps) {
  const stats = React.useMemo(() => {
    const targetCount = citations.filter((c) => c.is_target_brand).length
    const otherCount = citations.length - targetCount
    const avgConfidence =
      citations.length > 0
        ? citations.reduce((sum, c) => sum + c.confidence_score, 0) /
          citations.length
        : 0

    return {
      total: citations.length,
      targetCount,
      otherCount,
      avgConfidence,
    }
  }, [citations])

  if (citations.length === 0) {
    return null
  }

  return (
    <Card className="border-muted" data-testid="citation-legend">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {/* Legend items */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">타겟 브랜드</span>
              <span className="font-medium">{stats.targetCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-muted-foreground">기타 브랜드</span>
              <span className="font-medium">{stats.otherCount}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">총 인용:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">평균 신뢰도:</span>
              <span className="font-medium">
                {(stats.avgConfidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
