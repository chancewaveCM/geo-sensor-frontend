'use client'

import { Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailAvailabilityIndicatorProps {
  status: 'idle' | 'checking' | 'available' | 'unavailable'
  message?: string
}

export function EmailAvailabilityIndicator({
  status,
  message
}: EmailAvailabilityIndicatorProps) {
  if (status === 'idle') return null

  return (
    <div className={cn(
      'flex items-center gap-2 text-xs mt-1',
      status === 'checking' && 'text-muted-foreground',
      status === 'available' && 'text-success',
      status === 'unavailable' && 'text-destructive'
    )}>
      {status === 'checking' && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === 'available' && <Check className="h-3 w-3" />}
      {status === 'unavailable' && <X className="h-3 w-3" />}
      <span>{message || (status === 'checking' ? '확인 중...' : '')}</span>
    </div>
  )
}
