import { del, get, post } from '@/lib/api-client'
import {
  getJobCategories,
  getJobQueries,
  getQueryResponses,
  rerunQuerySet,
} from '@/lib/api/pipeline'
import type {
  PipelineJobListResponse,
  PipelineJobStatus,
  PipelineJobSummary,
  StartPipelineResponse,
} from '@/types/pipeline'
import type { QuickAnalysisConfig, AdvancedAnalysisConfig } from '@/types/unified-analysis'
import type { CompanyProfile } from '@/types/analysis'

const API_PREFIX = '/api/v1'
const UNIFIED_ANALYSIS_PREFIX = `${API_PREFIX}/unified-analysis`

interface StartAnalysisRequest {
  company_profile_id: number
  mode: 'quick' | 'advanced'
  llm_providers: string[]
  category_count?: number
  queries_per_category?: number
}

interface StartAnalysisResponse {
  job_id: number
  mode: 'quick' | 'advanced'
  status: string
  message: string
  estimated_queries: number
}

interface UnifiedAnalysisJob {
  id: number
  mode: 'quick' | 'advanced'
  status: string
  company_profile_id: number
  company_name: string | null
  query_set_id: number | null
  query_set_name: string | null
  llm_providers: string[]
  total_queries: number
  completed_queries: number
  failed_queries: number
  progress_percentage: number
  started_at: string | null
  completed_at: string | null
  created_at: string
  error_message: string | null
}

interface UnifiedAnalysisJobListResponse {
  jobs: UnifiedAnalysisJob[]
  total: number
}

interface DeleteAnalysisResponse {
  job_id: number
  status: string
  message: string
}

function calculateElapsedSeconds(
  startedAt: string | null,
  completedAt: string | null
): number | null {
  if (!startedAt) return null
  const startMs = Date.parse(startedAt)
  if (Number.isNaN(startMs)) return null
  const endMs = completedAt ? Date.parse(completedAt) : Date.now()
  if (Number.isNaN(endMs) || endMs < startMs) return null
  return Math.round(((endMs - startMs) / 1000) * 10) / 10
}

function mapUnifiedJobToPipelineSummary(job: UnifiedAnalysisJob): PipelineJobSummary {
  return {
    id: job.id,
    status: job.status,
    company_profile_id: job.company_profile_id,
    company_name: job.company_name,
    query_set_id: job.query_set_id,
    query_set_name: job.query_set_name,
    llm_providers: job.llm_providers,
    total_queries: job.total_queries,
    completed_queries: job.completed_queries,
    failed_queries: job.failed_queries,
    progress_percentage: job.progress_percentage,
    started_at: job.started_at,
    completed_at: job.completed_at,
    created_at: job.created_at,
  }
}

function mapUnifiedJobToPipelineStatus(job: UnifiedAnalysisJob): PipelineJobStatus {
  return {
    id: job.id,
    status: job.status as PipelineJobStatus['status'],
    company_profile_id: job.company_profile_id,
    query_set_id: job.query_set_id,
    llm_providers: job.llm_providers,
    total_queries: job.total_queries,
    completed_queries: job.completed_queries,
    failed_queries: job.failed_queries,
    progress_percentage: job.progress_percentage,
    started_at: job.started_at,
    completed_at: job.completed_at,
    elapsed_seconds: calculateElapsedSeconds(job.started_at, job.completed_at),
    error_message: job.error_message,
  }
}

function mapStartResponse(response: StartAnalysisResponse): StartPipelineResponse {
  return {
    job_id: response.job_id,
    status: response.status,
    message: response.message,
    estimated_queries: response.estimated_queries,
  }
}

// Start quick analysis (preset: 3 categories, 10 queries)
export async function startQuickAnalysis(config: QuickAnalysisConfig): Promise<StartPipelineResponse> {
  const request: StartAnalysisRequest = {
    company_profile_id: config.companyProfileId,
    mode: 'quick',
    llm_providers: config.llmProviders,
  }
  const response = await post<StartAnalysisResponse>(
    `${UNIFIED_ANALYSIS_PREFIX}/start`,
    request
  )
  return mapStartResponse(response)
}

// Start advanced analysis (custom config)
export async function startAdvancedAnalysis(config: AdvancedAnalysisConfig): Promise<StartPipelineResponse> {
  const request: StartAnalysisRequest = {
    company_profile_id: config.companyProfileId,
    mode: 'advanced',
    category_count: config.categoryCount,
    queries_per_category: config.queriesPerCategory,
    llm_providers: config.llmProviders,
  }
  const response = await post<StartAnalysisResponse>(
    `${UNIFIED_ANALYSIS_PREFIX}/start`,
    request
  )
  return mapStartResponse(response)
}

export async function getJobs(
  companyProfileId?: number,
  limit = 20,
  offset = 0
): Promise<PipelineJobListResponse> {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  if (companyProfileId) {
    params.set('company_profile_id', String(companyProfileId))
  }

  const queryString = params.toString()
  const response = await get<UnifiedAnalysisJobListResponse>(
    `${UNIFIED_ANALYSIS_PREFIX}/jobs${queryString ? `?${queryString}` : ''}`
  )

  return {
    jobs: response.jobs.map(mapUnifiedJobToPipelineSummary),
    total: response.total,
  }
}

export async function getJobStatus(jobId: number): Promise<PipelineJobStatus> {
  const response = await get<UnifiedAnalysisJob>(`${UNIFIED_ANALYSIS_PREFIX}/jobs/${jobId}`)
  return mapUnifiedJobToPipelineStatus(response)
}

export async function cancelJob(
  jobId: number
): Promise<{ job_id: number; status: string; message: string }> {
  const response = await del<DeleteAnalysisResponse>(`${UNIFIED_ANALYSIS_PREFIX}/jobs/${jobId}`)
  return {
    job_id: response.job_id,
    status: response.status,
    message: response.message,
  }
}

// Transitional fallback:
// Query/category/response detail endpoints still come from pipeline API.
export { getJobCategories, getJobQueries, getQueryResponses, rerunQuerySet }

// Get company profiles for selection
export async function getCompanyProfiles(): Promise<CompanyProfile[]> {
  return get<CompanyProfile[]>(`${API_PREFIX}/company-profiles/`)
}
