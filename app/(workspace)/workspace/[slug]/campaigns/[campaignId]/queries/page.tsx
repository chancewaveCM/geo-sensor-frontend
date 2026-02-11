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
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
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
        toast.success('Query created successfully!')
        setAddDialogOpen(false)
        setNewQueryForm({
          query_type: 'exploration',
          intent_cluster_id: 0,
          text: '',
          persona_type: 'default'
        })
      },
      onError: () => {
        toast.error('Failed to create query')
      }
    })
  }

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuery) return

    createVersion(newVersionForm, {
      onSuccess: () => {
        toast.success('New version created successfully!')
        setVersionDialogOpen(false)
        setNewVersionForm({
          text: '',
          persona_type: 'default',
          change_reason: ''
        })
      },
      onError: () => {
        toast.error('Failed to create version')
      }
    })
  }

  const handleRetireQuery = () => {
    if (!selectedQuery) return

    retireQuery(selectedQuery, {
      onSuccess: () => {
        toast.success('Query retired successfully!')
        setRetireDialogOpen(false)
        setSelectedQuery(null)
      },
      onError: () => {
        toast.error('Failed to retire query')
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
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Query Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage query definitions and version history
          </p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Query
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Query</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateQuery} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="query_type">Query Type *</Label>
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
                    <SelectItem value="exploration">Exploration</SelectItem>
                    <SelectItem value="anchor">Anchor (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cluster">Intent Cluster</Label>
                <Select
                  value={newQueryForm.intent_cluster_id?.toString() || '0'}
                  onValueChange={(value) =>
                    setNewQueryForm({ ...newQueryForm, intent_cluster_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cluster" />
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
                <Label htmlFor="text">Query Text *</Label>
                <Textarea
                  id="text"
                  placeholder="Enter your query text..."
                  value={newQueryForm.text}
                  onChange={(e) =>
                    setNewQueryForm({ ...newQueryForm, text: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persona">Persona Type</Label>
                <Input
                  id="persona"
                  placeholder="e.g., default, expert, beginner"
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {creating ? 'Creating...' : 'Create Query'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Label className="text-sm font-medium">Cluster:</Label>
          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
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
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="anchor">Anchor</TabsTrigger>
          <TabsTrigger value="exploration">Exploration</TabsTrigger>
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
                No queries found. Add your first query to get started.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* New Version Dialog */}
      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateVersion} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="version_text">Query Text *</Label>
              <Textarea
                id="version_text"
                placeholder="Enter updated query text..."
                value={newVersionForm.text}
                onChange={(e) => setNewVersionForm({ ...newVersionForm, text: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version_persona">Persona Type</Label>
              <Input
                id="version_persona"
                placeholder="e.g., default, expert, beginner"
                value={newVersionForm.persona_type}
                onChange={(e) =>
                  setNewVersionForm({ ...newVersionForm, persona_type: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="change_reason">Change Reason *</Label>
              <Textarea
                id="change_reason"
                placeholder="Why are you creating a new version?"
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creatingVersion}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
              >
                {creatingVersion ? 'Creating...' : 'Create Version'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Retire Confirmation Dialog */}
      <AlertDialog open={retireDialogOpen} onOpenChange={setRetireDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retire Query?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the query as retired and it will no longer be executed in future runs.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRetireQuery}
              disabled={retiring}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {retiring ? 'Retiring...' : 'Retire Query'}
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
                  Admin Only
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                v{latestVersion?.version || 1}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{latestVersion?.text || query.initial_text}</p>
            {query.intent_cluster_name && (
              <p className="text-xs text-muted-foreground">
                Cluster: {query.intent_cluster_name}
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
              New Version
            </Button>
            {!query.is_retired && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRetire(query.id)}
                className="text-destructive hover:text-destructive"
              >
                <Archive className="h-4 w-4 mr-1" />
                Retire
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
                View {versions.length - 1} previous version{versions.length > 2 ? 's' : ''}
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
                          Reason: {version.change_reason}
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
