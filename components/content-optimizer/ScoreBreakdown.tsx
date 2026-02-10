'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ScoreCategory {
  name: string
  score: number
  maxScore: number
  description: string
}

interface ScoreBreakdownProps {
  categories: ScoreCategory[]
  className?: string
}

export function ScoreBreakdown({ categories, className }: ScoreBreakdownProps) {
  const getColorClass = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return '[&>div]:bg-green-500'
    if (percentage >= 50) return '[&>div]:bg-yellow-500'
    return '[&>div]:bg-red-500'
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>항목별 점수</CardTitle>
        <CardDescription>각 평가 항목의 세부 점수를 확인하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category, index) => {
          const percentage = category.maxScore > 0
            ? (category.score / category.maxScore) * 100
            : 0

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {category.score} / {category.maxScore}
                  </span>
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      getColorClass(percentage)
                    )}
                  />
                </div>
              </div>
              <Progress
                value={percentage}
                className={cn('h-2', getProgressColor(percentage))}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
