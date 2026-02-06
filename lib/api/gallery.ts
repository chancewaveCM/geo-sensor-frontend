import { get, post, del } from '@/lib/api-client'
import type {
  RunResponse,
  RunCitation,
  ResponseLabel,
  ResponseLabelCreate,
  CitationReview,
  CitationReviewCreate,
  ComparisonSnapshot,
  ComparisonSnapshotCreate,
  OperationLog,
  OperationLogCreate,
  GalleryFilters,
} from '@/lib/types'

const API_PREFIX = '/api/v1'

// --- Responses ---

export async function fetchGalleryResponses(
  workspaceId: number,
  params?: GalleryFilters
): Promise<{ items: RunResponse[]; total: number }> {
  const searchParams = new URLSearchParams()
  if (params?.campaign_id != null) searchParams.set('campaign_id', String(params.campaign_id))
  if (params?.run_id != null) searchParams.set('run_id', String(params.run_id))
  if (params?.llm_provider) searchParams.set('llm_provider', params.llm_provider)
  if (params?.query_type) searchParams.set('query_type', params.query_type)
  if (params?.cluster_id != null) searchParams.set('cluster_id', String(params.cluster_id))
  if (params?.page != null) searchParams.set('page', String(params.page))
  if (params?.page_size != null) searchParams.set('page_size', String(params.page_size))
  const qs = searchParams.toString()
  return get<{ items: RunResponse[]; total: number }>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/responses${qs ? `?${qs}` : ''}`
  )
}

export async function fetchGalleryResponse(
  workspaceId: number,
  responseId: number
): Promise<RunResponse & { citations: RunCitation[] }> {
  return get<RunResponse & { citations: RunCitation[] }>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/responses/${responseId}`
  )
}

// --- Labels ---

export async function fetchResponseLabels(
  workspaceId: number,
  params?: { run_response_id?: number; label_type?: string }
): Promise<ResponseLabel[]> {
  const searchParams = new URLSearchParams()
  if (params?.run_response_id != null)
    searchParams.set('run_response_id', String(params.run_response_id))
  if (params?.label_type) searchParams.set('label_type', params.label_type)
  const qs = searchParams.toString()
  return get<ResponseLabel[]>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/labels${qs ? `?${qs}` : ''}`
  )
}

export async function createResponseLabel(
  workspaceId: number,
  data: ResponseLabelCreate
): Promise<ResponseLabel> {
  return post<ResponseLabel>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/labels`,
    data
  )
}

export async function deleteResponseLabel(
  workspaceId: number,
  labelId: number
): Promise<void> {
  return del<void>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/labels/${labelId}`
  )
}

export async function resolveResponseLabel(
  workspaceId: number,
  labelId: number
): Promise<ResponseLabel> {
  return post<ResponseLabel>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/labels/${labelId}/resolve`
  )
}

// --- Citation Reviews ---

export async function fetchCitationReviews(
  workspaceId: number,
  params?: { run_response_id?: number; review_type?: string }
): Promise<CitationReview[]> {
  const searchParams = new URLSearchParams()
  if (params?.run_response_id != null)
    searchParams.set('run_response_id', String(params.run_response_id))
  if (params?.review_type) searchParams.set('review_type', params.review_type)
  const qs = searchParams.toString()
  return get<CitationReview[]>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/citation-reviews${qs ? `?${qs}` : ''}`
  )
}

export async function createCitationReview(
  workspaceId: number,
  data: CitationReviewCreate
): Promise<CitationReview> {
  return post<CitationReview>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/citation-reviews`,
    data
  )
}

export async function verifyCitation(
  workspaceId: number,
  citationId: number
): Promise<RunCitation> {
  return post<RunCitation>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/citations/${citationId}/verify`
  )
}

// --- Comparisons ---

export async function compareLLMs(
  workspaceId: number,
  data: { response_ids: number[] }
): Promise<Record<string, unknown>> {
  return post<Record<string, unknown>>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/compare/llm`,
    data
  )
}

export async function compareDates(
  workspaceId: number,
  data: { query_definition_id: number; run_ids: number[] }
): Promise<Record<string, unknown>> {
  return post<Record<string, unknown>>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/compare/date`,
    data
  )
}

export async function compareVersions(
  workspaceId: number,
  data: { query_definition_id: number; version_ids: number[] }
): Promise<Record<string, unknown>> {
  return post<Record<string, unknown>>(
    `${API_PREFIX}/workspaces/${workspaceId}/gallery/compare/version`,
    data
  )
}

export async function fetchComparisons(
  workspaceId: number
): Promise<ComparisonSnapshot[]> {
  return get<ComparisonSnapshot[]>(
    `${API_PREFIX}/workspaces/${workspaceId}/comparisons`
  )
}

export async function createComparison(
  workspaceId: number,
  data: ComparisonSnapshotCreate
): Promise<ComparisonSnapshot> {
  return post<ComparisonSnapshot>(
    `${API_PREFIX}/workspaces/${workspaceId}/comparisons`,
    data
  )
}

export async function deleteComparison(
  workspaceId: number,
  comparisonId: number
): Promise<void> {
  return del<void>(
    `${API_PREFIX}/workspaces/${workspaceId}/comparisons/${comparisonId}`
  )
}

// --- Operations ---

export async function fetchOperations(
  workspaceId: number,
  params?: { operation_type?: string; status?: string; page?: number; page_size?: number }
): Promise<{ items: OperationLog[]; total: number }> {
  const searchParams = new URLSearchParams()
  if (params?.operation_type) searchParams.set('operation_type', params.operation_type)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.page != null) searchParams.set('page', String(params.page))
  if (params?.page_size != null) searchParams.set('page_size', String(params.page_size))
  const qs = searchParams.toString()
  return get<{ items: OperationLog[]; total: number }>(
    `${API_PREFIX}/workspaces/${workspaceId}/operations${qs ? `?${qs}` : ''}`
  )
}

export async function createOperation(
  workspaceId: number,
  data: OperationLogCreate
): Promise<OperationLog> {
  return post<OperationLog>(
    `${API_PREFIX}/workspaces/${workspaceId}/operations`,
    data
  )
}

export async function fetchOperation(
  workspaceId: number,
  operationId: number
): Promise<OperationLog> {
  return get<OperationLog>(
    `${API_PREFIX}/workspaces/${workspaceId}/operations/${operationId}`
  )
}

export async function reviewOperation(
  workspaceId: number,
  operationId: number,
  data: { status: string; review_comment?: string }
): Promise<OperationLog> {
  return post<OperationLog>(
    `${API_PREFIX}/workspaces/${workspaceId}/operations/${operationId}/review`,
    data
  )
}

export async function cancelOperation(
  workspaceId: number,
  operationId: number
): Promise<OperationLog> {
  return post<OperationLog>(
    `${API_PREFIX}/workspaces/${workspaceId}/operations/${operationId}/cancel`
  )
}
