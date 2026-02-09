'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock3,
  FolderTree,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import {
  useAllQuerySets,
  useCompanyQuerySets,
  useCreateCategory,
  useCreateSchedule,
  useDeleteCategory,
  useDeleteSchedule,
  useProfilePipelineStats,
  useQuerySetDetail,
  useSchedules,
  useUpdateCategory,
  useUpdateSchedule,
} from '@/lib/hooks/use-pipeline'
import type { CompanyProfilePipelineStats, ScheduleConfig } from '@/types/pipeline'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'outline'

function parsePositiveInt(value: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ko-KR')
}

function statusLabel(status: string | null): string {
  if (!status) return 'No runs'
  return status.replaceAll('_', ' ')
}

function statusVariant(status: string | null): BadgeVariant {
  if (!status) return 'outline'
  if (status === 'completed') return 'success'
  if (status === 'failed' || status === 'cancelled') return 'destructive'
  if (status === 'pending') return 'secondary'
  return 'default'
}

function healthVariant(grade: CompanyProfilePipelineStats['health_grade']): BadgeVariant {
  if (grade === 'green') return 'success'
  if (grade === 'yellow') return 'secondary'
  return 'destructive'
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  )
}

function providersFromFlags(gemini: boolean, openai: boolean): string[] {
  const providers: string[] = []
  if (gemini) providers.push('gemini')
  if (openai) providers.push('openai')
  return providers
}

function PipelinePageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCompanyId = useMemo(() => parsePositiveInt(searchParams.get('company')), [searchParams])
  const selectedQuerySetId = useMemo(() => parsePositiveInt(searchParams.get('querySet')), [searchParams])

  const profileStatsQuery = useProfilePipelineStats()
  const querySetsQuery = useCompanyQuerySets(selectedCompanyId ?? undefined)
  const querySetDetailQuery = useQuerySetDetail(selectedQuerySetId ?? undefined)
  const allQuerySetsQuery = useAllQuerySets()

  const profiles = profileStatsQuery.data?.profiles ?? []
  const querySets = querySetsQuery.data?.query_sets ?? []
  const selectedCompany = profiles.find((profile) => profile.company_profile_id === selectedCompanyId) ?? null

  const createCategoryMutation = useCreateCategory(selectedQuerySetId ?? undefined)
  const updateCategoryMutation = useUpdateCategory(selectedQuerySetId ?? undefined)
  const deleteCategoryMutation = useDeleteCategory(selectedQuerySetId ?? undefined)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [newCategoryPersona, setNewCategoryPersona] = useState('consumer')
  const [newCategoryProvider, setNewCategoryProvider] = useState('gemini')
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryDescription, setEditingCategoryDescription] = useState('')
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const [scheduleCompanyFilter, setScheduleCompanyFilter] = useState<number | null>(null)
  const [scheduleQuerySetFilter, setScheduleQuerySetFilter] = useState<number | null>(null)
  const [createScheduleQuerySetId, setCreateScheduleQuerySetId] = useState<number | null>(null)
  const [createIntervalMinutes, setCreateIntervalMinutes] = useState('1440')
  const [createGemini, setCreateGemini] = useState(true)
  const [createOpenai, setCreateOpenai] = useState(true)
  const [scheduleError, setScheduleError] = useState<string | null>(null)

  const scheduleQuerySetOptionsQuery = useCompanyQuerySets(scheduleCompanyFilter ?? undefined)
  const scheduleQuerySetOptions = scheduleCompanyFilter == null
    ? (allQuerySetsQuery.data?.query_sets ?? [])
    : (scheduleQuerySetOptionsQuery.data?.query_sets ?? [])

  const schedulesQuery = useSchedules({
    querySetId: scheduleQuerySetFilter ?? undefined,
    companyProfileId: scheduleCompanyFilter ?? undefined,
  })
  const createScheduleMutation = useCreateSchedule()
  const updateScheduleMutation = useUpdateSchedule()
  const deleteScheduleMutation = useDeleteSchedule()

  const replaceSelection = useCallback((companyId: number | null, querySetId: number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (companyId == null) params.delete('company')
    else params.set('company', String(companyId))
    if (querySetId == null) params.delete('querySet')
    else params.set('querySet', String(querySetId))
    const query = params.toString()
    router.replace((query ? `${pathname}?${query}` : pathname) as any, { scroll: false })
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (!profileStatsQuery.data) return
    if (selectedCompanyId != null && !selectedCompany) replaceSelection(null, null)
    if (selectedCompanyId == null && selectedQuerySetId != null) replaceSelection(null, null)
  }, [profileStatsQuery.data, replaceSelection, selectedCompany, selectedCompanyId, selectedQuerySetId])

  useEffect(() => {
    if (!querySetsQuery.isFetched || selectedQuerySetId == null) return
    if (!querySets.some((querySet) => querySet.id === selectedQuerySetId)) {
      replaceSelection(selectedCompanyId, null)
    }
  }, [querySets, querySetsQuery.isFetched, replaceSelection, selectedCompanyId, selectedQuerySetId])

  useEffect(() => {
    if (selectedCompanyId != null && scheduleCompanyFilter == null) {
      setScheduleCompanyFilter(selectedCompanyId)
    }
  }, [scheduleCompanyFilter, selectedCompanyId])

  const metrics = useMemo(() => {
    const totalProfiles = profiles.length
    const totalQuerySets = profiles.reduce((sum, profile) => sum + profile.total_query_sets, 0)
    const totalJobs = profiles.reduce((sum, profile) => sum + profile.total_jobs, 0)
    const avgSuccessRate = totalProfiles === 0
      ? 0
      : Number((profiles.reduce((sum, profile) => sum + profile.success_rate_30d, 0) / totalProfiles).toFixed(1))
    return { totalProfiles, totalQuerySets, totalJobs, avgSuccessRate }
  }, [profiles])

  const handleCreateCategory = async () => {
    if (selectedQuerySetId == null) return
    if (!newCategoryName.trim()) {
      setCategoryError('Category name is required.')
      return
    }
    setCategoryError(null)
    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
        persona_type: newCategoryPersona,
        llm_provider: newCategoryProvider,
      })
      setNewCategoryName('')
      setNewCategoryDescription('')
      setNewCategoryPersona('consumer')
      setNewCategoryProvider('gemini')
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Failed to create category.')
    }
  }

  const handleCreateSchedule = async () => {
    if (createScheduleQuerySetId == null) {
      setScheduleError('Select a QuerySet.')
      return
    }
    const interval = Number(createIntervalMinutes)
    if (!Number.isInteger(interval) || interval < 60 || interval > 43200) {
      setScheduleError('Interval must be 60..43200 minutes.')
      return
    }
    const providers = providersFromFlags(createGemini, createOpenai)
    if (providers.length === 0) {
      setScheduleError('Select at least one provider.')
      return
    }
    setScheduleError(null)
    try {
      await createScheduleMutation.mutateAsync({
        query_set_id: createScheduleQuerySetId,
        interval_minutes: interval,
        llm_providers: providers,
      })
      setCreateIntervalMinutes('1440')
    } catch (error) {
      setScheduleError(error instanceof Error ? error.message : 'Failed to create schedule.')
    }
  }

  const handleUpdateSchedule = async (schedule: ScheduleConfig, intervalMinutes: string) => {
    const interval = Number(intervalMinutes)
    if (!Number.isInteger(interval) || interval < 60 || interval > 43200) {
      setScheduleError('Interval must be 60..43200 minutes.')
      return
    }
    setScheduleError(null)
    await updateScheduleMutation.mutateAsync({
      id: schedule.id,
      data: { interval_minutes: interval },
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FolderTree className="h-5 w-5 text-primary" />
            Pipeline Control Center
          </CardTitle>
          <CardDescription>Hierarchy navigation, category CRUD, KPI summary, and schedule controls.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Profiles</p><p className="mt-1 text-2xl font-semibold">{metrics.totalProfiles}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">QuerySets</p><p className="mt-1 text-2xl font-semibold">{metrics.totalQuerySets}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Jobs</p><p className="mt-1 text-2xl font-semibold">{metrics.totalJobs}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Success Rate (30d)</p><p className="mt-1 text-2xl font-semibold">{metrics.avgSuccessRate}%</p></CardContent></Card>
      </div>

      <Tabs defaultValue="hierarchy">
        <TabsList>
          <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Company Profiles</CardTitle>
                <CardDescription>Select company and QuerySet.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {profileStatsQuery.isLoading && <LoadingRows />}
                {profileStatsQuery.isError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Failed to load profile stats</AlertTitle>
                    <AlertDescription><Button size="sm" variant="outline" onClick={() => void profileStatsQuery.refetch()}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button></AlertDescription>
                  </Alert>
                )}
                {profiles.map((profile) => {
                  const expanded = selectedCompanyId === profile.company_profile_id
                  return (
                    <div key={profile.company_profile_id} className="rounded-md border">
                      <button
                        type="button"
                        className={cn('flex w-full items-center justify-between px-3 py-3 text-left', expanded ? 'bg-primary/5' : 'hover:bg-muted/40')}
                        onClick={() => replaceSelection(expanded ? null : profile.company_profile_id, null)}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{profile.company_name}</p>
                          <p className="text-xs text-muted-foreground">QuerySets {profile.total_query_sets} - Jobs {profile.total_jobs}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={healthVariant(profile.health_grade)}>{profile.health_grade}</Badge>
                          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                      </button>
                      {expanded && (
                        <div className="space-y-2 border-t px-3 py-3">
                          <p className="text-xs text-muted-foreground">Last run {formatDateTime(profile.last_run_at)} - Success {profile.success_rate_30d}%</p>
                          {querySetsQuery.isLoading && <LoadingRows />}
                          {!querySetsQuery.isLoading && querySets.map((querySet) => (
                            <button
                              type="button"
                              key={querySet.id}
                              className={cn('w-full rounded-md border px-3 py-2 text-left', selectedQuerySetId === querySet.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/40')}
                              onClick={() => replaceSelection(profile.company_profile_id, querySet.id)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">{querySet.name}</p>
                                  <p className="text-xs text-muted-foreground">Jobs {querySet.job_count} - Responses {querySet.total_responses}</p>
                                </div>
                                <Badge variant={statusVariant(querySet.last_job_status)}>{statusLabel(querySet.last_job_status)}</Badge>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">QuerySet Detail</CardTitle>
                    <CardDescription>{selectedQuerySetId == null ? 'Select a QuerySet from left.' : `QuerySet #${selectedQuerySetId}`}</CardDescription>
                  </div>
                  {querySetDetailQuery.isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  {selectedQuerySetId == null && <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">Select company and QuerySet to view details.</div>}
                  {selectedQuerySetId != null && querySetDetailQuery.isLoading && <LoadingRows />}
                  {selectedQuerySetId != null && querySetDetailQuery.data && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold">{querySetDetailQuery.data.name}</h2>
                          <p className="text-sm text-muted-foreground">{querySetDetailQuery.data.description || 'No description'}</p>
                        </div>
                        <Badge variant="outline">Created {formatDateTime(querySetDetailQuery.data.created_at)}</Badge>
                      </div>
                      <div className="grid gap-3 md:grid-cols-4">
                        <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Categories</p><p className="text-xl font-semibold">{querySetDetailQuery.data.category_count}</p></CardContent></Card>
                        <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Queries/Category</p><p className="text-xl font-semibold">{querySetDetailQuery.data.queries_per_category}</p></CardContent></Card>
                        <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Total Jobs</p><p className="text-xl font-semibold">{querySetDetailQuery.data.total_jobs}</p></CardContent></Card>
                        <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Responses</p><p className="text-xl font-semibold">{querySetDetailQuery.data.total_responses}</p></CardContent></Card>
                      </div>
                      <p className="text-sm text-muted-foreground">Last job: {statusLabel(querySetDetailQuery.data.last_job?.status ?? null)} ({formatDateTime(querySetDetailQuery.data.last_job?.started_at ?? null)})</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedQuerySetId != null && querySetDetailQuery.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Category CRUD</CardTitle>
                    <CardDescription>Create, edit, and delete categories.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryError && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Category error</AlertTitle><AlertDescription>{categoryError}</AlertDescription></Alert>}
                    <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
                      <div className="space-y-2"><Label>Name</Label><Input value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} /></div>
                      <div className="space-y-2"><Label>Persona</Label><Select value={newCategoryPersona} onValueChange={setNewCategoryPersona}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="consumer">consumer</SelectItem><SelectItem value="investor">investor</SelectItem></SelectContent></Select></div>
                      <div className="space-y-2"><Label>Provider</Label><Select value={newCategoryProvider} onValueChange={setNewCategoryProvider}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gemini">gemini</SelectItem><SelectItem value="openai">openai</SelectItem></SelectContent></Select></div>
                      <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={newCategoryDescription} onChange={(event) => setNewCategoryDescription(event.target.value)} /></div>
                      <div><Button type="button" onClick={() => void handleCreateCategory()} disabled={createCategoryMutation.isPending}>{createCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Category</Button></div>
                    </div>

                    <div className="space-y-2">
                      {querySetDetailQuery.data.categories.map((category) => {
                        const editing = editingCategoryId === category.id
                        return (
                          <div key={category.id} className="rounded-md border p-3">
                            {!editing ? (
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">{category.name}</p>
                                  <p className="text-xs text-muted-foreground">{category.description || 'No description'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button type="button" size="sm" variant="outline" onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); setEditingCategoryDescription(category.description || '') }}>Edit</Button>
                                  <Button type="button" size="sm" variant="destructive" onClick={() => void deleteCategoryMutation.mutateAsync(category.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Input value={editingCategoryName} onChange={(event) => setEditingCategoryName(event.target.value)} />
                                <Textarea value={editingCategoryDescription} onChange={(event) => setEditingCategoryDescription(event.target.value)} />
                                <div className="flex items-center gap-2">
                                  <Button type="button" size="sm" onClick={() => void updateCategoryMutation.mutateAsync({ categoryId: category.id, data: { name: editingCategoryName.trim(), description: editingCategoryDescription.trim() || undefined } }).then(() => setEditingCategoryId(null))}>Save</Button>
                                  <Button type="button" size="sm" variant="outline" onClick={() => setEditingCategoryId(null)}>Cancel</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule Filters</CardTitle>
              <CardDescription>Filter by company and QuerySet.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Company</Label>
                <Select value={scheduleCompanyFilter == null ? 'all' : String(scheduleCompanyFilter)} onValueChange={(value) => { setScheduleCompanyFilter(value === 'all' ? null : Number(value)); setScheduleQuerySetFilter(null) }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All companies</SelectItem>{profiles.map((profile) => <SelectItem key={profile.company_profile_id} value={String(profile.company_profile_id)}>{profile.company_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>QuerySet</Label>
                <Select value={scheduleQuerySetFilter == null ? 'all' : String(scheduleQuerySetFilter)} onValueChange={(value) => setScheduleQuerySetFilter(value === 'all' ? null : Number(value))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All QuerySets</SelectItem>{scheduleQuerySetOptions.map((querySet) => <SelectItem key={querySet.id} value={String(querySet.id)}>{querySet.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end"><Button type="button" variant="outline" onClick={() => void schedulesQuery.refetch()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduleError && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Schedule error</AlertTitle><AlertDescription>{scheduleError}</AlertDescription></Alert>}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>QuerySet</Label>
                  <Select value={createScheduleQuerySetId == null ? 'none' : String(createScheduleQuerySetId)} onValueChange={(value) => setCreateScheduleQuerySetId(value === 'none' ? null : Number(value))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="none">Select QuerySet</SelectItem>{scheduleQuerySetOptions.map((querySet) => <SelectItem key={querySet.id} value={String(querySet.id)}>{querySet.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Interval (minutes)</Label><Input type="number" min={60} max={43200} value={createIntervalMinutes} onChange={(event) => setCreateIntervalMinutes(event.target.value)} /></div>
              </div>
              <div className="flex items-center gap-4">
                <Label className="flex items-center gap-2"><input type="checkbox" checked={createGemini} onChange={(event) => setCreateGemini(event.target.checked)} />gemini</Label>
                <Label className="flex items-center gap-2"><input type="checkbox" checked={createOpenai} onChange={(event) => setCreateOpenai(event.target.checked)} />openai</Label>
              </div>
              <Button type="button" onClick={() => void handleCreateSchedule()} disabled={createScheduleMutation.isPending}>{createScheduleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Schedule</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule List</CardTitle>
              <CardDescription>Update interval, toggle active state, or delete.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedulesQuery.isLoading && <LoadingRows />}
              {schedulesQuery.data?.schedules.map((schedule) => (
                <ScheduleRow
                  key={schedule.id}
                  schedule={schedule}
                  onUpdate={handleUpdateSchedule}
                  onToggle={(checked) => updateScheduleMutation.mutate({ id: schedule.id, data: { is_active: checked } })}
                  onDelete={() => void deleteScheduleMutation.mutateAsync(schedule.id)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="flex items-center gap-2 p-4 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
          Phase 4 and 5 UI implementation is active. Next step is full integration validation.
        </CardContent>
      </Card>
    </div>
  )
}

function PipelinePageFallback() {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Pipeline Control Center</CardTitle>
          <CardDescription>Loading pipeline page...</CardDescription>
        </CardHeader>
      </Card>
      <LoadingRows />
      <LoadingRows />
    </div>
  )
}

export default function PipelinePage() {
  return (
    <Suspense fallback={<PipelinePageFallback />}>
      <PipelinePageContent />
    </Suspense>
  )
}

function ScheduleRow({
  schedule,
  onUpdate,
  onToggle,
  onDelete,
}: {
  schedule: ScheduleConfig
  onUpdate: (schedule: ScheduleConfig, intervalMinutes: string) => Promise<void>
  onToggle: (checked: boolean) => void
  onDelete: () => void
}) {
  const [interval, setInterval] = useState(String(schedule.interval_minutes))

  useEffect(() => {
    setInterval(String(schedule.interval_minutes))
  }, [schedule.interval_minutes])

  return (
    <div className="rounded-md border p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{schedule.query_set_name}</p>
          <p className="text-xs text-muted-foreground">
            {schedule.company_name} - Last {formatDateTime(schedule.last_run_at)} - Next {formatDateTime(schedule.next_run_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Active</span>
            <Switch checked={schedule.is_active} onCheckedChange={onToggle} />
          </div>
          <Button type="button" size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor={`schedule-interval-${schedule.id}`}>Interval (minutes)</Label>
          <Input
            id={`schedule-interval-${schedule.id}`}
            type="number"
            min={60}
            max={43200}
            value={interval}
            onChange={(event) => setInterval(event.target.value)}
          />
        </div>
        <Button type="button" variant="outline" onClick={() => void onUpdate(schedule, interval)}>
          Save Interval
        </Button>
      </div>
    </div>
  )
}
