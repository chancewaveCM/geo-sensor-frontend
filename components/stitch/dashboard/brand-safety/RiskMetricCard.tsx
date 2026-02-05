import { cn } from "@/lib/utils"

export interface RiskMetricCardProps {
  level: 'critical' | 'warning' | 'safe'
  count: number
  description: string
  className?: string
}

const levelConfig = {
  critical: {
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50/50',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-600',
    dotColor: 'bg-red-500',
    ringColor: 'border-red-500/50',
    label: 'CRITICAL'
  },
  warning: {
    borderColor: 'border-l-amber-500',
    bgColor: 'bg-amber-50/50',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-600',
    dotColor: 'bg-amber-500',
    ringColor: 'border-amber-500/50',
    label: 'WARNING'
  },
  safe: {
    borderColor: 'border-l-emerald-500',
    bgColor: 'bg-white',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
    ringColor: 'border-emerald-500/50',
    label: 'SAFE'
  }
}

export function RiskMetricCard({ level, count, description, className }: RiskMetricCardProps) {
  const config = levelConfig[level]

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 border",
        config.bgColor,
        config.ringColor,
        className
      )}
      role="status"
      aria-label={`${count} ${description}`}
    >
      <div className={cn("size-2 rounded-full", config.dotColor)} aria-hidden="true" />
      <span className="text-xs font-bold">
        {count} {config.label}
      </span>
    </div>
  )
}

export function RiskMetricCardLarge({ level, count, description, className }: RiskMetricCardProps) {
  const config = levelConfig[level]

  return (
    <article
      className={cn(
        "rounded-lg border border-l-4 p-6 shadow-sm transition-all hover:shadow-md",
        config.borderColor,
        config.bgColor,
        className
      )}
      role="status"
      aria-label={`${config.label}: ${count} incidents - ${description}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <span
            className={cn(
              "inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
              config.badgeBg,
              config.badgeText
            )}
          >
            {config.label}
          </span>
          <p className="text-3xl font-bold text-foreground">{count}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div
          className={cn(
            "size-3 rounded-full animate-pulse",
            level === 'critical' ? config.dotColor : 'hidden'
          )}
          aria-hidden="true"
        />
      </div>
    </article>
  )
}
