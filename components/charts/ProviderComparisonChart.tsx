'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { getTokenColor } from '@/lib/design-tokens'
import { Activity } from 'lucide-react'

interface ProviderMetrics {
  provider: string // "openai" | "gemini"
  total_responses: number
  avg_word_count: number
  avg_citation_count: number
  avg_latency_ms: number
  citation_share: number // 0.0 - 1.0
}

interface ProviderComparisonChartProps {
  data: ProviderMetrics[]
  isLoading?: boolean
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: '--chart-2', // navy/blue
  gemini: '--chart-1', // orange
}

function capitalizeProvider(provider: string): string {
  return provider.charAt(0).toUpperCase() + provider.slice(1)
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg">
      <p className="font-medium text-sm mb-2">{payload[0].payload.metric}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium">{capitalizeProvider(entry.dataKey)}:</span>
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  )
}

export function ProviderComparisonChart({
  data,
  isLoading = false,
}: ProviderComparisonChartProps) {
  if (isLoading) {
    return (
      <Card data-testid="provider-comparison-chart">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Provider 비교
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card data-testid="provider-comparison-chart">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Provider 비교
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            variant="minimal"
            icon={<Activity className="h-6 w-6" />}
            title="Provider 비교 데이터가 없습니다"
            description="캠페인 실행 후 비교 결과가 표시됩니다"
          />
        </CardContent>
      </Card>
    )
  }

  // Transform data for grouped bar chart
  const chartData = [
    {
      metric: 'Avg Word Count',
      ...Object.fromEntries(
        data.map((p) => [p.provider, Math.round(p.avg_word_count)])
      ),
    },
    {
      metric: 'Avg Citations',
      ...Object.fromEntries(
        data.map((p) => [
          p.provider,
          Math.round(p.avg_citation_count * 10) / 10,
        ])
      ),
    },
    {
      metric: 'Avg Latency (ms)',
      ...Object.fromEntries(
        data.map((p) => [p.provider, Math.round(p.avg_latency_ms)])
      ),
    },
    {
      metric: 'Citation Share (%)',
      ...Object.fromEntries(
        data.map((p) => [
          p.provider,
          Math.round(p.citation_share * 100 * 10) / 10,
        ])
      ),
    },
  ]

  // Find winners for each metric (green highlight)
  const winners = {
    citation_share: data.reduce((max, p) =>
      p.citation_share > max.citation_share ? p : max
    ).provider,
    latency: data.reduce((min, p) =>
      p.avg_latency_ms < min.avg_latency_ms ? p : min
    ).provider,
    word_count: data.reduce((max, p) =>
      p.avg_word_count > max.avg_word_count ? p : max
    ).provider,
    citations: data.reduce((max, p) =>
      p.avg_citation_count > max.avg_citation_count ? p : max
    ).provider,
  }

  return (
    <Card data-testid="provider-comparison-chart">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Provider 비교
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section A: Bar Chart Comparison */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={getTokenColor('--chart-grid')}
              />
              <XAxis
                dataKey="metric"
                stroke={getTokenColor('--chart-axis-text')}
                fontSize={12}
              />
              <YAxis stroke={getTokenColor('--chart-axis-text')} fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => capitalizeProvider(value)}
                wrapperStyle={{ fontSize: '14px' }}
              />
              {data.map((provider) => (
                <Bar
                  key={provider.provider}
                  dataKey={provider.provider}
                  fill={getTokenColor(PROVIDER_COLORS[provider.provider])}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Section B: Metrics Table */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead className="text-right">Responses</TableHead>
                <TableHead className="text-right">Avg Words</TableHead>
                <TableHead className="text-right">Avg Citations</TableHead>
                <TableHead className="text-right">Avg Latency</TableHead>
                <TableHead className="text-right">Citation Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((provider) => (
                <TableRow key={provider.provider}>
                  <TableCell className="font-medium">
                    {capitalizeProvider(provider.provider)}
                  </TableCell>
                  <TableCell className="text-right">
                    {provider.total_responses}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      winners.word_count === provider.provider
                        ? 'text-green-600 font-semibold'
                        : ''
                    }`}
                  >
                    {Math.round(provider.avg_word_count)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      winners.citations === provider.provider
                        ? 'text-green-600 font-semibold'
                        : ''
                    }`}
                  >
                    {Math.round(provider.avg_citation_count * 10) / 10}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      winners.latency === provider.provider
                        ? 'text-green-600 font-semibold'
                        : ''
                    }`}
                  >
                    {Math.round(provider.avg_latency_ms)}ms
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      winners.citation_share === provider.provider
                        ? 'text-green-600 font-semibold'
                        : ''
                    }`}
                  >
                    {Math.round(provider.citation_share * 100 * 10) / 10}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
