import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FloatingCardProps {
  title: string
  value: string
  subtitle?: string
  delta?: string
  className?: string
  icon?: ReactNode
  children?: ReactNode
}

export function FloatingCard({
  title,
  value,
  subtitle,
  delta,
  className,
  icon,
  children,
}: FloatingCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-1',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {(subtitle || delta) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {delta && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">{delta}</span>}
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  )
}
