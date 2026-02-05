// lib/api/pipeline.ts

import { get, post } from '@/lib/api-client';
import type {
  StartPipelineRequest,
  StartPipelineResponse,
  PipelineJobStatus,
  CategoriesListResponse,
  QueriesListResponse,
  ResponsesListResponse,
} from '@/types/pipeline';
import type { CompanyProfile } from '@/types/analysis';

const API_PREFIX = '/api/v1';

export async function startPipeline(request: StartPipelineRequest): Promise<StartPipelineResponse> {
  return post<StartPipelineResponse>(`${API_PREFIX}/pipeline/start`, request);
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

export async function getCompanyProfiles(): Promise<CompanyProfile[]> {
  const response = await get<{ items: CompanyProfile[]; total: number }>(`${API_PREFIX}/company-profiles/`);
  return response.items;
}
