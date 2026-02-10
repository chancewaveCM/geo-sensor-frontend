'use client'

import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { cn } from '@/lib/utils'

interface DiagnosisCardProps {
  score: number
  grade: string
  className?: string
}

const gradeConfig = {
  A: {
    color: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500 hover:bg-emerald-600',
    description: '우수 - AI 응답에 잘 인용될 콘텐츠입니다',
    circleColor: '#10b981',
  },
  B: {
    color: 'bg-green-500',
    badgeClass: 'bg-green-500 hover:bg-green-600',
    description: '양호 - 약간의 개선으로 더 좋아질 수 있습니다',
    circleColor: '#22c55e',
  },
  C: {
    color: 'bg-yellow-500',
    badgeClass: 'bg-yellow-500 hover:bg-yellow-600',
    description: '보통 - 개선이 필요한 부분이 있습니다',
    circleColor: '#eab308',
  },
  D: {
    color: 'bg-orange-500',
    badgeClass: 'bg-orange-500 hover:bg-orange-600',
    description: '미흡 - 상당한 개선이 필요합니다',
    circleColor: '#f97316',
  },
  F: {
    color: 'bg-red-500',
    badgeClass: 'bg-red-500 hover:bg-red-600',
    description: '부족 - 전면적인 개선이 필요합니다',
    circleColor: '#ef4444',
  },
}

export function DiagnosisCard({ score, grade, className }: DiagnosisCardProps) {
  const config = gradeConfig[grade as keyof typeof gradeConfig] || gradeConfig.F
  const normalizedScore = Math.min(100, Math.max(0, score))

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          콘텐츠 진단 결과
        </CardTitle>
        <CardDescription>AI 응답 인용 가능성 종합 평가</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Circular Gauge */}
        <ScoreGauge score={normalizedScore} size="lg" />

        {/* Grade Badge */}
        <div className="flex flex-col items-center gap-2">
          <Badge className={cn('text-base px-4 py-1', config.badgeClass)}>
            등급 {grade}
          </Badge>
          <p className="text-center text-sm text-muted-foreground max-w-md">
            {config.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
