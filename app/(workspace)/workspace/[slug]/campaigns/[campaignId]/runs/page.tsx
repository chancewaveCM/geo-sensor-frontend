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
        toast.success('캠페인 실행이 시작되었습니다!')
        setDialogOpen(false)
      },
      onError: () => {
        toast.error('실행 시작에 실패했습니다')
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
          <h1 className="text-3xl font-bold tracking-tight">실행 기록</h1>
          <p className="text-muted-foreground mt-1">
            캠페인 실행 기록을 확인하고 관리하세요
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange-hover">
              <Play className="h-4 w-4 mr-2" />
              새 실행 시작
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>캠페인 실행 시작</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label>LLM 제공자</Label>
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
                  취소
                </Button>
                <Button
                  onClick={handleTriggerRun}
                  disabled={triggering || selectedProviders.length === 0}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {triggering ? '시작 중...' : '실행 시작'}
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
            <Label className="text-sm font-medium">상태:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="pending">대기 중</SelectItem>
                <SelectItem value="executing">실행 중</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="failed">실패</SelectItem>
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
                  <TableHead>실행 #</TableHead>
                  <TableHead>트리거</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>LLM 제공자</TableHead>
                  <TableHead>쿼리</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>완료일</TableHead>
                  <TableHead>소요 시간</TableHead>
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
                                ({run.failed_queries} 실패)
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
                  ? '아직 실행 기록이 없습니다. 첫 번째 실행을 시작하세요.'
                  : `${statusFilter === 'pending' ? '대기 중' : statusFilter === 'executing' ? '실행 중' : statusFilter === 'completed' ? '완료' : '실패'}인 실행이 없습니다.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
