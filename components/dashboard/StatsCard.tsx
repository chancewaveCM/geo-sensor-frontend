'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  trend?: { value: number; isPositive: boolean }
  icon?: React.ReactNode
}

export function StatsCard({ title, value, trend, icon }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                {trend.value === 0 ? (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                ) : trend.isPositive ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend.value === 0
                      ? 'text-muted-foreground'
                      : trend.isPositive
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 h-full w-1 bg-brand-orange" />
    </Card>
  )
}
