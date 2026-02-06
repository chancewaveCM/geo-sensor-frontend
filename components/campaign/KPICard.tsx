'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
}

export function KPICard({ title, value, subtitle, icon, trend }: KPICardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 pt-1">
                {trend.isPositive ? (
                  <ArrowUp className="h-4 w-4 text-trend-up" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-trend-down" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-trend-up' : 'text-trend-down'
                  )}
                >
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last run</span>
              </div>
            )}
          </div>
          <div className="rounded-full bg-brand-orange/10 p-3 text-brand-orange flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-brand-orange to-brand-orange/50" />
    </Card>
  )
}
