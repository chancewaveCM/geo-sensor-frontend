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

export interface BrandSafetyIncident {
  citation_id: number
  cited_brand: string
  citation_span: string
  confidence_score: number | null
  is_verified: boolean
  llm_provider: string
  created_at: string
}

export interface BrandSafetyMetrics {
  campaign_id: number
  total_citations: number
  critical_count: number
  warning_count: number
  safe_count: number
  unknown_count: number
  verified_count: number
  unverified_count: number
  recent_incidents: BrandSafetyIncident[]
}

// Intelligence Dashboard Types
export interface TimeseriesParams {
  granularity?: 'daily' | 'weekly' | 'monthly'
  dateFrom?: string
  dateTo?: string
}

export interface TrendSummary {
  direction: 'up' | 'down' | 'flat'
  change_percent: number
  change_absolute: number
}

export interface BrandTrend {
  brand_name: string
  current_share: number
  previous_share: number
  trend: TrendSummary
}

export interface TimeseriesResponse {
  campaign_id: number
  data_points: TimeseriesDataPoint[]
  trends: BrandTrend[]
}

export interface AnnotationCreate {
  date: string
  title: string
  description?: string
  annotation_type: 'manual' | 'query_change' | 'model_change'
}

export interface AnnotationResponse {
  id: number
  campaign_id: number
  date: string
  title: string
  description: string | null
  annotation_type: string
  created_by: number
  created_at: string
}

export interface CompetitiveBrandEntry {
  brand_name: string
  citation_share: number
  rank: number
  change_from_previous: number | null
  is_target_brand: boolean
}

export interface CompetitiveOverviewResponse {
  campaign_id: number
  brands: CompetitiveBrandEntry[]
  total_brands: number
  as_of_run_id: number
}

export interface CompetitiveTrendEntry {
  run_id: number
  timestamp: string
  brand_shares: Record<string, number>
}

export interface CompetitiveTrendsResponse {
  campaign_id: number
  trends: CompetitiveTrendEntry[]
}

export interface CompetitiveAlert {
  id: number
  campaign_id: number
  brand_name: string
  alert_type: string
  severity: string
  message: string
  detected_at: string
}

export interface CompetitiveAlertsResponse {
  campaign_id: number
  alerts: CompetitiveAlert[]
}

export interface CompetitiveRankingsResponse {
  campaign_id: number
  rankings: CompetitiveBrandEntry[]
}

// Schedule types
export type ScheduleInterval = 'hourly' | 'every_6h' | 'daily' | 'weekly' | 'monthly'

export interface ScheduleConfig {
  is_active: boolean
  interval: ScheduleInterval
  cron_expression?: string
  next_run_at?: string
  last_run_at?: string
}

// Notification types
export type NotificationType = 'email' | 'webhook'
export type NotificationEvent = 'run_completed' | 'threshold_crossed' | 'competitor_change' | 'error'

export interface NotificationConfig {
  id: number
  campaign_id: number
  workspace_id: number
  type: NotificationType
  destination: string
  events: NotificationEvent[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NotificationConfigCreate {
  type: NotificationType
  destination: string
  events: NotificationEvent[]
  is_active?: boolean
}

export interface NotificationLog {
  id: number
  notification_config_id: number
  event_type: string
  status: 'pending' | 'sent' | 'failed'
  error_message?: string
  sent_at?: string
  created_at: string
}

// Alert rule types
export type AlertComparison = 'above' | 'below' | 'change_exceeds'

export interface AlertRule {
  id: number
  name: string
  metric: string
  comparison: AlertComparison
  threshold: number
  is_active: boolean
}

export interface AlertRuleCreate {
  name: string
  metric: string
  comparison: AlertComparison
  threshold: number
}
