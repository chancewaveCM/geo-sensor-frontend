'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<
  string,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'; label: string }
> = {
  pending: { variant: 'secondary', label: '대기 중' },
  generating_categories: { variant: 'default', label: '카테고리 생성 중' },
  expanding_queries: { variant: 'default', label: '쿼리 확장 중' },
  executing_queries: { variant: 'default', label: '쿼리 실행 중' },
  completed: { variant: 'success', label: '완료' },
  failed: { variant: 'destructive', label: '실패' },
  cancelled: { variant: 'outline', label: '취소됨' },
  running: { variant: 'default', label: '실행 중' },
  analyzing: { variant: 'default', label: '분석 중' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || {
    variant: 'secondary' as const,
    label: status,
  }

  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      {config.label}
    </Badge>
  )
}
