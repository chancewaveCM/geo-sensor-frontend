'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  trend,
  icon,
  description,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || description) && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
