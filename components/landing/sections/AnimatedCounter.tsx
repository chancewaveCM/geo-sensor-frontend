'use client'

import { useEffect, useState } from 'react'
import { useScrollAnimation } from '@/components/landing/hooks/useScrollAnimation'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ value, duration = 1500, suffix = '', className }: AnimatedCounterProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const intervalMs = 20
    const totalSteps = Math.max(1, Math.floor(duration / intervalMs))
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      const nextValue = Math.round((value * step) / totalSteps)
      setDisplay(Math.min(value, nextValue))
      if (step >= totalSteps) {
        window.clearInterval(timer)
      }
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [duration, isVisible, value])

  return (
    <div ref={ref} className={className}>
      {display}
      {suffix}
    </div>
  )
}
