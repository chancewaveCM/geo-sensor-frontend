'use client'

import { useState, useEffect } from 'react'
import { PipelineStages } from '@/components/stitch/dashboard/pipeline/PipelineStages'
import { ApprovalQueue } from '@/components/stitch/dashboard/pipeline/ApprovalQueue'
import { QueryDiffViewer } from '@/components/stitch/dashboard/pipeline/QueryDiffViewer'
import { WorkflowStats } from '@/components/stitch/dashboard/pipeline/WorkflowStats'
import { RegionFilter } from '@/components/stitch/dashboard/pipeline/RegionFilter'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Play, AlertCircle } from 'lucide-react'
import type { PipelineStageData, ApprovalItem, WorkflowStats as WorkflowStatsType } from '@/components/stitch/dashboard/pipeline/types'

// Mock data - replace with real API calls
const mockStages: PipelineStageData[] = [
  { id: 'draft', label: 'Draft', count: 12 },
  { id: 'review', label: 'Review', count: 8 },
  { id: 'approved', label: 'Approved', count: 24 },
  { id: 'published', label: 'Published', count: 156 },
]

const mockApprovalItems: ApprovalItem[] = [
  {
    id: '1',
    queryText: 'What are the best enterprise collaboration tools for remote teams?',
    submitter: 'Sarah Kim',
    submitterEmail: 'sarah.kim@company.com',
    dateSubmitted: '2026-02-03',
    status: 'pending',
    region: 'US',
    original: 'What are the best collaboration tools?',
    edited: 'What are the best enterprise collaboration tools for remote teams?',
  },
  {
    id: '2',
    queryText: 'How to implement zero-trust security architecture?',
    submitter: 'John Park',
    submitterEmail: 'john.park@company.com',
    dateSubmitted: '2026-02-02',
    status: 'pending',
    region: 'KR',
    original: 'How to implement security?',
    edited: 'How to implement zero-trust security architecture?',
  },
  {
    id: '3',
    queryText: 'Best practices for microservices deployment in Kubernetes',
    submitter: 'Emma Chen',
    submitterEmail: 'emma.chen@company.com',
    dateSubmitted: '2026-02-01',
    status: 'pending',
    region: 'US',
    original: 'Best practices for microservices',
    edited: 'Best practices for microservices deployment in Kubernetes',
  },
]

const mockStats: WorkflowStatsType = {
  total: 200,
  pending: 8,
  approved: 24,
  rejected: 12,
  trends: {
    total: 12.5,
    pending: -5.2,
    approved: 18.3,
    rejected: 3.1,
  },
}

const mockRegions = [
  { code: 'ALL', label: 'All Regions' },
  { code: 'US', label: 'United States' },
  { code: 'KR', label: 'South Korea' },
  { code: 'JP', label: 'Japan' },
  { code: 'EU', label: 'Europe' },
  { code: 'CN', label: 'China' },
]

export default function PipelinePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<string>('review')
  const [activeRegion, setActiveRegion] = useState<string>('ALL')
  const [selectedItemForDiff, setSelectedItemForDiff] = useState<ApprovalItem | null>(null)
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>(mockApprovalItems)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter approval items by region
  const filteredItems = activeRegion === 'ALL'
    ? approvalItems
    : approvalItems.filter((item) => item.region === activeRegion)

  const handleApprove = (ids: string[]) => {
    console.log('Approving items:', ids)
    setApprovalItems((prev) =>
      prev.map((item) => (ids.includes(item.id) ? { ...item, status: 'approved' as const } : item))
    )
  }

  const handleReject = (ids: string[]) => {
    console.log('Rejecting items:', ids)
    setApprovalItems((prev) =>
      prev.map((item) => (ids.includes(item.id) ? { ...item, status: 'rejected' as const } : item))
    )
  }

  const handleStageClick = (stageId: string) => {
    setActiveStage(stageId)
  }

  const handleRegionChange = (regionCode: string) => {
    setActiveRegion(regionCode)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  // Select first pending item for diff preview
  const diffItem = selectedItemForDiff || filteredItems.find((item) => item.status === 'pending')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-navy via-brand-navy-light to-chart-4 text-white p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 w-full md:w-auto">
            <div>
              <h3 className="text-white/70 font-medium tracking-wide text-sm uppercase">
                Global Query Management
              </h3>
              <h2 className="text-3xl font-bold mt-2">Pipeline & Approval Workflow</h2>
            </div>
            <p className="text-white/70 max-w-md">
              Manage query submissions across regions. Review, approve, or reject queries before
              they are deployed to production.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg">
              <Play className="mr-2 h-4 w-4" />
              Start Batch Review
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="rounded-full bg-white/10 p-8 backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-6xl">approval</span>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
      </section>

      {/* Workflow Stats */}
      <WorkflowStats stats={mockStats} />

      {/* Pipeline Stages */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Pipeline Stages</CardTitle>
          <CardDescription>Track query progression through the approval workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <PipelineStages
            stages={mockStages}
            activeStage={activeStage}
            onStageClick={handleStageClick}
          />
        </CardContent>
      </Card>

      {/* Region Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Approval Queue</h2>
        <RegionFilter regions={mockRegions} active={activeRegion} onChange={handleRegionChange} />
      </div>

      {/* Approval Queue */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
          <CardDescription>
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} awaiting review
            {activeRegion !== 'ALL' && ` in ${mockRegions.find(r => r.code === activeRegion)?.label}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApprovalQueue items={filteredItems} onApprove={handleApprove} onReject={handleReject} />
        </CardContent>
      </Card>

      {/* Query Diff Viewer */}
      {diffItem && diffItem.original && diffItem.edited && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Change Preview</CardTitle>
            <CardDescription>Review modifications before approval</CardDescription>
          </CardHeader>
          <CardContent>
            <QueryDiffViewer
              original={diffItem.original}
              edited={diffItem.edited}
              fileName={`Query ${diffItem.id}`}
            />
          </CardContent>
        </Card>
      )}

      {/* Action Footer */}
      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg text-warning">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold">Automated Workflow Available</p>
              <p className="text-xs text-muted-foreground">
                Enable auto-approval for queries matching specific criteria
              </p>
            </div>
          </div>
          <Button variant="outline" className="hover:border-primary/50">
            Configure Rules
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

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>

      {/* Pipeline skeleton */}
      <div className="h-32 rounded-lg bg-muted animate-pulse" />

      {/* Queue skeleton */}
      <div className="h-96 rounded-lg bg-muted animate-pulse" />

      {/* Diff skeleton */}
      <div className="h-64 rounded-lg bg-muted animate-pulse" />
    </div>
  )
}
