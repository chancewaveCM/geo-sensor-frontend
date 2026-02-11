import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  getWorkspaceMembers,
  addWorkspaceMember,
} from '@/lib/api/workspaces'
import type { WorkspaceCreate, WorkspaceMemberCreate } from '@/types'

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })
}

export function useWorkspace(id: number | undefined) {
  return useQuery({
    queryKey: ['workspaces', id],
    queryFn: () => getWorkspace(id!),
    enabled: id != null,
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkspaceCreate) => createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}

export function useWorkspaceMembers(workspaceId: number | undefined) {
  return useQuery({
    queryKey: ['workspaces', workspaceId, 'members'],
    queryFn: () => getWorkspaceMembers(workspaceId!),
    enabled: workspaceId != null,
  })
}

export function useAddWorkspaceMember(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkspaceMemberCreate) => addWorkspaceMember(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] })
    },
  })
}
