'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface PerformanceDataPoint {
  month: string
  revenue: number
  citationShare: number
}

export interface PerformanceChartProps {
  data: PerformanceDataPoint[]
  metrics: string[]
}

type TimePeriod = '6M' | '1Y' | 'All'

export function PerformanceChart({ data, metrics }: PerformanceChartProps) {
  const [period, setPeriod] = useState<TimePeriod>('1Y')

  // Filter data based on selected period
  const getFilteredData = () => {
    if (period === '6M') return data.slice(-6)
    if (period === '1Y') return data.slice(-12)
    return data
  }

  const filteredData = getFilteredData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Performance vs Revenue</CardTitle>
            <CardDescription>Correlation of citation share and monthly earnings</CardDescription>
          </div>

          {/* Period Selector */}
          <div className="flex bg-muted p-1 rounded-lg h-10 w-full md:w-48" role="group" aria-label="Time period selection">
            {(['6M', '1Y', 'All'] as TimePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                  period === p
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={p === '6M' ? '6 months' : p === '1Y' ? '1 year' : 'All time'}
                aria-pressed={period === p}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />

            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              formatter={(value: number, name: string) => {
                if (name === 'Revenue') return [formatCurrency(value), 'Revenue']
                if (name === 'Citation Share') return [formatPercent(value), 'Citation Share']
                return [value, name]
              }}
            />

            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />

            {/* Revenue Area */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{ r: 6 }}
            />

            {/* Citation Share Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="citationShare"
              name="Citation Share"
              stroke="hsl(var(--brand-navy))"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{ fill: 'hsl(var(--brand-navy))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
