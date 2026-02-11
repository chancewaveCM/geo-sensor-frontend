import { get, post, put, apiClient } from '@/lib/api-client'
import type {
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  CampaignRun,
  CampaignRunCreate,
  IntentCluster,
  IntentClusterCreate,
  QueryDefinition,
  QueryDefinitionCreate,
  QueryVersion,
  QueryVersionCreate,
  CitationShareData,
  BrandRankingData,
  ProviderComparisonData,
  GEOScoreSummary,
  CampaignSummary,
  TimeseriesData,
  BrandSafetyMetrics,
} from '@/types'

const API_PREFIX = '/api/v1'

export async function getCampaigns(workspaceId: number): Promise<Campaign[]> {
  return get<Campaign[]>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns`)
}

export async function getCampaign(
  workspaceId: number,
  campaignId: number
): Promise<Campaign> {
  return get<Campaign>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}`)
}

export async function createCampaign(
  workspaceId: number,
  data: CampaignCreate
): Promise<Campaign> {
  return post<Campaign>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns`, data)
}

export async function updateCampaign(
  workspaceId: number,
  campaignId: number,
  data: CampaignUpdate
): Promise<Campaign> {
  return put<Campaign>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}`,
    data
  )
}

export async function getCampaignRuns(
  workspaceId: number,
  campaignId: number
): Promise<CampaignRun[]> {
  return get<CampaignRun[]>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/runs`
  )
}

export async function triggerCampaignRun(
  workspaceId: number,
  campaignId: number,
  data: CampaignRunCreate
): Promise<CampaignRun> {
  return post<CampaignRun>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/run`,
    data
  )
}

export async function getIntentClusters(
  workspaceId: number,
  campaignId: number
): Promise<IntentCluster[]> {
  return get<IntentCluster[]>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/clusters`
  )
}

export async function createIntentCluster(
  workspaceId: number,
  campaignId: number,
  data: IntentClusterCreate
): Promise<IntentCluster> {
  return post<IntentCluster>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/clusters`,
    data
  )
}

export async function getQueryDefinitions(
  workspaceId: number,
  campaignId: number,
  params?: { cluster_id?: number; query_type?: string; is_active?: boolean }
): Promise<QueryDefinition[]> {
  const searchParams = new URLSearchParams()
  if (params?.cluster_id != null) searchParams.set('cluster_id', String(params.cluster_id))
  if (params?.query_type) searchParams.set('query_type', params.query_type)
  if (params?.is_active != null) searchParams.set('is_active', String(params.is_active))
  const qs = searchParams.toString()
  return get<QueryDefinition[]>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/queries${qs ? `?${qs}` : ''}`
  )
}

export async function createQueryDefinition(
  workspaceId: number,
  campaignId: number,
  data: QueryDefinitionCreate
): Promise<QueryDefinition> {
  return post<QueryDefinition>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/queries`,
    data
  )
}

export async function getQueryVersions(
  workspaceId: number,
  campaignId: number,
  queryId: number
): Promise<QueryVersion[]> {
  return get<QueryVersion[]>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/queries/${queryId}/versions`
  )
}

export async function createQueryVersion(
  workspaceId: number,
  campaignId: number,
  queryId: number,
  data: QueryVersionCreate
): Promise<QueryVersion> {
  return post<QueryVersion>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/queries/${queryId}/new-version`,
    data
  )
}

export async function retireQuery(
  workspaceId: number,
  campaignId: number,
  queryId: number
): Promise<QueryDefinition> {
  return post<QueryDefinition>(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/queries/${queryId}/retire`
  )
}

export async function getCampaignSummary(workspaceId: number, campaignId: number): Promise<CampaignSummary> {
  return get<CampaignSummary>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/summary`)
}

export async function getCitationShare(workspaceId: number, campaignId: number): Promise<CitationShareData> {
  return get<CitationShareData>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/citation-share`)
}

export async function getBrandRanking(workspaceId: number, campaignId: number): Promise<BrandRankingData> {
  return get<BrandRankingData>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/brand-ranking`)
}

export async function getProviderComparison(workspaceId: number, campaignId: number): Promise<ProviderComparisonData> {
  return get<ProviderComparisonData>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/provider-comparison`)
}

export async function getGeoScoreSummary(workspaceId: number, campaignId: number): Promise<GEOScoreSummary> {
  return get<GEOScoreSummary>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/geo-score-summary`)
}

export async function getTimeseries(workspaceId: number, campaignId: number, brandName?: string): Promise<TimeseriesData> {
  const params = brandName ? `?brand_name=${encodeURIComponent(brandName)}` : ''
  return get<TimeseriesData>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/timeseries${params}`)
}

export async function exportCampaignCSV(workspaceId: number, campaignId: number): Promise<Blob> {
  const response = await apiClient.get(
    `${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/export/csv`,
    { responseType: 'blob' }
  )
  return response.data
}

export async function getBrandSafety(workspaceId: number, campaignId: number): Promise<BrandSafetyMetrics> {
  return get<BrandSafetyMetrics>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/brand-safety`)
}

// Intelligence Dashboard APIs
export async function getCampaignTimeseries(
  workspaceId: number,
  campaignId: number,
  params?: { granularity?: string; dateFrom?: string; dateTo?: string }
) {
  const searchParams = new URLSearchParams()
  if (params?.granularity) searchParams.set('granularity', params.granularity)
  if (params?.dateFrom) searchParams.set('date_from', params.dateFrom)
  if (params?.dateTo) searchParams.set('date_to', params.dateTo)
  const qs = searchParams.toString()
  return get(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/timeseries${qs ? `?${qs}` : ''}`)
}

export async function getCampaignTrends(workspaceId: number, campaignId: number) {
  return get(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/trends`)
}

export async function getCampaignAnnotations(workspaceId: number, campaignId: number) {
  return get(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/annotations`)
}

export async function createCampaignAnnotation(
  workspaceId: number,
  campaignId: number,
  data: { date: string; title: string; description?: string; annotation_type: string }
) {
  return post(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/annotations`, data)
}

export async function deleteCampaignAnnotation(
  workspaceId: number,
  campaignId: number,
  annotationId: number
) {
  return apiClient.delete(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/annotations/${annotationId}`)
}

export async function getCompetitiveOverview(workspaceId: number, campaignId: number) {
  return get(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/competitive/overview`)
}

export async function getCompetitiveTrends(
  workspaceId: number,
  campaignId: number,
  params?: { dateFrom?: string; dateTo?: string }
) {
  const searchParams = new URLSearchParams()
  if (params?.dateFrom) searchParams.set('date_from', params.dateFrom)
  if (params?.dateTo) searchParams.set('date_to', params.dateTo)
  const qs = searchParams.toString()
  return get(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/competitive/trends${qs ? `?${qs}` : ''}`)
}

export async function getCompetitiveAlerts(workspaceId: number, campaignId: number) {
  return get(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/competitive/alerts`)
}

export async function getCompetitiveRankings(workspaceId: number, campaignId: number) {
  return get(`${API_PREFIX}/workspaces/${workspaceId}/campaigns/${campaignId}/competitive/rankings`)
}
