import { get, post, put } from '@/lib/api-client'
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
} from '@/lib/types'

const API_PREFIX = '/api/v1'

export async function fetchCampaigns(workspaceId: number): Promise<Campaign[]> {
  return get<Campaign[]>(`${API_PREFIX}/workspaces/${workspaceId}/campaigns`)
}

export async function fetchCampaign(
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

export async function fetchCampaignRuns(
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

export async function fetchIntentClusters(
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

export async function fetchQueryDefinitions(
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

export async function fetchQueryVersions(
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
