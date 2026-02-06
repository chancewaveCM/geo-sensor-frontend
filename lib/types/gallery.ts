export interface RunResponse {
  id: number
  campaign_run_id: number
  query_version_id: number
  llm_provider: string
  llm_model: string
  content: string | null
  word_count: number | null
  citation_count: number | null
  created_at: string
  query_text?: string
  run_number?: number
  campaign_name?: string
  label_count?: number
  has_flags?: boolean
}

export interface GalleryDetailResponse extends RunResponse {
  response_hash?: string
  latency_ms: number | null
  labels: ResponseLabel[]
  citations: RunCitation[]
}

export interface RunCitation {
  id: number
  cited_brand: string
  citation_span: string | null
  context_before: string | null
  context_after: string | null
  position_in_response: number
  is_target_brand: boolean
  confidence_score: number
  is_verified: boolean
}

export interface ResponseLabel {
  id: number
  run_response_id: number
  workspace_id: number
  label_type: string
  label_key: string
  label_value: string | null
  severity?: string
  created_by: number
  resolved_by: number | null
  resolved_at: string | null
  created_at: string
}

export interface ResponseLabelCreate {
  run_response_id: number
  label_type: string
  label_key: string
  label_value?: string
  severity?: string
}

export interface CitationReview {
  id: number
  run_citation_id: number
  review_type: string
  reviewer_comment: string | null
  created_by: number
  created_at: string
}

export interface CitationReviewCreate {
  run_citation_id: number
  review_type: string
  reviewer_comment?: string
}

export interface ComparisonSnapshot {
  id: number
  workspace_id: number
  name: string
  comparison_type: string
  config: string
  notes: string | null
  created_by: number
  created_at: string
  updated_at?: string
}

export interface ComparisonSnapshotCreate {
  name: string
  comparison_type: string
  config: Record<string, unknown>
  notes?: string
}

export interface OperationLog {
  id: number
  workspace_id: number
  operation_type: string
  status: string
  target_type: string | null
  target_id: number | null
  payload: string | null
  created_by: number
  reviewed_by: number | null
  review_comment: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface OperationLogCreate {
  operation_type: string
  target_type?: string
  target_id?: number
  payload?: Record<string, unknown>
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

// --- Compare response types ---

export interface LLMCompareResponse {
  comparison_type: string
  run_id: number
  query_version_id: number
  responses: RunResponse[]
  comparisons: LLMComparison[]
}

export interface LLMComparison {
  response_a: { id: number; llm_provider: string }
  response_b: { id: number; llm_provider: string }
  similarity: number
  brand_overlap: number
  shared_brands: string[]
  unique_a: string[]
  unique_b: string[]
}

export interface DateCompareResponse {
  comparison_type: string
  llm_provider: string
  response_a: DateCompareResponseItem
  response_b: DateCompareResponseItem
  diff: ComparisonDiff
}

export interface DateCompareResponseItem {
  id: number
  run_id: number
  word_count: number
  citation_count: number
  content: string
}

export interface ComparisonDiff {
  similarity: number
  brand_overlap: number
  content_changed: boolean
  shared_brands: string[]
  unique_a: string[]
  unique_b: string[]
}

export interface VersionCompareResponse {
  comparison_type: string
  llm_provider: string
  response_a: VersionCompareResponseItem
  response_b: VersionCompareResponseItem
  diff: ComparisonDiff
}

export interface VersionCompareResponseItem {
  id: number
  query_version_id: number
  word_count: number
  citation_count: number
  content: string
}

// --- Compare request param types ---

export interface LLMCompareParams {
  run_id: number
  query_version_id: number
}

export interface DateCompareParams {
  campaign_id: number
  query_version_id: number
  llm_provider: string
  run_id_a: number
  run_id_b: number
}

export interface VersionCompareParams {
  run_id: number
  llm_provider: string
  query_version_id_a: number
  query_version_id_b: number
}
