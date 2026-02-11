import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  getCampaignRuns,
  triggerCampaignRun,
  getIntentClusters,
  createIntentCluster,
  getQueryDefinitions,
  createQueryDefinition,
  getQueryVersions,
  createQueryVersion,
  retireQuery,
  getCampaignSummary,
  getCitationShare,
  getBrandRanking,
  getProviderComparison,
  getGeoScoreSummary,
  getTimeseries,
  getBrandSafety,
} from '@/lib/api/campaigns'
import type {
  CampaignCreate,
  CampaignUpdate,
  CampaignRunCreate,
  IntentClusterCreate,
  QueryDefinitionCreate,
  QueryVersionCreate,
} from '@/types'

export function useCampaigns(workspaceId: number | undefined) {
  return useQuery({
    queryKey: ['campaigns', workspaceId],
    queryFn: () => getCampaigns(workspaceId!),
    enabled: workspaceId != null,
  })
}

export function useCampaign(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId],
    queryFn: () => getCampaign(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCreateCampaign(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CampaignCreate) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return createCampaign(workspaceId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', workspaceId] })
    },
  })
}

export function useUpdateCampaign(workspaceId: number, campaignId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CampaignUpdate) => updateCampaign(workspaceId, campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', workspaceId] })
    },
  })
}

export function useCampaignRuns(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'runs'],
    queryFn: () => getCampaignRuns(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useTriggerRun(workspaceId: number | undefined, campaignId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CampaignRunCreate) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      if (campaignId == null) throw new Error('campaignId is required')
      return triggerCampaignRun(workspaceId, campaignId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', workspaceId, campaignId, 'runs'],
      })
    },
  })
}

export function useIntentClusters(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['clusters', workspaceId, campaignId],
    queryFn: () => getIntentClusters(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCreateIntentCluster(workspaceId: number, campaignId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IntentClusterCreate) =>
      createIntentCluster(workspaceId, campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clusters', workspaceId, campaignId],
      })
    },
  })
}

export function useQueryDefinitions(
  workspaceId: number | undefined,
  campaignId: number | undefined,
  params?: { cluster_id?: number; query_type?: string; is_active?: boolean }
) {
  return useQuery({
    queryKey: ['queries', workspaceId, campaignId, params],
    queryFn: () => getQueryDefinitions(workspaceId!, campaignId!, params),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCreateQueryDefinition(workspaceId: number | undefined, campaignId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: QueryDefinitionCreate) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      if (campaignId == null) throw new Error('campaignId is required')
      return createQueryDefinition(workspaceId, campaignId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['queries', workspaceId, campaignId],
      })
    },
  })
}

export function useQueryVersions(
  workspaceId: number | undefined,
  campaignId: number | undefined,
  queryId: number | undefined
) {
  return useQuery({
    queryKey: ['queryVersions', workspaceId, campaignId, queryId],
    queryFn: () => getQueryVersions(workspaceId!, campaignId!, queryId!),
    enabled: workspaceId != null && campaignId != null && queryId != null,
  })
}

export function useCreateQueryVersion(
  workspaceId: number | undefined,
  campaignId: number | undefined,
  queryId: number | undefined
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: QueryVersionCreate) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      if (campaignId == null) throw new Error('campaignId is required')
      if (queryId == null) throw new Error('queryId is required')
      return createQueryVersion(workspaceId, campaignId, queryId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['queryVersions', workspaceId, campaignId, queryId],
      })
      queryClient.invalidateQueries({
        queryKey: ['queries', workspaceId, campaignId],
      })
    },
  })
}

export function useRetireQuery(workspaceId: number | undefined, campaignId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (queryId: number) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      if (campaignId == null) throw new Error('campaignId is required')
      return retireQuery(workspaceId, campaignId, queryId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['queries', workspaceId, campaignId],
      })
    },
  })
}

export function useCampaignSummary(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'summary'],
    queryFn: () => getCampaignSummary(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCitationShare(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'citation-share'],
    queryFn: () => getCitationShare(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useBrandRanking(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'brand-ranking'],
    queryFn: () => getBrandRanking(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useProviderComparison(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'provider-comparison'],
    queryFn: () => getProviderComparison(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useGeoScoreSummary(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'geo-score-summary'],
    queryFn: () => getGeoScoreSummary(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useTimeseries(
  workspaceId: number | undefined,
  campaignId: number | undefined,
  brandName?: string
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'timeseries', brandName],
    queryFn: () => getTimeseries(workspaceId!, campaignId!, brandName),
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useBrandSafety(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'brand-safety'],
    queryFn: () => getBrandSafety(workspaceId!, campaignId!),
    enabled: workspaceId != null && campaignId != null,
  })
}
