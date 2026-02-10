'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

function getGrade(score: number): { grade: string; colorClass: string } {
  if (score >= 90) return { grade: 'A', colorClass: 'text-grade-a' }
  if (score >= 80) return { grade: 'B', colorClass: 'text-grade-b' }
  if (score >= 70) return { grade: 'C', colorClass: 'text-grade-c' }
  if (score >= 60) return { grade: 'D', colorClass: 'text-grade-d' }
  return { grade: 'F', colorClass: 'text-grade-f' }
}

function getStrokeColor(score: number): string {
  if (score >= 90) return 'hsl(var(--grade-a))'
  if (score >= 80) return 'hsl(var(--grade-b))'
  if (score >= 70) return 'hsl(var(--grade-c))'
  if (score >= 60) return 'hsl(var(--grade-d))'
  return 'hsl(var(--grade-f))'
}

export interface ScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showGrade?: boolean
  showScore?: boolean
  label?: string
}

const sizeConfig = {
  sm: { svgSize: 80, strokeWidth: 6, fontSize: 'text-lg', gradeSize: 'text-xs' },
  md: { svgSize: 120, strokeWidth: 8, fontSize: 'text-2xl', gradeSize: 'text-sm' },
  lg: { svgSize: 160, strokeWidth: 10, fontSize: 'text-3xl', gradeSize: 'text-base' },
}

export function ScoreGauge({
  score,
  size = 'md',
  showGrade = true,
  showScore = true,
  label,
  className,
  ...props
}: ScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const { grade, colorClass } = getGrade(clampedScore)
  const strokeColor = getStrokeColor(clampedScore)
  const config = sizeConfig[size]

  const radius = (config.svgSize - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center gap-2', className)} {...props}>
      <div className="relative" style={{ width: config.svgSize, height: config.svgSize }}>
        <svg
          width={config.svgSize}
          height={config.svgSize}
          className="-rotate-90"
        >
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.strokeWidth}
          />
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showScore && (
            <span className={cn('font-bold', config.fontSize)}>{clampedScore}</span>
          )}
          {showGrade && (
            <span className={cn('font-semibold', config.gradeSize, colorClass)}>
              {grade}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  )
}
