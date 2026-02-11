// Core domain types for GEO Sensor

// Re-export workspace, campaign, gallery, and publishing types
export * from './workspace'
export * from './campaign'
export * from './gallery'
export * from './publishing'

export interface Project {
  id: string
  name: string
  brand_name: string
  competitors: string[]
  created_at: string
  updated_at: string
}

export interface Query {
  id: string
  project_id: string
  text: string
  category: string
  status: QueryStatus
  created_at: string
}

export type QueryStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'perplexity'

export interface Citation {
  brand: string
  position: number
  context: string
  sentiment: Sentiment
}

export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface CitationMetrics {
  project_id: string
  brand: string
  citation_share: number
  avg_position: number
  total_mentions: number
  sentiment_breakdown: {
    positive: number
    neutral: number
    negative: number
  }
}

export interface DashboardStats {
  total_projects: number
  total_queries: number
  avg_citation_share: number
  avg_position: number
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiError {
  detail: string
  code?: string
}
