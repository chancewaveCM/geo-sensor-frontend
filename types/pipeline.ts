// types/pipeline.ts

export type PipelineStatus =
  | 'pending'
  | 'generating_categories'
  | 'expanding_queries'
  | 'executing_queries'
  | 'completed'
  | 'failed'
  | 'cancelled';

export const ACTIVE_PIPELINE_STATUSES: PipelineStatus[] = [
  'pending',
  'generating_categories',
  'expanding_queries',
  'executing_queries',
];

export interface StartPipelineRequest {
  company_profile_id: number;
  category_count: number;      // 1-20
  queries_per_category: number; // 1-20
  llm_providers: string[];     // ['gemini', 'openai']
}

export interface StartPipelineResponse {
  job_id: number;
  status: string;
  message: string;
  estimated_queries: number;
}

// Note: Backend returns this as `PipelineJobStatusResponse`
// We use `PipelineJobStatus` in frontend for brevity
export interface PipelineJobStatus {
  id: number;
  status: PipelineStatus;
  company_profile_id: number;
  query_set_id: number;
  llm_providers: string[];
  total_queries: number;
  completed_queries: number;
  failed_queries: number;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  elapsed_seconds: number | null;
  error_message: string | null;
}

export interface PipelineCategory {
  id: number;
  name: string;
  description: string | null;
  persona_type: string;
  order_index: number;
  query_count: number;
}

export interface CategoriesListResponse {
  categories: PipelineCategory[];
}

export interface ExpandedQuery {
  id: number;
  text: string;
  order_index: number;
  status: string;
  category_id: number;
  response_count: number;
}

export interface QueriesListResponse {
  queries: ExpandedQuery[];
  total: number;
}

export interface RawLLMResponse {
  id: number;
  content: string;
  llm_provider: string;
  llm_model: string;
  tokens_used: number | null;
  latency_ms: number | null;
  error_message: string | null;
  created_at: string;
}

export interface ResponsesListResponse {
  responses: RawLLMResponse[];
}

export interface PipelineConfig {
  companyProfileId: number | null;
  categoryCount: number;
  queriesPerCategory: number;
  llmProviders: string[];
}
