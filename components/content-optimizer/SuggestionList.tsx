'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Lightbulb, ArrowUp } from 'lucide-react'

interface Suggestion {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  impact: string
}

interface SuggestionListProps {
  suggestions: Suggestion[]
  onToggle?: (id: string) => void
  className?: string
}

export function SuggestionList({
  suggestions,
  onToggle,
  className,
}: SuggestionListProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  const handleToggle = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    onToggle?.(id)
  }

  const getPriorityVariant = (
    priority: Suggestion['priority']
  ): 'destructive' | 'secondary' | 'outline' => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
    }
  }

  const getPriorityLabel = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high':
        return '높음'
      case 'medium':
        return '보통'
      case 'low':
        return '낮음'
    }
  }

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  if (suggestions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            개선 제안
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            개선 제안이 없습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            개선 제안
          </CardTitle>
          <Badge variant="secondary">총 {suggestions.length}개 제안</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedSuggestions.map((suggestion) => {
          const isCompleted = completedIds.has(suggestion.id)
          return (
            <div
              key={suggestion.id}
              className={cn(
                'border rounded-lg p-4 space-y-3 transition-opacity',
                isCompleted && 'opacity-50'
              )}
            >
              {/* Header with priority and checkbox */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getPriorityVariant(suggestion.priority)}>
                      {getPriorityLabel(suggestion.priority)}
                    </Badge>
                    <Badge variant="outline">{suggestion.category}</Badge>
                  </div>
                  <h4
                    className={cn(
                      'font-semibold text-foreground',
                      isCompleted && 'line-through'
                    )}
                  >
                    {suggestion.title}
                  </h4>
                </div>
                {onToggle && (
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleToggle(suggestion.id)}
                    className="mt-1"
                  />
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {suggestion.description}
              </p>

              {/* Impact */}
              <div className="flex items-center gap-2 text-sm">
                <ArrowUp className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-600">
                  {suggestion.impact}
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
