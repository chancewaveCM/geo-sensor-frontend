import * as React from 'react'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending'

const statusConfig: Record<StatusType, { variant: BadgeProps['variant']; label: string }> = {
  success: { variant: 'success', label: '성공' },
  warning: { variant: 'warning', label: '경고' },
  error: { variant: 'destructive', label: '오류' },
  info: { variant: 'info', label: '정보' },
  pending: { variant: 'secondary', label: '대기중' },
}

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: StatusType
  label?: string
  showDot?: boolean
}

export function StatusBadge({ status, label, showDot = true, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status]
  const displayLabel = label ?? config.label

  return (
    <Badge variant={config.variant} className={cn('gap-1.5', className)} {...props}>
      {showDot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {displayLabel}
    </Badge>
  )
}
