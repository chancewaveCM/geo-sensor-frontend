import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  createSchedule,
  deleteCategory,
  deleteSchedule,
  getProfilePipelineStats,
  getSchedules,
  getQuerySetDetail,
  getQuerySets,
  updateCategory,
  updateSchedule,
} from '@/lib/api/pipeline'
import type {
  CreateCategoryRequest,
  CreateScheduleRequest,
  UpdateCategoryRequest,
  UpdateScheduleRequest,
} from '@/types/pipeline'

export function useProfilePipelineStats() {
  return useQuery({
    queryKey: ['pipeline', 'profiles', 'stats'],
    queryFn: getProfilePipelineStats,
  })
}

export function useCompanyQuerySets(companyProfileId: number | undefined) {
  return useQuery({
    queryKey: ['pipeline', 'query-sets', companyProfileId],
    queryFn: () => getQuerySets(companyProfileId),
    enabled: companyProfileId != null,
  })
}

export function useQuerySetDetail(querySetId: number | undefined) {
  return useQuery({
    queryKey: ['pipeline', 'query-set-detail', querySetId],
    queryFn: () => getQuerySetDetail(querySetId!),
    enabled: querySetId != null,
  })
}

export function useAllQuerySets() {
  return useQuery({
    queryKey: ['pipeline', 'query-sets', 'all'],
    queryFn: () => getQuerySets(),
  })
}

export function useCreateCategory(querySetId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => {
      if (querySetId == null) throw new Error('querySetId is required')
      return createCategory(querySetId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'query-set-detail', querySetId] })
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'query-sets'] })
    },
  })
}

export function useUpdateCategory(querySetId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: number; data: UpdateCategoryRequest }) =>
      updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'query-set-detail', querySetId] })
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'query-sets'] })
    },
  })
}

export function useDeleteCategory(querySetId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'query-set-detail', querySetId] })
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'query-sets'] })
    },
  })
}

export function useSchedules(
  filters: {
    querySetId?: number
    companyProfileId?: number
  }
) {
  return useQuery({
    queryKey: ['pipeline', 'schedules', filters],
    queryFn: () => getSchedules(filters.querySetId, filters.companyProfileId),
  })
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'schedules'] })
    },
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) => updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'schedules'] })
    },
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'schedules'] })
    },
  })
}
