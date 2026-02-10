import { cn } from '@/lib/utils'

interface DimensionBarProps {
  label: string
  value: number
  isVisible?: boolean
}

export function DimensionBar({ label, value, isVisible }: DimensionBarProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold text-brand-navy">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className={cn(
            'h-2 rounded-full bg-gradient-to-r from-brand-navy to-brand-orange transition-[width] duration-700',
            !isVisible && 'w-0'
          )}
          style={{ width: isVisible ? `${value}%` : 0 }}
        />
      </div>
    </div>
  )
}
