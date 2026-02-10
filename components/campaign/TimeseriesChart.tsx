'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import type { CampaignRun } from '@/lib/types'
import { getTokenColor } from '@/lib/design-tokens'

interface TimeseriesChartProps {
  runs: CampaignRun[]
}

export function TimeseriesChart({ runs }: TimeseriesChartProps) {
  const chartData = runs
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((run) => ({
      date: new Date(run.created_at).toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      }),
      completed: run.completed_queries || 0,
      failed: run.failed_queries || 0,
      runId: run.id
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">쿼리 실행 추이</CardTitle>
      </CardHeader>
      <CardContent>
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
