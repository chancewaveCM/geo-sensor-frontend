import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchGalleryResponses,
  fetchGalleryResponse,
  createResponseLabel,
  deleteResponseLabel,
  resolveResponseLabel,
  createCitationReview,
  verifyCitation,
  compareLLMs,
  compareDates,
  compareVersions,
  fetchComparisons,
  createComparison,
  deleteComparison,
  fetchOperations,
  createOperation,
  reviewOperation,
  cancelOperation,
} from '@/lib/api/gallery'
import type {
  GalleryFilters,
  ResponseLabelCreate,
  CitationReviewCreate,
  ComparisonSnapshotCreate,
  OperationLogCreate,
} from '@/lib/types'

// --- Responses ---

export function useGalleryResponses(
  workspaceId: number | undefined,
  filters?: GalleryFilters
) {
  return useQuery({
    queryKey: ['gallery', workspaceId, 'responses', filters],
    queryFn: () => fetchGalleryResponses(workspaceId!, filters),
    enabled: workspaceId != null,
  })
}

export function useGalleryResponse(
  workspaceId: number | undefined,
  responseId: number | undefined
) {
  return useQuery({
    queryKey: ['gallery', workspaceId, 'responses', responseId],
    queryFn: async () => {
      const responseData = await fetchGalleryResponse(workspaceId!, responseId!)
      const { fetchResponseLabels } = await import('@/lib/api/gallery')
      const labels = await fetchResponseLabels(workspaceId!, { run_response_id: responseId })
      return {
        ...responseData,
        labels,
      }
    },
    enabled: workspaceId != null && responseId != null,
  })
}

// --- Labels ---

export function useCreateLabel(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ResponseLabelCreate) => createResponseLabel(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gallery', workspaceId],
      })
    },
  })
}

export function useDeleteLabel(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (labelId: number) => deleteResponseLabel(workspaceId, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gallery', workspaceId],
      })
    },
  })
}

export function useResolveLabel(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (labelId: number) => resolveResponseLabel(workspaceId, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gallery', workspaceId],
      })
    },
  })
}

// --- Citation Reviews ---

export function useCreateCitationReview(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CitationReviewCreate) => createCitationReview(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gallery', workspaceId],
      })
    },
  })
}

export function useVerifyCitation(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (citationId: number) => verifyCitation(workspaceId, citationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gallery', workspaceId],
      })
    },
  })
}

// --- Comparisons ---

export function useCompareLLMs(workspaceId: number | undefined) {
  return useMutation({
    mutationFn: (data: { response_ids: number[] }) => compareLLMs(workspaceId!, data),
  })
}

export function useCompareDates(workspaceId: number | undefined) {
  return useMutation({
    mutationFn: (data: { query_definition_id: number; run_ids: number[] }) =>
      compareDates(workspaceId!, data),
  })
}

export function useCompareVersions(workspaceId: number | undefined) {
  return useMutation({
    mutationFn: (data: { query_definition_id: number; version_ids: number[] }) =>
      compareVersions(workspaceId!, data),
  })
}

export function useComparisons(workspaceId: number | undefined) {
  return useQuery({
    queryKey: ['comparisons', workspaceId],
    queryFn: () => fetchComparisons(workspaceId!),
    enabled: workspaceId != null,
  })
}

export function useCreateComparison(workspaceId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ComparisonSnapshotCreate) =>
      createComparison(workspaceId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comparisons', workspaceId],
      })
    },
  })
}

export function useDeleteComparison(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (comparisonId: number) => deleteComparison(workspaceId, comparisonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comparisons', workspaceId],
      })
    },
  })
}

// --- Operations ---

export function useOperations(
  workspaceId: number | undefined,
  params?: { operation_type?: string; status?: string; page?: number; page_size?: number }
) {
  return useQuery({
    queryKey: ['operations', workspaceId, params],
    queryFn: () => fetchOperations(workspaceId!, params),
    enabled: workspaceId != null,
  })
}

export function useCreateOperation(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OperationLogCreate) => createOperation(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['operations', workspaceId],
      })
    },
  })
}

export function useReviewOperation(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      operationId,
      ...data
    }: {
      operationId: number
      status: string
      review_comment?: string
    }) => reviewOperation(workspaceId, operationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['operations', workspaceId],
      })
    },
  })
}

export function useCancelOperation(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (operationId: number) => cancelOperation(workspaceId, operationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['operations', workspaceId],
      })
    },
  })
}
