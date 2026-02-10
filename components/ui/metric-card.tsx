import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const metricCardVariants = cva('relative overflow-hidden', {
  variants: {
    variant: {
      'accent-bar': '',
      'gradient-bar': '',
      minimal: '',
    },
  },
  defaultVariants: {
    variant: 'accent-bar',
  },
})

export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  accentColor?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  variant,
  accentColor = 'hsl(var(--brand-orange))',
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn(metricCardVariants({ variant }), className)} {...props}>
      {variant === 'accent-bar' && (
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg" style={{ backgroundColor: accentColor }} />
      )}
      {variant === 'gradient-bar' && (
        <div
          className="absolute left-0 top-0 h-1 w-full"
          style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
        />
      )}
      <CardContent className={cn('p-6', variant === 'accent-bar' && 'pl-5')}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {trend && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-success' : 'text-destructive'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
