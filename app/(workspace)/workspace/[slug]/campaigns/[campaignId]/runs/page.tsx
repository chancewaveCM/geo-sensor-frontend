'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Play, Filter } from 'lucide-react'
import { useCampaignRuns, useTriggerRun } from '@/lib/hooks/use-campaigns'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import type { CampaignRun } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function getStatusVariant(status: string) {
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

function getTriggerVariant(trigger: string) {
  switch (trigger) {
    case 'manual':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'scheduled':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    case 'api':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export default function RunsPage() {
  const params = useParams()
  const slug = params?.slug as string
  const campaignId = parseInt(params?.campaignId as string, 10)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const { data: runs, isLoading } = useCampaignRuns(workspaceId, campaignId)
  const { mutate: triggerRun, isPending: triggering } = useTriggerRun(workspaceId, campaignId)

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['openai', 'gemini'])

  const handleTriggerRun = () => {
    triggerRun({ trigger_type: 'manual', llm_providers: selectedProviders }, {
      onSuccess: () => {
        toast.success('Campaign run triggered successfully!')
        setDialogOpen(false)
      },
      onError: () => {
        toast.error('Failed to trigger run')
      }
    })
  }

  const filteredRuns = runs?.filter((run) => {
    if (statusFilter === 'all') return true
    return run.status === statusFilter
  })

  const getDuration = (run: CampaignRun) => {
    if (!run.completed_at) return '-'
    const start = new Date(run.created_at).getTime()
    const end = new Date(run.completed_at).getTime()
    const durationMs = end - start
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Run History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage campaign execution runs
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange-hover">
              <Play className="h-4 w-4 mr-2" />
              Trigger New Run
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Trigger Campaign Run</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label>LLM Providers</Label>
                <div className="space-y-2">
                  {['openai', 'gemini', 'anthropic'].map((provider) => (
                    <div key={provider} className="flex items-center space-x-2">
                      <Checkbox
                        id={provider}
                        checked={selectedProviders.includes(provider)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProviders([...selectedProviders, provider])
                          } else {
                            setSelectedProviders(selectedProviders.filter((p) => p !== provider))
                          }
                        }}
                      />
                      <Label htmlFor={provider} className="text-sm font-normal cursor-pointer capitalize">
                        {provider}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTriggerRun}
                  disabled={triggering || selectedProviders.length === 0}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {triggering ? 'Triggering...' : 'Trigger Run'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="executing">Executing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Runs Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredRuns && filteredRuns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run #</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>LLM Providers</TableHead>
                  <TableHead>Queries</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRuns.map((run) => {
                  const progress = run.total_queries > 0
                    ? (run.completed_queries / run.total_queries) * 100
                    : 0

                  return (
                    <TableRow key={run.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        #{run.id}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', getTriggerVariant(run.trigger_type))}>
                          {run.trigger_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', getStatusVariant(run.status))}>
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            try {
                              const providers = JSON.parse(run.llm_providers) as string[]
                              return providers.map((provider: string) => (
                                <Badge key={provider} variant="outline" className="text-xs">
                                  {provider}
                                </Badge>
                              ))
                            } catch {
                              return <span className="text-sm text-muted-foreground">-</span>
                            }
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{run.completed_queries}</span>
                            <span className="text-muted-foreground">/{run.total_queries}</span>
                            {run.failed_queries > 0 && (
                              <span className="text-destructive ml-2">
                                ({run.failed_queries} failed)
                              </span>
                            )}
                          </div>
                          {run.status === 'executing' && (
                            <Progress value={progress} className="h-1.5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(run.created_at).toLocaleString('ko-KR')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {run.completed_at
                          ? new Date(run.completed_at).toLocaleString('ko-KR')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getDuration(run)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {statusFilter === 'all'
                  ? 'No runs yet. Trigger your first run to get started.'
                  : `No ${statusFilter} runs found.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
