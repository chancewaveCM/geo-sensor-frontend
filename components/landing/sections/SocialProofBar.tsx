'use client'

import { cn } from '@/lib/utils'
import { AnimatedCounter } from '@/components/landing/sections/AnimatedCounter'
import { useScrollAnimation } from '@/components/landing/hooks/useScrollAnimation'

const STATS = [
  { kind: 'counter', value: 187, label: '도입 팀' },
  { kind: 'counter', value: 6, label: '지원 AI 모델' },
  { kind: 'text', value: '100K+', label: '분석한 AI 응답' },
  { kind: 'text', value: '2x+', label: '평균 Citation Share 개선' },
] as const

export function SocialProofBar() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} className="px-4 py-12 md:px-6">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-6 rounded-3xl border border-border bg-card px-6 py-7 shadow-sm md:grid-cols-4">
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'text-center',
              index < STATS.length - 1 && 'md:border-r md:border-border'
            )}
          >
            {stat.kind === 'counter' ? (
              <AnimatedCounter
                value={stat.value}
                className="text-3xl font-bold tracking-tight text-brand-navy md:text-4xl"
              />
            ) : (
              <p
                className={cn(
                  'text-3xl font-bold tracking-tight text-brand-navy transition-opacity duration-700 md:text-4xl',
                  isVisible ? 'opacity-100' : 'opacity-0'
                )}
              >
                {stat.value}
              </p>
            )}
            <p className="mt-2 text-xs font-medium text-muted-foreground md:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
