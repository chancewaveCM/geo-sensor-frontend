'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { KPICard } from '@/components/campaign/KPICard'
import { TimeseriesChart } from '@/components/campaign/TimeseriesChart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Play, BarChart3, CheckCircle2, AlertCircle, TrendingUp, FileSearch, Image, Settings } from 'lucide-react'
import { useCampaign, useCampaignRuns, useTriggerRun } from '@/lib/hooks/use-campaigns'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function getStatusVariant(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-600 border-green-500/20'
    case 'paused':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    case 'completed':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'draft':
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  }
}

function getRunStatusVariant(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-600 border-green-500/20'
    case 'executing':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'failed':
      return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'pending':
    default:
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
  }
}

export default function CampaignDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const campaignId = parseInt(params?.campaignId as string)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const { data: campaign, isLoading: campaignLoading } = useCampaign(workspaceId, campaignId)
  const { data: runs, isLoading: runsLoading } = useCampaignRuns(workspaceId, campaignId)
  const { mutate: triggerRun, isPending: triggering } = useTriggerRun(workspaceId, campaignId)

  const handleTriggerRun = () => {
    triggerRun({ trigger_type: 'manual', llm_providers: ['openai', 'gemini'] }, {
      onSuccess: () => {
        toast.success('Campaign run triggered successfully!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || 'Failed to trigger run')
      }
    })
  }

  const latestRun = runs?.[0]
  const totalRuns = runs?.length || 0
  const activeQueries = campaign?.id ? 0 : 0 // Placeholder - will be from query API
  const completedQueries = latestRun?.completed_queries || 0
  const citationSharePlaceholder = '0.0%'

  if (campaignLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
        <Button onClick={() => router.push(`/workspace/${slug}/campaigns`)}>
          Back to Campaigns
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <Badge className={cn('text-xs', getStatusVariant(campaign.status))}>
            {campaign.status}
          </Badge>
        </div>
        <Button
          onClick={handleTriggerRun}
          disabled={triggering}
          className="bg-brand-orange hover:bg-brand-orange-hover"
        >
          <Play className="h-4 w-4 mr-2" />
          {triggering ? 'Triggering...' : 'Trigger Run'}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Runs"
          value={totalRuns}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <KPICard
          title="Active Queries"
          value={activeQueries}
          subtitle="Ready for execution"
          icon={<FileSearch className="h-5 w-5" />}
        />
        <KPICard
          title="Completed Queries"
          value={completedQueries}
          subtitle="From latest run"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <KPICard
          title="Citation Share"
          value={citationSharePlaceholder}
          subtitle="Latest run"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Timeseries Chart */}
      {runs && runs.length > 0 && <TimeseriesChart runs={runs} />}

      {/* Recent Runs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Runs</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/workspace/${slug}/campaigns/${campaignId}/runs` as any)}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {runsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : runs && runs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run #</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Queries</TableHead>
                  <TableHead>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.slice(0, 5).map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-mono text-sm">#{run.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {run.trigger_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', getRunStatusVariant(run.status))}>
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {run.completed_queries}/{run.total_queries}
                      {run.failed_queries > 0 && (
                        <span className="text-destructive ml-1">
                          ({run.failed_queries} failed)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(run.created_at).toLocaleString('ko-KR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No runs yet. Trigger your first run to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => router.push(`/workspace/${slug}/campaigns/${campaignId}/queries` as any)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-brand-orange/10 p-3">
              <FileSearch className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-semibold">Query Management</h3>
              <p className="text-sm text-muted-foreground">Manage query definitions</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => router.push(`/workspace/${slug}/campaigns/${campaignId}/gallery` as any)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-brand-orange/10 p-3">
              <Image className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-semibold">Gallery</h3>
              <p className="text-sm text-muted-foreground">Browse LLM responses</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          onClick={() => router.push(`/workspace/${slug}/campaigns/${campaignId}/operations` as any)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-brand-orange/10 p-3">
              <Settings className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-semibold">Operations</h3>
              <p className="text-sm text-muted-foreground">Manage operations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
