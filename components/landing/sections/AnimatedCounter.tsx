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

    let rafId = 0
    const start = performance.now()

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const nextValue = Math.round(value * progress)
      setDisplay(nextValue)

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate)
      }
    }

    rafId = window.requestAnimationFrame(animate)

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [duration, isVisible, value])

  return (
    <div ref={ref} className={className}>
      {display}
      {suffix}
    </div>
  )
}
