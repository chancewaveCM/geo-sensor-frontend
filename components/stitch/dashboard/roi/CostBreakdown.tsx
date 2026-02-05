'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export interface CostCategory {
  name: string
  value: number
  color: string
}

export interface CostBreakdownProps {
  categories: CostCategory[]
}

export function CostBreakdown({ categories }: CostBreakdownProps) {
  const total = categories.reduce((sum, cat) => sum + cat.value, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${((value / total) * 100).toFixed(1)}%`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Cost Breakdown</CardTitle>
        <CardDescription>Distribution of operational expenses</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with Values */}
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground">{category.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(category.value)}
                  </span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {formatPercent(category.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
