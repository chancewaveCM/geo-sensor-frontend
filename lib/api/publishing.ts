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
  return post<{ auth_url: string }>(`${API_PREFIX}/workspaces/${workspaceId}/oauth/connect`, { platform })
}

export async function disconnectPlatform(workspaceId: number, platform: string): Promise<{ message: string }> {
  return apiClient.delete(`${API_PREFIX}/workspaces/${workspaceId}/oauth/disconnect`, { data: { platform } })
    .then(res => res.data)
}

// Rewrite APIs
export async function generateRewrite(workspaceId: number, request: RewriteRequest): Promise<RewriteResponse> {
  return post<RewriteResponse>(`${API_PREFIX}/workspaces/${workspaceId}/content/rewrite`, request)
}

export async function listRewrites(workspaceId: number): Promise<RewriteResponse[]> {
  return get<RewriteResponse[]>(`${API_PREFIX}/workspaces/${workspaceId}/content/rewrites`)
}

export async function approveVariant(
  workspaceId: number,
  rewriteId: number,
  variantId: number,
  status: 'approved' | 'rejected'
): Promise<RewriteVariant> {
  return post<RewriteVariant>(
    `${API_PREFIX}/workspaces/${workspaceId}/content/rewrites/${rewriteId}/variants/${variantId}/approve`,
    { status }
  )
}

// Publishing APIs
export async function publishContent(workspaceId: number, request: PublishRequest): Promise<PublicationResponse> {
  return post<PublicationResponse>(`${API_PREFIX}/workspaces/${workspaceId}/publishing/publish`, request)
}

export async function listPublications(workspaceId: number): Promise<PublicationResponse[]> {
  return get<PublicationResponse[]>(`${API_PREFIX}/workspaces/${workspaceId}/publishing/publications`)
}

export async function retryPublication(workspaceId: number, publicationId: number): Promise<PublicationResponse> {
  return post<PublicationResponse>(`${API_PREFIX}/workspaces/${workspaceId}/publishing/publications/${publicationId}/retry`)
}
