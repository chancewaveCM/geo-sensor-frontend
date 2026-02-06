export interface RunResponse {
  id: number
  campaign_run_id: number
  query_definition_id: number
  query_version_id: number
  llm_provider: string
  model_name: string
  response_text: string
  response_time_ms: number | null
  token_count: number | null
  citation_count: number
  word_count: number
  created_at: string
}

export interface RunCitation {
  id: number
  run_response_id: number
  brand_name: string
  domain: string | null
  url: string | null
  context_snippet: string | null
  position: number
  confidence_score: number
  is_verified: boolean
  created_at: string
}

export interface ResponseLabel {
  id: number
  run_response_id: number
  workspace_id: number
  label_type: string
  label_value: string
  notes: string | null
  created_by: number
  resolved_by: number | null
  resolved_at: string | null
  created_at: string
}

export interface ResponseLabelCreate {
  run_response_id: number
  label_type: string
  label_value: string
  notes?: string
}

export interface CitationReview {
  id: number
  run_citation_id: number
  workspace_id: number
  review_type: string // 'false_positive' | 'false_negative' | 'confirmed'
  notes: string | null
  reviewed_by: number
  created_at: string
}

export interface CitationReviewCreate {
  run_citation_id: number
  review_type: string
  notes?: string
}

export interface ComparisonSnapshot {
  id: number
  workspace_id: number
  name: string
  comparison_type: string
  config: string
  result_summary: string
  created_by: number
  created_at: string
}

export interface ComparisonSnapshotCreate {
  name: string
  comparison_type: string
  config: string
  result_summary: string
}

export interface OperationLog {
  id: number
  workspace_id: number
  operation_type: string
  target_type: string
  target_id: number
  description: string
  status: string
  review_comment: string | null
  created_by: number
  reviewed_by: number | null
  created_at: string
  updated_at: string
}

export interface OperationLogCreate {
  operation_type: string
  target_type: string
  target_id: number
  description: string
}

export interface GalleryFilters {
  campaign_id?: number
  run_id?: number
  llm_provider?: string
  query_type?: string
  cluster_id?: number
  page?: number
  page_size?: number
}
