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
