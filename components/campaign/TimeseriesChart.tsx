'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import type { CampaignRun } from '@/types'
import { getTokenColor } from '@/lib/design-tokens'
import { Calendar } from 'lucide-react'
import { AnnotationMarker } from './AnnotationMarker'

interface TimeseriesChartProps {
  runs: CampaignRun[]
  annotations?: Array<{
    id: number
    date: string
    title: string
    description?: string
    annotation_type: 'manual' | 'query_change' | 'model_change'
  }>
  onGranularityChange?: (granularity: 'daily' | 'weekly' | 'monthly') => void
  onDateRangeChange?: (dateFrom: string, dateTo: string) => void
}

type Granularity = 'daily' | 'weekly' | 'monthly'

export function TimeseriesChart({
  runs,
  annotations,
  onGranularityChange,
  onDateRangeChange
}: TimeseriesChartProps) {
  const [granularity, setGranularity] = useState<Granularity>('daily')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const chartData = runs
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((run) => ({
      date: new Date(run.created_at).toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      }),
      completed: run.completed_queries || 0,
      failed: run.failed_queries || 0,
      runId: run.id,
      timestamp: new Date(run.created_at).getTime()
    }))

  const handleGranularityChange = (value: string) => {
    const newGranularity = value as Granularity
    setGranularity(newGranularity)
    onGranularityChange?.(newGranularity)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">쿼리 실행 추이</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={granularity} onValueChange={handleGranularityChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">일간</SelectItem>
                <SelectItem value="weekly">주간</SelectItem>
                <SelectItem value="monthly">월간</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              기간 선택
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {annotations && annotations.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-muted-foreground">주요 이벤트:</span>
            {annotations.map((annotation) => (
              <AnnotationMarker
                key={annotation.id}
                date={annotation.date}
                title={annotation.title}
                type={annotation.annotation_type}
                description={annotation.description}
              />
            ))}
          </div>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-chart-grid" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-chart-axis"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-chart-axis"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
            {annotations?.map((annotation) => {
              const annotationDate = new Date(annotation.date).getTime()
              const dataPoint = chartData.find((d) => d.timestamp === annotationDate)
              if (dataPoint) {
                return (
                  <ReferenceLine
                    key={annotation.id}
                    x={dataPoint.date}
                    stroke={getTokenColor('--chart-6')}
                    strokeDasharray="3 3"
                    label={{ value: '📌', position: 'top' }}
                  />
                )
              }
              return null
            })}
            <Line
              type="monotone"
              dataKey="completed"
              stroke={getTokenColor('--chart-1')}
              strokeWidth={2}
              name="완료"
              dot={{ fill: getTokenColor('--chart-1'), r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="failed"
              stroke={getTokenColor('--chart-5')}
              strokeWidth={2}
              name="실패"
              dot={{ fill: getTokenColor('--chart-5'), r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
