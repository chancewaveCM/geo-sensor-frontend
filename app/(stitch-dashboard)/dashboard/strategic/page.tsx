'use client'

import { useState, useEffect } from 'react'
import { PerformanceMetricCard } from '@/components/stitch/dashboard/strategic/PerformanceMetricCard'
import { CitationShareChart } from '@/components/stitch/dashboard/strategic/CitationShareChart'
import { BrandRankingTable, BrandRanking } from '@/components/stitch/dashboard/strategic/BrandRankingTable'
import { TrendChart } from '@/components/stitch/dashboard/strategic/TrendChart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, TrendingUp, BarChart3, AlertCircle } from 'lucide-react'

// Mock data - replace with real API calls
const mockCitationData = [
  { brand: 'Your Brand', share: 35.2, color: 'hsl(var(--chart-1))' },
  { brand: 'Competitor A', share: 28.5, color: 'hsl(var(--chart-2))' },
  { brand: 'Competitor B', share: 18.3, color: 'hsl(var(--chart-3))' },
  { brand: 'Competitor C', share: 12.1, color: 'hsl(var(--chart-4))' },
  { brand: 'Others', share: 5.9, color: 'hsl(var(--chart-5))' },
]

const mockBrandRankings: BrandRanking[] = [
  { rank: 1, brand: 'Your Brand', mentions: 1450, share: 35.2, change: 5.2 },
  { rank: 2, brand: 'Competitor A', mentions: 1175, share: 28.5, change: -2.1 },
  { rank: 3, brand: 'Competitor B', mentions: 755, share: 18.3, change: 3.4 },
  { rank: 4, brand: 'Competitor C', mentions: 498, share: 12.1, change: -1.5 },
  { rank: 5, brand: 'Competitor D', mentions: 243, share: 5.9, change: 0.8 },
]

const mockTrendData = [
  { date: 'W1', 'Your Brand': 32, 'Competitor A': 30, 'Competitor B': 15 },
  { date: 'W2', 'Your Brand': 33, 'Competitor A': 29, 'Competitor B': 16 },
  { date: 'W3', 'Your Brand': 31, 'Competitor A': 31, 'Competitor B': 17 },
  { date: 'W4', 'Your Brand': 34, 'Competitor A': 28, 'Competitor B': 18 },
  { date: 'W5', 'Your Brand': 33, 'Competitor A': 29, 'Competitor B': 17 },
  { date: 'W6', 'Your Brand': 35, 'Competitor A': 28, 'Competitor B': 18 },
  { date: 'W7', 'Your Brand': 36, 'Competitor A': 27, 'Competitor B': 19 },
  { date: 'W8', 'Your Brand': 35, 'Competitor A': 28, 'Competitor B': 18 },
]

const trendBrands = [
  { name: 'Your Brand', color: 'hsl(var(--chart-1))' },
  { name: 'Competitor A', color: 'hsl(var(--chart-2))' },
  { name: 'Competitor B', color: 'hsl(var(--chart-3))' },
]

export default function StrategicAnalysisPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30D')

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section - PAWC Score Card */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-navy via-brand-navy-light to-chart-4 text-white p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 w-full md:w-auto">
            <div>
              <h3 className="text-white/70 font-medium tracking-wide text-sm uppercase">
                Overall Performance Index
              </h3>
              <div className="flex items-baseline gap-4 mt-1">
                <span className="text-7xl font-bold">78.5</span>
                <div className="flex items-center bg-success/20 text-success px-2 py-1 rounded-full text-sm font-bold border border-success/30">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5.2
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-2">PAWC Score Card</h2>
            </div>
            <p className="text-white/70 max-w-md">
              Your citations in AI search engines have increased by 14% compared to the previous period.
              Focus on technical specs for further gains.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg">
              Generate Detailed Strategy
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" role="img" aria-label="78.5% efficiency rating">
              <circle
                className="text-white/10"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
              />
              <circle
                className="text-primary"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeDasharray="552.9"
                strokeDashoffset="118.8"
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">78.5%</span>
              <span className="text-xs text-white/70 uppercase font-bold tracking-widest">
                Efficiency
              </span>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
      </section>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Key Performance Drivers</h2>
        <div className="flex bg-muted p-1 rounded-lg">
          {['7D', '30D', '90D', 'Custom'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                timeRange === range
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <PerformanceMetricCard
          title="Citation Share"
          value="35.2%"
          change={5.2}
          trend="up"
          sparklineData={[60, 65, 62, 70, 68, 75, 78, 85]}
        />
        <PerformanceMetricCard
          title="Total Mentions"
          value="1,450"
          change={12.5}
          trend="up"
          unit="%"
          sparklineData={[55, 58, 60, 65, 70, 72, 75, 80]}
        />
        <PerformanceMetricCard
          title="Response Quality"
          value="8.7"
          change={0.3}
          trend="up"
          unit="/10"
          sparklineData={[70, 72, 68, 75, 78, 80, 82, 87]}
        />
        <PerformanceMetricCard
          title="Coverage Rate"
          value="92%"
          change={-2.1}
          trend="down"
          unit="%"
          sparklineData={[95, 94, 96, 93, 92, 94, 93, 92]}
        />
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Citation Share Chart */}
        <CitationShareChart data={mockCitationData} title="Citation Share Distribution" />

        {/* Brand Rankings */}
        <BrandRankingTable brands={mockBrandRankings} />

        {/* SHAP Contribution Analysis */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">SHAP Contribution Analysis</CardTitle>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <AlertCircle className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Schema Markup Enhancement', value: 18.5, width: 75, positive: true },
                { label: 'Content Freshness Cycle', value: 12.3, width: 55, positive: true },
                { label: 'Page Load Latency', value: -2.1, width: 15, positive: false },
                { label: 'E-E-A-T Signal Depth', value: 4.8, width: 25, positive: true },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">{item.label}</span>
                    <span className={`font-bold ${item.positive ? 'text-primary' : 'text-error'}`}>
                      {item.value > 0 ? '+' : ''}{item.value}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.positive ? 'bg-primary' : 'bg-error'
                      }`}
                      style={{ width: `${item.width}%`, opacity: item.positive ? 0.7 : 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <TrendChart
          data={mockTrendData}
          brands={trendBrands}
          timeRange={timeRange}
          title="Performance Trends Over Time"
        />
      </div>

      {/* Report Footer */}
      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold">Latest Citations Report Available</p>
              <p className="text-xs text-muted-foreground">
                Last updated 14 minutes ago • Source: Multi-LLM API Bridge
              </p>
            </div>
          </div>
          <Button variant="outline" className="hover:border-primary/50">
            View Detailed Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <div className="h-64 rounded-lg bg-muted animate-pulse" />

      {/* Metrics grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>

      {/* Charts grid skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-80 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}
