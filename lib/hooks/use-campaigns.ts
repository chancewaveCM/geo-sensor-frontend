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

// Intelligence Dashboard Hooks
export function useCampaignTimeseries(
  workspaceId: number | undefined,
  campaignId: number | undefined,
  params?: { granularity?: string; dateFrom?: string; dateTo?: string }
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'timeseries-enhanced', params],
    queryFn: () => {
      // @ts-ignore - will be implemented
      return getCampaignTimeseries(workspaceId!, campaignId!, params)
    },
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCampaignTrends(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'trends'],
    queryFn: () => {
      // @ts-ignore - will be implemented
      return getCampaignTrends(workspaceId!, campaignId!)
    },
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCampaignAnnotations(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'annotations'],
    queryFn: () => {
      // @ts-ignore - will be implemented
      return getCampaignAnnotations(workspaceId!, campaignId!)
    },
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCompetitiveOverview(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'competitive-overview'],
    queryFn: () => {
      // @ts-ignore - will be implemented
      return getCompetitiveOverview(workspaceId!, campaignId!)
    },
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCompetitiveTrends(
  workspaceId: number | undefined,
  campaignId: number | undefined,
  params?: { dateFrom?: string; dateTo?: string }
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'competitive-trends', params],
    queryFn: () => {
      // @ts-ignore - will be implemented
      return getCompetitiveTrends(workspaceId!, campaignId!, params)
    },
    enabled: workspaceId != null && campaignId != null,
  })
}

export function useCompetitiveAlerts(
  workspaceId: number | undefined,
  campaignId: number | undefined
) {
  return useQuery({
    queryKey: ['campaigns', workspaceId, campaignId, 'competitive-alerts'],
    queryFn: () => {
      // @ts-ignore - will be implemented
      return getCompetitiveAlerts(workspaceId!, campaignId!)
    },
    enabled: workspaceId != null && campaignId != null,
  })
}

// Notification hooks
export function useNotificationConfigs(workspaceId: number | undefined, campaignId: number | undefined) {
  return useQuery({
    queryKey: ['notifications', workspaceId, campaignId],
    queryFn: async () => {
      if (!workspaceId || !campaignId) throw new Error('Missing IDs')
      const { getNotificationConfigs } = await import('@/lib/api/campaigns')
      return getNotificationConfigs(workspaceId, campaignId)
    },
    enabled: !!workspaceId && !!campaignId,
  })
}

export function useCreateNotification(workspaceId: number | undefined, campaignId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { type: string; destination: string; events: string[]; is_active?: boolean }) => {
      if (!workspaceId || !campaignId) throw new Error('Missing IDs')
      const { createNotificationConfig } = await import('@/lib/api/campaigns')
      return createNotificationConfig(workspaceId, campaignId, data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', workspaceId, campaignId] }),
  })
}

export function useUpdateNotification(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ notificationId, data }: { notificationId: number; data: Partial<{ type: string; destination: string; events: string[]; is_active?: boolean }> }) => {
      if (!workspaceId) throw new Error('Missing workspace ID')
      const { updateNotificationConfig } = await import('@/lib/api/campaigns')
      return updateNotificationConfig(workspaceId, notificationId, data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useDeleteNotification(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (notificationId: number) => {
      if (!workspaceId) throw new Error('Missing workspace ID')
      const { deleteNotificationConfig } = await import('@/lib/api/campaigns')
      return deleteNotificationConfig(workspaceId, notificationId)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useNotificationLogs(workspaceId: number | undefined, campaignId: number | undefined) {
  return useQuery({
    queryKey: ['notification-logs', workspaceId, campaignId],
    queryFn: async () => {
      if (!workspaceId || !campaignId) throw new Error('Missing IDs')
      const { getNotificationLogs } = await import('@/lib/api/campaigns')
      return getNotificationLogs(workspaceId, campaignId)
    },
    enabled: !!workspaceId && !!campaignId,
  })
}

export function useTestNotification(workspaceId: number | undefined, campaignId: number | undefined) {
  return useMutation({
    mutationFn: async (notificationId: number) => {
      if (!workspaceId || !campaignId) throw new Error('Missing IDs')
      const { testNotification } = await import('@/lib/api/campaigns')
      return testNotification(workspaceId, campaignId, notificationId)
    },
  })
}
