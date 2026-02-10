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

export type LLMProvider = 'gemini' | 'openai';

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
  query_set_id: number | null;
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
  llm_provider: string;
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

// === Profile Stats ===

export interface CompanyProfilePipelineStats {
  company_profile_id: number;
  company_name: string;
  total_query_sets: number;
  total_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  success_rate_30d: number;
  last_run_status: string | null;
  last_run_at: string | null;
  avg_processing_time_seconds: number | null;
  data_freshness_hours: number | null;
  health_grade: 'green' | 'yellow' | 'red';
}

export interface ProfileStatsListResponse {
  profiles: CompanyProfilePipelineStats[];
  total: number;
}

// === Enhanced QuerySet ===

export interface PipelineJobSummary {
  id: number;
  status: string;
  company_profile_id: number;
  company_name: string | null;
  query_set_id: number | null;
  query_set_name: string | null;
  llm_providers: string[];
  total_queries: number;
  completed_queries: number;
  failed_queries: number;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface QuerySetDetailJobItem {
  id: number;
  status: string;
  llm_providers: string[];
  total_queries: number;
  completed_queries: number;
  failed_queries: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface QuerySetDetail {
  id: number;
  name: string;
  description: string | null;
  category_count: number;
  queries_per_category: number;
  company_profile_id: number;
  created_at: string;
  categories: PipelineCategory[];
  last_job: QuerySetDetailJobItem | null;
  total_jobs: number;
  total_responses: number;
}

export interface QuerySetListItem {
  id: number;
  name: string;
  description: string | null;
  category_count: number;
  queries_per_category: number;
  company_profile_id: number;
  created_at: string;
  job_count: number;
  last_job_status: string | null;
  last_run_at: string | null;
  total_responses: number;
}

export interface QuerySetListResponse {
  query_sets: QuerySetListItem[];
  total: number;
}

// === QuerySet History ===

export interface QuerySetHistoryItem {
  job_id: number;
  status: string;
  completed_queries: number;
  failed_queries: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface QuerySetHistoryResponse {
  query_set_id: number;
  query_set_name: string;
  executions: QuerySetHistoryItem[];
  total_executions: number;
}

// === Category CRUD ===

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  persona_type: string;
  llm_provider: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  persona_type?: string;
}

// === Schedule Management ===

export interface ScheduleConfig {
  id: number;
  query_set_id: number;
  query_set_name: string;
  company_profile_id: number;
  company_name: string;
  interval_minutes: number;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  llm_providers: string[];
  created_at: string;
}

export interface ScheduleListResponse {
  schedules: ScheduleConfig[];
  total: number;
}

export interface CreateScheduleRequest {
  query_set_id: number;
  interval_minutes: number;
  llm_providers: string[];
}

export interface UpdateScheduleRequest {
  interval_minutes?: number;
  is_active?: boolean;
  llm_providers?: string[];
}

// === Job List ===

export interface PipelineJobListResponse {
  jobs: PipelineJobSummary[];
  total: number;
}
