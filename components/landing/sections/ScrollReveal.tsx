'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/components/landing/hooks/useScrollAnimation'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.12, triggerOnce: true })

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 will-change-transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
