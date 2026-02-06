'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface ComparisonResponse {
  response_text: string
  llm_provider: string
  model_name: string
  citations: Array<{ brand_name: string; domain?: string; position: number }>
}

interface ComparisonViewProps {
  leftResponse: ComparisonResponse
  rightResponse: ComparisonResponse
  comparisonType: 'llm' | 'date' | 'version'
}

export function ComparisonView({ leftResponse, rightResponse, comparisonType }: ComparisonViewProps) {
  // Extract brand sets for diff
  const leftBrands = new Set(leftResponse.citations.map(c => c.brand_name))
  const rightBrands = new Set(rightResponse.citations.map(c => c.brand_name))
  const sharedBrands = Array.from(leftBrands).filter(b => rightBrands.has(b))
  const uniqueLeft = Array.from(leftBrands).filter(b => !rightBrands.has(b))
  const uniqueRight = Array.from(rightBrands).filter(b => !leftBrands.has(b))

  return (
    <div className="space-y-4">
      {/* Side by side panels */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left panel */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline">{leftResponse.llm_provider}</Badge>
            <span className="text-sm text-muted-foreground">{leftResponse.model_name}</span>
          </div>
          <div className="max-h-96 overflow-y-auto rounded border p-3 text-sm leading-relaxed">
            {leftResponse.response_text}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {leftResponse.citations.length} citations · {leftResponse.response_text.split(/\s+/).length} words
          </p>
        </Card>

        {/* Right panel */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline">{rightResponse.llm_provider}</Badge>
            <span className="text-sm text-muted-foreground">{rightResponse.model_name}</span>
          </div>
          <div className="max-h-96 overflow-y-auto rounded border p-3 text-sm leading-relaxed">
            {rightResponse.response_text}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {rightResponse.citations.length} citations · {rightResponse.response_text.split(/\s+/).length} words
          </p>
        </Card>
      </div>

      {/* Diff summary */}
      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold">Brand Citation Diff</h3>
        <div className="space-y-2">
          {sharedBrands.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Shared:</span>
              {sharedBrands.map(b => <Badge key={b} className="bg-green-100 text-green-800">{b}</Badge>)}
            </div>
          )}
          {uniqueLeft.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Left only:</span>
              {uniqueLeft.map(b => <Badge key={b} className="bg-blue-100 text-blue-800">{b}</Badge>)}
            </div>
          )}
          {uniqueRight.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Right only:</span>
              {uniqueRight.map(b => <Badge key={b} className="bg-orange-100 text-orange-800">{b}</Badge>)}
            </div>
          )}
          {sharedBrands.length === 0 && uniqueLeft.length === 0 && uniqueRight.length === 0 && (
            <p className="text-sm text-muted-foreground">No citations to compare</p>
          )}
        </div>
      </Card>
    </div>
  )
}
