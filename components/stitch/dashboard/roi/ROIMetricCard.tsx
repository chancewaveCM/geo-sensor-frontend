'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export interface ROIMetricCardProps {
  roi: number
  investment: number
  returns: number
  trend: {
    value: number
    isPositive: boolean
  }
}

export function ROIMetricCard({ roi, investment, returns, trend }: ROIMetricCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="border-l-4 border-l-primary overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* ROI Percentage */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Return on Investment
            </p>
            <p className="text-5xl font-bold tracking-tight text-foreground">
              {roi.toFixed(1)}%
            </p>
          </div>

          {/* Investment vs Returns */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Investment</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(investment)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Returns</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(returns)}</p>
            </div>
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2 pt-2">
            {trend.isPositive ? (
              <>
                <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
                <span className="text-sm font-semibold text-success">
                  +{Math.abs(trend.value).toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-error" aria-hidden="true" />
                <span className="text-sm font-semibold text-error">
                  {trend.value.toFixed(1)}%
                </span>
              </>
            )}
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
