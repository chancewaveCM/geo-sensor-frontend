'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, History, Archive, Shield } from 'lucide-react'
import {
  useQueryDefinitions,
  useQueryVersions,
  useCreateQueryDefinition,
  useCreateQueryVersion,
  useRetireQuery,
  useIntentClusters
} from '@/lib/hooks/use-campaigns'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import type { QueryDefinitionCreate, QueryVersionCreate, QueryDefinition } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function getQueryTypeVariant(type: string) {
  switch (type) {
    case 'anchor':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'exploration':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export default function QueriesPage() {
  const params = useParams()
  const slug = params?.slug as string
  const campaignId = parseInt(params?.campaignId as string, 10)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const [activeTab, setActiveTab] = useState('all')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [versionDialogOpen, setVersionDialogOpen] = useState(false)
  const [retireDialogOpen, setRetireDialogOpen] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState<number | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<string>('all')

  const { data: queries, isLoading } = useQueryDefinitions(workspaceId, campaignId)
  const { data: clusters } = useIntentClusters(workspaceId, campaignId)
  const { mutate: createQuery, isPending: creating } = useCreateQueryDefinition(workspaceId, campaignId)
  const { mutate: createVersion, isPending: creatingVersion } = useCreateQueryVersion(
    workspaceId,
    campaignId,
    selectedQuery || 0
  )
  const { mutate: retireQuery, isPending: retiring } = useRetireQuery(workspaceId, campaignId)

  const [newQueryForm, setNewQueryForm] = useState<QueryDefinitionCreate>({
    query_type: 'exploration',
    intent_cluster_id: 0,
    text: '',
    persona_type: 'default'
  })

  const [newVersionForm, setNewVersionForm] = useState<QueryVersionCreate>({
    text: '',
    persona_type: 'default',
    change_reason: ''
  })

  const handleCreateQuery = (e: React.FormEvent) => {
    e.preventDefault()
    createQuery(newQueryForm, {
      onSuccess: () => {
        toast.success('쿼리가 생성되었습니다!')
        setAddDialogOpen(false)
        setNewQueryForm({
          query_type: 'exploration',
          intent_cluster_id: 0,
          text: '',
          persona_type: 'default'
        })
      },
      onError: () => {
        toast.error('쿼리 생성에 실패했습니다')
      }
    })
  }

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuery) return

    createVersion(newVersionForm, {
      onSuccess: () => {
        toast.success('새 버전이 생성되었습니다!')
        setVersionDialogOpen(false)
        setNewVersionForm({
          text: '',
          persona_type: 'default',
          change_reason: ''
        })
      },
      onError: () => {
        toast.error('버전 생성에 실패했습니다')
      }
    })
  }

  const handleRetireQuery = () => {
    if (!selectedQuery) return

    retireQuery(selectedQuery, {
      onSuccess: () => {
        toast.success('쿼리가 비활성화되었습니다!')
        setRetireDialogOpen(false)
        setSelectedQuery(null)
      },
      onError: () => {
        toast.error('쿼리 비활성화에 실패했습니다')
      }
    })
  }

  const filteredQueries = queries?.filter((query) => {
    if (activeTab !== 'all' && activeTab !== query.query_type) return false
    if (selectedCluster !== 'all' && query.intent_cluster_id !== parseInt(selectedCluster)) return false
    return true
  })

  if (!workspaceId) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">워크스페이스 로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Actions */}
      <div className="flex items-center justify-end">
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange-hover">
              <Plus className="h-4 w-4 mr-2" />
              쿼리 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>새 쿼리 추가</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateQuery} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="query_type">쿼리 유형 *</Label>
                <Select
                  value={newQueryForm.query_type}
                  onValueChange={(value) =>
                    setNewQueryForm({ ...newQueryForm, query_type: value as 'anchor' | 'exploration' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exploration">탐색</SelectItem>
                    <SelectItem value="anchor">앵커 (관리자)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cluster">의도 클러스터</Label>
                <Select
                  value={newQueryForm.intent_cluster_id?.toString() || '0'}
                  onValueChange={(value) =>
                    setNewQueryForm({ ...newQueryForm, intent_cluster_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="클러스터 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {clusters?.map((cluster) => (
                      <SelectItem key={cluster.id} value={cluster.id.toString()}>
                        {cluster.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">쿼리 텍스트 *</Label>
                <Textarea
                  id="text"
                  placeholder="쿼리 텍스트를 입력하세요..."
                  value={newQueryForm.text}
                  onChange={(e) =>
                    setNewQueryForm({ ...newQueryForm, text: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persona">페르소나 유형</Label>
                <Input
                  id="persona"
                  placeholder="예: default, expert, beginner"
                  value={newQueryForm.persona_type}
                  onChange={(e) =>
                    setNewQueryForm({ ...newQueryForm, persona_type: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {creating ? '생성 중...' : '쿼리 생성'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Label className="text-sm font-medium">클러스터:</Label>
          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 클러스터</SelectItem>
              {clusters?.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id.toString()}>
                  {cluster.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="anchor">앵커</TabsTrigger>
          <TabsTrigger value="exploration">탐색</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredQueries && filteredQueries.length > 0 ? (
            <div className="space-y-3">
              {filteredQueries.map((query) => (
                <QueryCard
                  key={query.id}
                  query={query}
                  workspaceId={workspaceId}
                  campaignId={campaignId}
                  onNewVersion={(queryId) => {
                    setSelectedQuery(queryId)
                    setVersionDialogOpen(true)
                  }}
                  onRetire={(queryId) => {
                    setSelectedQuery(queryId)
                    setRetireDialogOpen(true)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                쿼리가 없습니다. 첫 번째 쿼리를 추가하세요.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* New Version Dialog */}
      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 버전 생성</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateVersion} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="version_text">쿼리 텍스트 *</Label>
              <Textarea
                id="version_text"
                placeholder="업데이트된 쿼리 텍스트를 입력하세요..."
                value={newVersionForm.text}
                onChange={(e) => setNewVersionForm({ ...newVersionForm, text: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version_persona">페르소나 유형</Label>
              <Input
                id="version_persona"
                placeholder="예: default, expert, beginner"
                value={newVersionForm.persona_type}
                onChange={(e) =>
                  setNewVersionForm({ ...newVersionForm, persona_type: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="change_reason">변경 사유 *</Label>
              <Textarea
                id="change_reason"
                placeholder="새 버전을 만드는 이유를 입력하세요"
                value={newVersionForm.change_reason}
                onChange={(e) =>
                  setNewVersionForm({ ...newVersionForm, change_reason: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVersionDialogOpen(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={creatingVersion}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
              >
                {creatingVersion ? '생성 중...' : '버전 생성'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Retire Confirmation Dialog */}
      <AlertDialog open={retireDialogOpen} onOpenChange={setRetireDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쿼리를 비활성화하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 쿼리를 비활성화 상태로 표시하며, 향후 실행에서 더 이상 실행되지 않습니다.
              이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRetireQuery}
              disabled={retiring}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {retiring ? '비활성화 중...' : '쿼리 비활성화'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface QueryCardProps {
  query: QueryDefinition & { intent_cluster_name?: string; initial_text?: string }
  workspaceId: number
  campaignId: number
  onNewVersion: (queryId: number) => void
  onRetire: (queryId: number) => void
}

function QueryCard({ query, workspaceId, campaignId, onNewVersion, onRetire }: QueryCardProps) {
  const { data: versions } = useQueryVersions(workspaceId, campaignId, query.id)
  const latestVersion = versions?.[0]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={cn('text-xs', getQueryTypeVariant(query.query_type))}>
                {query.query_type}
              </Badge>
              {query.query_type === 'anchor' && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  관리자 전용
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                v{latestVersion?.version || 1}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{latestVersion?.text || query.initial_text}</p>
            {query.intent_cluster_name && (
              <p className="text-xs text-muted-foreground">
                클러스터: {query.intent_cluster_name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNewVersion(query.id)}
              disabled={query.is_retired}
            >
              <History className="h-4 w-4 mr-1" />
              새 버전
            </Button>
            {!query.is_retired && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRetire(query.id)}
                className="text-destructive hover:text-destructive"
              >
                <Archive className="h-4 w-4 mr-1" />
                비활성화
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {versions && versions.length > 1 && (
        <CardContent className="pt-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="versions" className="border-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline py-2">
                이전 버전 {versions.length - 1}개 보기
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {versions.slice(1).map((version) => (
                    <div
                      key={version.id}
                      className="pl-4 border-l-2 border-muted space-y-1"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">v{version.version}</span>
                        <span>•</span>
                        <span>{new Date(version.created_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <p className="text-sm">{version.text}</p>
                      {version.change_reason && (
                        <p className="text-xs text-muted-foreground italic">
                          사유: {version.change_reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      )}
    </Card>
  )
}
