'use client'

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TrendDataPoint {
  date: string
  [key: string]: string | number
}

interface BrandConfig {
  name: string
  color: string
}

interface TrendChartProps {
  data: TrendDataPoint[]
  brands: BrandConfig[]
  timeRange?: string
  title?: string
}

export function TrendChart({
  data,
  brands,
  timeRange = '30D',
  title = 'Performance Trends'
}: TrendChartProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <div className="flex gap-2">
            {brands.map((brand) => (
              <div key={brand.name} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: brand.color }}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
              {brands.map((brand) => (
                <Line
                  key={brand.name}
                  type="monotone"
                  dataKey={brand.name}
                  stroke={brand.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
