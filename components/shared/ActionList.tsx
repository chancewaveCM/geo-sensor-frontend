import * as React from 'react'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowRight, CheckCircle2, Info } from 'lucide-react'

type Priority = 'high' | 'medium' | 'low'

export interface ActionItem {
  id: string
  title: string
  description?: string
  priority: Priority
  completed?: boolean
}

export interface ActionListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActionItem[]
  onItemClick?: (item: ActionItem) => void
}

const priorityConfig: Record<Priority, { icon: React.ElementType; colorClass: string; label: string }> = {
  high: { icon: AlertTriangle, colorClass: 'text-destructive', label: '높음' },
  medium: { icon: Info, colorClass: 'text-warning', label: '보통' },
  low: { icon: CheckCircle2, colorClass: 'text-info', label: '낮음' },
}

export function ActionList({ items, onItemClick, className, ...props }: ActionListProps) {
  const sorted = [...items].sort((a, b) => {
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {sorted.map((item) => {
        const config = priorityConfig[item.priority]
        const Icon = config.icon

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick?.(item)}
            className={cn(
              'flex w-full items-start gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent/50',
              item.completed && 'opacity-50'
            )}
          >
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.colorClass)} />
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium', item.completed && 'line-through')}>
                {item.title}
              </p>
              {item.description && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        )
      })}
    </div>
  )
}
