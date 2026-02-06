'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Award } from 'lucide-react'
import { getTokenColor } from '@/lib/design-tokens'

interface GeoScoreData {
  overall: number
  grade: string
  dimensions: Array<{ name: string; score: number }>
}

interface GeoScoreChartProps {
  data: GeoScoreData
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A':
      return 'text-grade-a border-grade-a bg-grade-a/10'
    case 'B':
      return 'text-grade-b border-grade-b bg-grade-b/10'
    case 'C':
      return 'text-grade-c border-grade-c bg-grade-c/10'
    case 'D':
      return 'text-grade-d border-grade-d bg-grade-d/10'
    default:
      return 'text-grade-f border-grade-f bg-grade-f/10'
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground">
          Score: <span className="font-medium text-primary">{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

export function GeoScoreChart({ data }: GeoScoreChartProps) {
  return (
    <Card data-testid="geo-score-chart" className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          GEO Optimization Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Score Display */}
          <div className="flex flex-col items-center justify-center space-y-4 lg:w-1/3">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-8 border-muted flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold">{data.overall}</p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                <div
                  className={`h-16 w-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold shadow-lg ${getGradeColor(
                    data.grade
                  )}`}
                >
                  {data.grade}
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground max-w-[200px]">
              Overall optimization performance across all dimensions
            </p>
          </div>

          {/* Radar Chart */}
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={data.dimensions}>
                <PolarGrid stroke={getTokenColor('--chart-grid')} />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: getTokenColor('--chart-axis-text') }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={getTokenColor('--chart-4')}
                  fill={getTokenColor('--chart-4')}
                  fillOpacity={0.6}
                  animationDuration={800}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dimension Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.dimensions.map((dimension) => (
            <div
              key={dimension.name}
              className="rounded-lg border bg-muted/30 p-3 transition-all duration-200 hover:bg-muted/50"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {dimension.name}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-chart-4 to-chart-5 transition-all duration-500"
                    style={{ width: `${dimension.score}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-primary">
                  {dimension.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
