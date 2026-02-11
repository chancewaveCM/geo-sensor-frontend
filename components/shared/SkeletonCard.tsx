'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
}

export function SkeletonCard({ rows = 3, className, ...props }: SkeletonCardProps) {
  return (
    <Card className={cn('p-6 space-y-4', className)} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </Card>
  )
}
