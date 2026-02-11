'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'flat'
  changePercent: number
  className?: string
}

export function TrendIndicator({ direction, changePercent, className }: TrendIndicatorProps) {
  const getStyles = () => {
    switch (direction) {
      case 'up':
        return {
          icon: TrendingUp,
          className: 'bg-green-500/10 text-green-600 border-green-500/20',
        }
      case 'down':
        return {
          icon: TrendingDown,
          className: 'bg-red-500/10 text-red-600 border-red-500/20',
        }
      case 'flat':
      default:
        return {
          icon: Minus,
          className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        }
    }
  }

  const { icon: Icon, className: badgeClassName } = getStyles()
  const displayPercent = isFinite(changePercent) ? Math.abs(changePercent).toFixed(1) : '0.0'

  return (
    <Badge className={cn('text-xs flex items-center gap-1', badgeClassName, className)}>
      <Icon className="h-3 w-3" />
      {direction === 'up' ? '+' : direction === 'down' ? '-' : ''}
      {displayPercent}%
    </Badge>
  )
}
