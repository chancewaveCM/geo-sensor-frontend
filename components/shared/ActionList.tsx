'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface ActionItem {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  category?: string
  completed?: boolean
}

interface ActionListProps {
  items: ActionItem[]
  onActionClick?: (item: ActionItem) => void
  className?: string
}

const priorityConfig = {
  high: { variant: 'destructive' as const, label: '높음' },
  medium: { variant: 'default' as const, label: '보통' },
  low: { variant: 'success' as const, label: '낮음' },
}

const priorityOrder = { high: 0, medium: 1, low: 2 }

export function ActionList({ items, onActionClick, className }: ActionListProps) {
  const sortedItems = [...items].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  )

  if (sortedItems.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-muted-foreground">
          조치 사항이 없습니다
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {sortedItems.map((item) => (
        <Card
          key={item.id}
          className={cn(
            'transition-colors hover:bg-accent/50',
            onActionClick && 'cursor-pointer',
            item.completed && 'opacity-60'
          )}
          role={onActionClick ? 'button' : undefined}
          tabIndex={onActionClick ? 0 : undefined}
          onClick={() => onActionClick?.(item)}
          onKeyDown={onActionClick ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onActionClick(item)
            }
          } : undefined}
        >
          <CardContent className="flex items-start gap-3 p-4">
            <div
              className={cn(
                'mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2',
                item.completed
                  ? 'border-green-500 bg-green-500'
                  : 'border-muted-foreground/30'
              )}
            >
              {item.completed && <Check className="h-3 w-3 text-white" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={priorityConfig[item.priority].variant} className="text-xs">
                  {priorityConfig[item.priority].label}
                </Badge>
                {item.category && (
                  <span className="text-xs text-muted-foreground">
                    {item.category}
                  </span>
                )}
              </div>
              <h4
                className={cn(
                  'font-medium',
                  item.completed && 'line-through'
                )}
              >
                {item.title}
              </h4>
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
