'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { getTokenColor, CHART_PALETTE } from '@/lib/design-tokens'

interface TimeseriesDataPoint {
  run_id: number
  timestamp: string
  citation_share_overall: number
  citation_share_by_provider: Record<string, number> | null
  total_citations: number
  brand_citations: number
}

interface CitationTrendChartProps {
  data: TimeseriesDataPoint[]
  brandName?: string
  isLoading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}%</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function CitationTrendChart({ data, brandName = 'Target', isLoading }: CitationTrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            인용률 추이
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse rounded-md bg-muted h-[350px]" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            인용률 추이
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
            <TrendingUp className="h-12 w-12 mb-4 opacity-50" />
            <p>아직 시계열 데이터가 없습니다</p>
            <p className="text-sm">캠페인을 실행하면 추이가 표시됩니다</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get unique providers from data
  const providers = new Set<string>()
  data.forEach(point => {
    if (point.citation_share_by_provider) {
      Object.keys(point.citation_share_by_provider).forEach(p => providers.add(p))
    }
  })
  const providerList = Array.from(providers)

  // Transform data for recharts
  const chartData = data.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    overall: Math.round(point.citation_share_overall * 100 * 10) / 10,
    ...Object.fromEntries(
      Object.entries(point.citation_share_by_provider || {}).map(([provider, share]) => [
        provider, Math.round(share * 100 * 10) / 10
      ])
    ),
  }))

  return (
    <Card data-testid="citation-trend-chart" className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          인용률 추이
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              label={{ value: 'Citation Share (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="overall"
              name={`${brandName} (Overall)`}
              stroke={getTokenColor('--chart-4')}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
            {providerList.map((provider, index) => (
              <Line
                key={provider}
                type="monotone"
                dataKey={provider}
                name={provider.charAt(0).toUpperCase() + provider.slice(1)}
                stroke={getTokenColor(CHART_PALETTE[index + 1] || '--chart-5')}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                animationDuration={800}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
