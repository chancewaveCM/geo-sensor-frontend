'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingCardProps {
  variant?: 'default' | 'chart' | 'table' | 'form' | 'metric'
  className?: string
}

export function LoadingCard({ variant = 'default', className }: LoadingCardProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        {variant === 'default' && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        )}

        {variant === 'chart' && (
          <Skeleton className="h-64 w-full rounded-md" />
        )}

        {variant === 'table' && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            ))}
          </div>
        )}

        {variant === 'form' && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        )}

        {variant === 'metric' && (
          <div className="space-y-3">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
