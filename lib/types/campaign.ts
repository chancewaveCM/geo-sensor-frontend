export interface Campaign {
  id: number
  workspace_id: number
  name: string
  description: string | null
  status: string
  target_brand: string | null
  schedule_enabled: boolean
  schedule_interval_hours: number
  schedule_next_run_at: string | null
  created_at: string
  updated_at: string
}

export interface CampaignCreate {
  name: string
  description?: string
  status?: string
  target_brand?: string
  schedule_enabled?: boolean
  schedule_interval_hours?: number
}

export interface CampaignUpdate {
  name?: string
  description?: string
  status?: string
  target_brand?: string
  schedule_enabled?: boolean
  schedule_interval_hours?: number
}

export interface IntentCluster {
  id: number
  campaign_id: number
  name: string
  description: string | null
  order_index: number
  created_at: string
}

export interface IntentClusterCreate {
  name: string
  description?: string
  order_index?: number
}

export interface QueryDefinition {
  id: number
  campaign_id: number
  intent_cluster_id: number | null
  query_type: string // 'anchor' | 'exploration'
  current_version: number
  is_active: boolean
  is_retired: boolean
  created_by: number
  created_at: string
  updated_at: string
}

export interface QueryDefinitionCreate {
  query_type: string
  intent_cluster_id?: number
  text: string
  persona_type?: string
}

export interface QueryVersion {
  id: number
  query_definition_id: number
  version: number
  text: string
  persona_type: string | null
  change_reason: string | null
  changed_by: number
  is_current: boolean
  effective_from: string
  effective_until: string | null
  created_at: string
}

export interface QueryVersionCreate {
  text: string
  persona_type?: string
  change_reason?: string
}

export interface CampaignRun {
  id: number
  campaign_id: number
  run_number: number
  trigger_type: string
  llm_providers: string
  status: string
  total_queries: number
  completed_queries: number
  failed_queries: number
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface CampaignRunCreate {
  trigger_type?: string
  llm_providers?: string[]
}

export interface CitationShareData {
  campaign_id: number
  overall_citation_share: number
  total_citations: number
  target_brand_citations: number
  by_provider: Record<string, number>
  by_brand: Array<{ brand: string; share: number; count: number; is_target_brand?: boolean }>
}

export interface BrandRankingItem {
  rank: number
  brand: string
  citation_count: number
  citation_share: number
  is_target_brand: boolean
}

export interface BrandRankingData {
  campaign_id: number
  rankings: BrandRankingItem[]
  total_citations: number
}

export interface ProviderMetrics {
  provider: string
  total_responses: number
  avg_word_count: number
  avg_citation_count: number
  avg_latency_ms: number
  citation_share: number
}

export interface ProviderComparisonData {
  campaign_id: number
  providers: ProviderMetrics[]
}

export interface GEOScoreSummary {
  campaign_id: number
  avg_geo_score: number
  total_runs_analyzed: number
  by_provider: Record<string, number>
}

export interface CampaignSummary {
  campaign_id: number
  total_runs: number
  total_responses: number
  total_citations: number
  latest_run: CampaignRun | null
  citation_share_by_brand: Record<string, number>
}

export interface TimeseriesDataPoint {
  run_id: number
  timestamp: string
  citation_share_overall: number
  citation_share_by_provider: Record<string, number> | null
  total_citations: number
  brand_citations: number
}

export interface TimeseriesData {
  campaign_id: number
  brand_name: string
  time_series: TimeseriesDataPoint[]
  annotations: Array<Record<string, unknown>>
}
