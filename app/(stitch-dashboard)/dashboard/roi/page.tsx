'use client'

import { ROIMetricCard } from '@/components/stitch/dashboard/roi/ROIMetricCard'
import { PerformanceChart, PerformanceDataPoint } from '@/components/stitch/dashboard/roi/PerformanceChart'
import { CostBreakdown, CostCategory } from '@/components/stitch/dashboard/roi/CostBreakdown'
import { SettlementTable, SettlementRecord } from '@/components/stitch/dashboard/roi/SettlementTable'
import { ReportGenerator } from '@/components/stitch/dashboard/roi/ReportGenerator'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, TrendingUp, Calendar, AlertCircle } from 'lucide-react'

// Mock data - Backend ROI endpoints not ready yet
const mockROIData = {
  roi: 348,
  investment: 71200,
  returns: 248450,
  trend: {
    value: 12.4,
    isPositive: true,
  },
}

const mockPerformanceData: PerformanceDataPoint[] = [
  { month: 'Jan', revenue: 180000, citationShare: 18.5 },
  { month: 'Feb', revenue: 185000, citationShare: 20.2 },
  { month: 'Mar', revenue: 195000, citationShare: 22.8 },
  { month: 'Apr', revenue: 205000, citationShare: 25.3 },
  { month: 'May', revenue: 220000, citationShare: 28.1 },
  { month: 'Jun', revenue: 235000, citationShare: 30.7 },
  { month: 'Jul', revenue: 230000, citationShare: 29.9 },
  { month: 'Aug', revenue: 225000, citationShare: 31.2 },
  { month: 'Sep', revenue: 220000, citationShare: 32.8 },
  { month: 'Oct', revenue: 238000, citationShare: 33.5 },
  { month: 'Nov', revenue: 245000, citationShare: 34.2 },
  { month: 'Dec', revenue: 248450, citationShare: 34.8 },
]

const mockCostCategories: CostCategory[] = [
  { name: 'Infrastructure', value: 28500, color: 'hsl(var(--primary))' },
  { name: 'API Costs', value: 18700, color: 'hsl(var(--brand-navy))' },
  { name: 'Development', value: 12300, color: 'hsl(var(--success))' },
  { name: 'Marketing', value: 8200, color: 'hsl(var(--info))' },
  { name: 'Support', value: 3500, color: 'hsl(var(--warning))' },
]

const mockSettlementRecords: SettlementRecord[] = [
  {
    id: '1',
    date: '2026-01-15',
    type: 'Monthly Settlement',
    amount: 24845,
    status: 'Paid',
  },
  {
    id: '2',
    date: '2025-12-15',
    type: 'Monthly Settlement',
    amount: 22050,
    status: 'Paid',
  },
  {
    id: '3',
    date: '2025-11-15',
    type: 'Monthly Settlement',
    amount: 19560,
    status: 'Paid',
  },
  {
    id: '4',
    date: '2025-10-15',
    type: 'Quarterly Bonus',
    amount: 8500,
    status: 'Pending',
  },
  {
    id: '5',
    date: '2025-09-15',
    type: 'Monthly Settlement',
    amount: 18200,
    status: 'Paid',
  },
]

export default function RoiPage() {
  const handleExportRecords = () => {
    console.log('Exporting settlement records...')
    // TODO: Implement export functionality
  }

  const handleGenerateReport = async (reportType: string, format: string) => {
    console.log('Generating report:', reportType, format)
    // TODO: Implement report generation with backend
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Enterprise ROI & Settlement Hub
        </h1>
        <p className="text-muted-foreground">
          Financial performance metrics and revenue distribution management
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Earned */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Total Earned
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground mb-2">
                  ${mockROIData.returns.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  <span>+12.4%</span>
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Citation Growth */}
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Citation Growth
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground mb-2">
                  34.8%
                </p>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settlement Period */}
        <Card className="border-l-4 border-l-brand-navy">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Settlement Period
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground mb-2">
                  Q1 2026
                </p>
                <p className="text-sm text-muted-foreground">Next: Apr 15, 2026</p>
              </div>
              <div className="rounded-full bg-brand-navy/10 p-3">
                <Calendar className="h-6 w-6 text-brand-navy" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Pending Tasks
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground mb-2">
                  3
                </p>
                <p className="text-sm font-medium text-muted-foreground">Critical Approvals</p>
              </div>
              <div className="rounded-full bg-warning/10 p-3">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Metric Card */}
      <ROIMetricCard {...mockROIData} />

      {/* Chart and Cost Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Performance Chart - 6 columns */}
        <div className="lg:col-span-6">
          <PerformanceChart data={mockPerformanceData} metrics={['Revenue', 'Citation Share']} />
        </div>

        {/* Cost Breakdown - 4 columns */}
        <div className="lg:col-span-4">
          <CostBreakdown categories={mockCostCategories} />
        </div>
      </div>

      {/* Settlement Records Table */}
      <SettlementTable records={mockSettlementRecords} onExport={handleExportRecords} />

      {/* Report Generation Section */}
      <ReportGenerator onGenerate={handleGenerateReport} />
    </div>
  )
}
