import * as React from 'react'
import { cn } from '@/lib/utils'

type LoadingCardType = 'metric' | 'list-item' | 'chart' | 'gallery' | 'page-header'

export interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: LoadingCardType
  count?: number
}

function PulseLine({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} style={style} />
}

function MetricSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <PulseLine className="h-4 w-24" />
      <PulseLine className="h-8 w-32" />
      <PulseLine className="h-3 w-20" />
    </div>
  )
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <PulseLine className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <PulseLine className="h-4 w-3/4" />
        <PulseLine className="h-3 w-1/2" />
      </div>
      <PulseLine className="h-6 w-16" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <PulseLine className="h-5 w-32" />
        <PulseLine className="h-8 w-24" />
      </div>
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <PulseLine
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function GallerySkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <PulseLine className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <PulseLine className="h-4 w-3/4" />
        <PulseLine className="h-3 w-1/2" />
      </div>
    </div>
  )
}

function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <PulseLine className="h-3 w-48" />
      <PulseLine className="h-8 w-64" />
      <PulseLine className="h-4 w-96" />
    </div>
  )
}

const skeletonMap: Record<LoadingCardType, React.FC> = {
  metric: MetricSkeleton,
  'list-item': ListItemSkeleton,
  chart: ChartSkeleton,
  gallery: GallerySkeleton,
  'page-header': PageHeaderSkeleton,
}

export function LoadingCard({ type, count = 1, className, ...props }: LoadingCardProps) {
  const Skeleton = skeletonMap[type]

  if (count === 1) {
    return (
      <div className={className} {...props}>
        <Skeleton />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  )
}
