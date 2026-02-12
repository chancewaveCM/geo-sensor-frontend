import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StepCardProps {
  step: string
  title: string
  description: string
  icon: ReactNode
  className?: string
}

export function StepCard({ step, title, description, icon, className }: StepCardProps) {
  return (
    <article className={cn('rounded-2xl border border-border bg-card p-5 shadow-sm', className)}>
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-brand-navy px-2.5 py-1 text-xs font-semibold text-white">{step}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  )
}
