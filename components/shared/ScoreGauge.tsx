'use client'

import { cn } from '@/lib/utils'

interface ScoreGaugeProps {
  score: number // 0-100
  grade?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: { width: 80, height: 80, strokeWidth: 8, fontSize: 'text-xl' },
  md: { width: 120, height: 120, strokeWidth: 10, fontSize: 'text-3xl' },
  lg: { width: 160, height: 160, strokeWidth: 12, fontSize: 'text-4xl' },
}

const getGradeColor = (grade: string) => {
  switch (grade.toUpperCase()) {
    case 'A':
      return 'text-emerald-600'
    case 'B':
      return 'text-green-600'
    case 'C':
      return 'text-yellow-600'
    case 'D':
      return 'text-orange-600'
    case 'F':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#10b981' // emerald
  if (score >= 80) return '#22c55e' // green
  if (score >= 70) return '#eab308' // yellow
  if (score >= 60) return '#f97316' // orange
  return '#ef4444' // red
}

export function ScoreGauge({
  score,
  grade,
  size = 'md',
  className,
}: ScoreGaugeProps) {
  const config = sizeConfig[size]
  const { width, height, strokeWidth } = config

  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = getScoreColor(score)
  const gradeColor = grade ? getGradeColor(grade) : getScoreColor(score)

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`점수: ${score}/100${grade ? `, 등급: ${grade}` : ''}`}
    >
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('font-bold', config.fontSize, gradeColor)}>
          {grade || score}
        </span>
      </div>
    </div>
  )
}
