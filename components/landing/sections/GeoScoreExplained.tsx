'use client'

import { useMemo } from 'react'
import { useScrollAnimation } from '@/components/landing/hooks/useScrollAnimation'
import { DimensionBar } from '@/components/landing/sections/DimensionBar'

const dimensions = [
  { label: '콘텐츠 적합도', value: 84 },
  { label: '출처 신뢰도', value: 79 },
  { label: '질문 대응 범위', value: 72 },
  { label: '브랜드 맥락도', value: 76 },
  { label: '행동 유도성', value: 68 },
]

export function GeoScoreExplained() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true })

  const progress = useMemo(() => {
    return isVisible ? 78 : 0
  }, [isVisible])

  return (
    <section ref={ref} className="bg-muted/30 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">GEO Score</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            점수 하나로 끝내지 않습니다
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            GEO Score는 5개 평가 기준으로 분해되어 어디를 고치면 Citation Share가 오르는지 바로 보여줍니다.
          </p>
          <div className="mt-6 space-y-4">
            {dimensions.map((dimension) => (
              <DimensionBar key={dimension.label} label={dimension.label} value={dimension.value} isVisible={isVisible} />
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="relative h-60 w-60">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <circle cx="80" cy="80" r="66" fill="none" stroke="hsl(var(--gray-200))" strokeWidth="16" />
              <circle
                cx="80"
                cy="80"
                r="66"
                fill="none"
                stroke="url(#geoScoreGradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={414.69}
                strokeDashoffset={414.69 - (414.69 * progress) / 100}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="geoScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-navy))" />
                  <stop offset="100%" stopColor="hsl(var(--brand-orange))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.09em] text-muted-foreground">Overall</p>
              <p className="mt-1 text-5xl font-bold tracking-tight text-foreground">78</p>
              <p className="mt-1 rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-semibold text-brand-navy">A- 등급</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
