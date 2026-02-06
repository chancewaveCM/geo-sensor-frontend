import { cn } from "@/lib/utils"

export interface RiskMetricCardProps {
  level: 'critical' | 'warning' | 'safe'
  count: number
  description: string
  className?: string
}

const levelConfig = {
  critical: {
    borderColor: 'border-l-destructive',
    bgColor: 'bg-destructive/5',
    badgeBg: 'bg-destructive/10',
    badgeText: 'text-destructive',
    dotColor: 'bg-destructive',
    ringColor: 'border-destructive/50',
    label: 'CRITICAL'
  },
  warning: {
    borderColor: 'border-l-warning',
    bgColor: 'bg-warning/5',
    badgeBg: 'bg-warning/10',
    badgeText: 'text-warning',
    dotColor: 'bg-warning',
    ringColor: 'border-warning/50',
    label: 'WARNING'
  },
  safe: {
    borderColor: 'border-l-success',
    bgColor: 'bg-card',
    badgeBg: 'bg-success/10',
    badgeText: 'text-success',
    dotColor: 'bg-success',
    ringColor: 'border-success/50',
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
