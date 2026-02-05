'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PerformanceMetricCardProps {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  sparklineData?: number[]
  unit?: string
}

export function PerformanceMetricCard({
  title,
  value,
  change,
  trend,
  sparklineData = [],
  unit = '%'
}: PerformanceMetricCardProps) {
  const isPositive = trend === 'up'
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="relative overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>

          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <TrendIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <TrendIcon className={`mr-1 h-4 w-4 ${isPositive ? 'text-success' : 'text-error'}`} />
            <span className={`font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
              {change > 0 ? '+' : ''}{change}{unit}
            </span>
            <span className="ml-1 text-muted-foreground">vs last period</span>
          </div>

          {sparklineData.length > 0 && (
            <div className="flex items-end gap-0.5 h-8">
              {sparklineData.map((height, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-primary/40 rounded-t-sm transition-all duration-200"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
