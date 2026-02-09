// lib/api/pipeline.ts

import { get, post, put, del } from '@/lib/api-client';
import type {
  StartPipelineRequest,
  StartPipelineResponse,
  PipelineJobStatus,
  CategoriesListResponse,
  QueriesListResponse,
  ResponsesListResponse,
  ProfileStatsListResponse,
  QuerySetDetail,
  QuerySetListResponse,
  QuerySetHistoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PipelineCategory,
  ScheduleListResponse,
  ScheduleConfig,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  PipelineJobListResponse,
} from '@/types/pipeline';

const API_PREFIX = '/api/v1';

export async function startPipeline(request: StartPipelineRequest): Promise<StartPipelineResponse> {
  return post<StartPipelineResponse>(`${API_PREFIX}/pipeline/start`, request);
}

export async function getJobs(companyProfileId?: number, limit = 20, offset = 0): Promise<PipelineJobListResponse> {
  const params = new URLSearchParams();
  if (companyProfileId) params.set('company_profile_id', String(companyProfileId));
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  const query = params.toString();
  return get<PipelineJobListResponse>(`${API_PREFIX}/pipeline/jobs${query ? `?${query}` : ''}`);
}

export async function getJobStatus(jobId: number): Promise<PipelineJobStatus> {
  return get<PipelineJobStatus>(`${API_PREFIX}/pipeline/jobs/${jobId}`);
}

export async function cancelJob(jobId: number): Promise<{ job_id: number; status: string; message: string }> {
  return post(`${API_PREFIX}/pipeline/jobs/${jobId}/cancel`);
}

export async function getJobCategories(jobId: number): Promise<CategoriesListResponse> {
  return get<CategoriesListResponse>(`${API_PREFIX}/pipeline/jobs/${jobId}/categories`);
}

export async function getJobQueries(jobId: number, categoryId?: number): Promise<QueriesListResponse> {
  const params = categoryId ? `?category_id=${categoryId}` : '';
  return get<QueriesListResponse>(`${API_PREFIX}/pipeline/jobs/${jobId}/queries${params}`);
}

export async function getQueryResponses(queryId: number): Promise<ResponsesListResponse> {
  return get<ResponsesListResponse>(`${API_PREFIX}/pipeline/queries/${queryId}/responses`);
}

// === Profile Stats ===

export async function getProfilePipelineStats(): Promise<ProfileStatsListResponse> {
  return get<ProfileStatsListResponse>(`${API_PREFIX}/pipeline/profiles/stats`);
}

// === Enhanced QuerySet ===

export async function getQuerySetDetail(querySetId: number): Promise<QuerySetDetail> {
  return get<QuerySetDetail>(`${API_PREFIX}/pipeline/queryset/${querySetId}/detail`);
}

export async function getQuerySets(companyProfileId?: number): Promise<QuerySetListResponse> {
  const params = companyProfileId ? `?company_profile_id=${companyProfileId}` : '';
  return get<QuerySetListResponse>(`${API_PREFIX}/pipeline/queryset${params}`);
}

export async function rerunQuerySet(querySetId: number, providers?: string[]): Promise<StartPipelineResponse> {
  const body = providers ? { llm_providers: providers } : undefined;
  return post<StartPipelineResponse>(`${API_PREFIX}/pipeline/queryset/${querySetId}/rerun`, body);
}

export async function getQuerySetHistory(querySetId: number): Promise<QuerySetHistoryResponse> {
  return get<QuerySetHistoryResponse>(`${API_PREFIX}/pipeline/queryset/${querySetId}/history`);
}

// === Category Queries + CRUD ===

export async function getCategoryQueries(categoryId: number): Promise<QueriesListResponse> {
  return get<QueriesListResponse>(`${API_PREFIX}/pipeline/categories/${categoryId}/queries`);
}

export async function createCategory(querySetId: number, data: CreateCategoryRequest): Promise<PipelineCategory> {
  return post<PipelineCategory>(`${API_PREFIX}/pipeline/queryset/${querySetId}/categories`, data);
}

export async function updateCategory(categoryId: number, data: UpdateCategoryRequest): Promise<PipelineCategory> {
  return put<PipelineCategory>(`${API_PREFIX}/pipeline/categories/${categoryId}`, data);
}

export async function deleteCategory(categoryId: number): Promise<void> {
  return del(`${API_PREFIX}/pipeline/categories/${categoryId}`);
}

// === Schedule Management ===

export async function getSchedules(
  querySetId?: number,
  companyProfileId?: number,
): Promise<ScheduleListResponse> {
  const searchParams = new URLSearchParams();
  if (querySetId !== undefined) {
    searchParams.set('query_set_id', String(querySetId));
  }
  if (companyProfileId !== undefined) {
    searchParams.set('company_profile_id', String(companyProfileId));
  }
  const query = searchParams.toString();
  return get<ScheduleListResponse>(`${API_PREFIX}/pipeline/schedules${query ? `?${query}` : ''}`);
}

export async function createSchedule(data: CreateScheduleRequest): Promise<ScheduleConfig> {
  return post<ScheduleConfig>(`${API_PREFIX}/pipeline/schedules`, data);
}

export async function updateSchedule(id: number, data: UpdateScheduleRequest): Promise<ScheduleConfig> {
  return put<ScheduleConfig>(`${API_PREFIX}/pipeline/schedules/${id}`, data);
}

export async function deleteSchedule(id: number): Promise<void> {
  return del(`${API_PREFIX}/pipeline/schedules/${id}`);
}
