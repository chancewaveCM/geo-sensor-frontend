'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { cn } from "@/lib/utils"
import { getTokenColor } from '@/lib/design-tokens'

export interface SentimentGaugeProps {
  positive: number
  neutral: number
  negative: number
  className?: string
}

const COLORS = {
  positive: getTokenColor('--sentiment-positive'),
  neutral: getTokenColor('--sentiment-neutral'),
  negative: getTokenColor('--sentiment-negative'),
}

export function SentimentGauge({ positive, neutral, negative, className }: SentimentGaugeProps) {
  const total = positive + neutral + negative

  const data = [
    { name: 'Positive', value: positive, color: COLORS.positive },
    { name: 'Neutral', value: neutral, color: COLORS.neutral },
    { name: 'Negative', value: negative, color: COLORS.negative }
  ]

  const getPercentage = (value: number) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Overall Sentiment</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Distribution across {total.toLocaleString()} responses
        </p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => {
              const percent = getPercentage(entry.payload.value)
              return `${value} ${percent}%`
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="size-3 rounded-full bg-sentiment-positive" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">Positive</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{getPercentage(positive)}%</p>
          <p className="text-xs text-muted-foreground">{positive.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="size-3 rounded-full bg-sentiment-neutral" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">Neutral</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{getPercentage(neutral)}%</p>
          <p className="text-xs text-muted-foreground">{neutral.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="size-3 rounded-full bg-sentiment-negative" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">Negative</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{getPercentage(negative)}%</p>
          <p className="text-xs text-muted-foreground">{negative.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
