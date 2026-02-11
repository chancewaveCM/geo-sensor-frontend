export type OAuthPlatform = 'youtube' | 'linkedin' | 'twitter' | 'instagram'
export type RewriteStatus = 'pending' | 'approved' | 'rejected'
export type PublicationStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export interface OAuthPlatformStatus {
  platform: OAuthPlatform
  is_connected: boolean
  connected_at: string | null
  scopes: string[]
}

export interface OAuthStatusResponse {
  platforms: OAuthPlatformStatus[]
}

export interface RewriteRequest {
  original_content: string
  suggestions: string[]
  brand_voice?: string
  llm_provider?: string
  num_variants?: number
}

export interface RewriteVariant {
  id: number
  variant_number: number
  content: string
  status: RewriteStatus
  diff_summary: string
}

export interface RewriteResponse {
  id: number
  original_content: string
  variants: RewriteVariant[]
  created_at: string
}

export interface PublishRequest {
  content: string
  platform: OAuthPlatform
  scheduled_at?: string
}

export interface PublicationResponse {
  id: number
  content: string
  platform: OAuthPlatform
  status: PublicationStatus
  published_at: string | null
  external_id: string | null
  error_message: string | null
  created_at: string
}

export interface PublicationListResponse {
  publications: PublicationResponse[]
  total: number
}
