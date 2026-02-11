import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOAuthStatus,
  connectPlatform,
  disconnectPlatform,
  generateRewrite,
  listRewrites,
  approveVariant,
  publishContent,
  listPublications,
  retryPublication,
} from '@/lib/api/publishing'
import type { RewriteRequest, PublishRequest } from '@/types'

// OAuth hooks
export function useOAuthStatus(workspaceId: number | undefined) {
  return useQuery({
    queryKey: ['oauth-status', workspaceId],
    queryFn: () => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return getOAuthStatus(workspaceId)
    },
    enabled: workspaceId != null,
  })
}

export function useConnectPlatform(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (platform: string) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return connectPlatform(workspaceId, platform)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauth-status', workspaceId] })
    },
  })
}

export function useDisconnectPlatform(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (platform: string) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return disconnectPlatform(workspaceId, platform)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauth-status', workspaceId] })
    },
  })
}

// Rewrite hooks
export function useRewrites(workspaceId: number | undefined) {
  return useQuery({
    queryKey: ['rewrites', workspaceId],
    queryFn: () => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return listRewrites(workspaceId)
    },
    enabled: workspaceId != null,
  })
}

export function useGenerateRewrite(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: RewriteRequest) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return generateRewrite(workspaceId, request)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewrites', workspaceId] })
    },
  })
}

export function useApproveVariant(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      rewriteId,
      variantId,
      status,
    }: {
      rewriteId: number
      variantId: number
      status: 'approved' | 'rejected'
    }) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return approveVariant(workspaceId, rewriteId, variantId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewrites', workspaceId] })
    },
  })
}

// Publishing hooks
export function usePublications(workspaceId: number | undefined) {
  return useQuery({
    queryKey: ['publications', workspaceId],
    queryFn: () => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return listPublications(workspaceId)
    },
    enabled: workspaceId != null,
  })
}

export function usePublishContent(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: PublishRequest) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return publishContent(workspaceId, request)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications', workspaceId] })
    },
  })
}

export function useRetryPublication(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicationId: number) => {
      if (workspaceId == null) throw new Error('workspaceId is required')
      return retryPublication(workspaceId, publicationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications', workspaceId] })
    },
  })
}
