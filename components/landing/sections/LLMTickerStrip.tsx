'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Bot } from 'lucide-react'
import { LLM_PROVIDERS } from '@/components/landing/data/providers'
import { cn } from '@/lib/utils'

const providers = LLM_PROVIDERS

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
  if (trend === 'down') return <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
  return <ArrowRight className="h-3.5 w-3.5 text-gray-400 dark:text-muted-foreground" />
}

function ProviderPill({ provider }: { provider: (typeof LLM_PROVIDERS)[number] }) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-700 bg-gray-800/90 px-3 py-1.5 text-xs text-gray-100 transition-colors',
        'hover:border-gray-500',
        'dark:border-border-strong dark:bg-background-subtle dark:text-foreground dark:hover:border-muted-foreground'
      )}
    >
      <Bot className={cn('h-3.5 w-3.5', provider.colorClass)} />
      <span className="font-semibold">{provider.name}</span>
      <span className="text-gray-300 dark:text-muted-foreground">{provider.citationShare.toFixed(1)}%</span>
      <TrendIcon trend={provider.trend} />
    </div>
  )
}

export function LLMTickerStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isAnimationRunning, setIsAnimationRunning] = useState(true)

  useEffect(() => {
    let isInViewport = true

    const updateAnimationState = () => {
      setIsAnimationRunning(!document.hidden && isInViewport)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting
        updateAnimationState()
      },
      { threshold: 0.05 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    updateAnimationState()
    document.addEventListener('visibilitychange', updateAnimationState)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateAnimationState)
    }
  }, [])

  return (
    <section ref={sectionRef} className="overflow-hidden border-y border-gray-800 bg-gray-900 py-4 dark:border-border-strong dark:bg-muted" aria-label="LLM Citation Share 티커">
      <div
        className={cn(
          'flex w-max items-center [animation-duration:22s] hover:[animation-play-state:paused] md:[animation-duration:32s]',
          isAnimationRunning && 'animate-ticker-scroll motion-reduce:animate-none'
        )}
      >
        <div className="flex min-w-full shrink-0 items-center justify-around gap-3 pr-3">
          {providers.map((provider) => (
            <ProviderPill key={provider.id} provider={provider} />
          ))}
        </div>
        <div aria-hidden className="flex min-w-full shrink-0 items-center justify-around gap-3 pr-3">
          {providers.map((provider) => (
            <ProviderPill key={`${provider.id}-dup`} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  )
}
