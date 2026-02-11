import { get, post, apiClient } from '@/lib/api-client'
import type {
  OAuthStatusResponse,
  RewriteRequest,
  RewriteResponse,
  RewriteVariant,
  PublishRequest,
  PublicationResponse,
} from '@/types'

const API_PREFIX = '/api/v1'

// OAuth APIs
export async function getOAuthStatus(workspaceId: number): Promise<OAuthStatusResponse> {
  return get<OAuthStatusResponse>(`${API_PREFIX}/workspaces/${workspaceId}/oauth/status`)
}

export async function connectPlatform(workspaceId: number, platform: string): Promise<{ auth_url: string }> {
  const redirectUri = encodeURIComponent(`${window.location.origin}/settings/social/callback`)
  return post<{ auth_url: string }>(`${API_PREFIX}/workspaces/${workspaceId}/oauth/${platform}/connect?redirect_uri=${redirectUri}`, {})
}

export async function disconnectPlatform(workspaceId: number, platform: string): Promise<void> {
  return apiClient.delete(`${API_PREFIX}/workspaces/${workspaceId}/oauth/${platform}/revoke`)
    .then(() => undefined)
}

// Rewrite APIs
export async function generateRewrite(workspaceId: number, request: RewriteRequest): Promise<RewriteResponse> {
  return post<RewriteResponse>(`${API_PREFIX}/workspaces/${workspaceId}/content/rewrite`, request)
}

export interface RewriteListResponse {
  rewrites: RewriteResponse[]
  total: number
}

export async function listRewrites(workspaceId: number): Promise<RewriteListResponse> {
  return get<RewriteListResponse>(`${API_PREFIX}/workspaces/${workspaceId}/content/rewrites`)
}

export async function approveVariant(
  workspaceId: number,
  rewriteId: number,
  variantId: number,
  status: 'approved' | 'rejected'
): Promise<RewriteVariant> {
  return apiClient.patch<RewriteVariant>(
    `${API_PREFIX}/workspaces/${workspaceId}/content/rewrites/${rewriteId}/variants/${variantId}`,
    { status }
  ).then(res => res.data)
}

// Publishing APIs
export interface PublicationListResponse {
  publications: PublicationResponse[]
  total: number
}

export async function publishContent(workspaceId: number, request: PublishRequest): Promise<PublicationResponse> {
  return post<PublicationResponse>(`${API_PREFIX}/workspaces/${workspaceId}/publish`, request)
}

export async function listPublications(workspaceId: number): Promise<PublicationListResponse> {
  return get<PublicationListResponse>(`${API_PREFIX}/workspaces/${workspaceId}/publications`)
}

export async function retryPublication(workspaceId: number, publicationId: number): Promise<PublicationResponse> {
  return post<PublicationResponse>(`${API_PREFIX}/workspaces/${workspaceId}/publications/${publicationId}/retry`)
}
