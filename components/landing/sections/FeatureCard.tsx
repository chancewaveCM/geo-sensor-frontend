import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  className?: string
  children?: ReactNode
}

export function FeatureCard({ title, description, icon, className, children }: FeatureCardProps) {
  return (
    <article
      className={cn(
        'rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
        {icon}
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </article>
  )
}
