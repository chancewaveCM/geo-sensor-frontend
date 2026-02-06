import { get, post, put } from '@/lib/api-client'
import type {
  Workspace,
  WorkspaceCreate,
  WorkspaceUpdate,
  WorkspaceMember,
  WorkspaceMemberCreate,
  WorkspaceWithRole,
} from '@/lib/types'

const API_PREFIX = '/api/v1'

export async function fetchWorkspaces(): Promise<WorkspaceWithRole[]> {
  return get<WorkspaceWithRole[]>(`${API_PREFIX}/workspaces`)
}

export async function fetchWorkspace(id: number): Promise<Workspace> {
  return get<Workspace>(`${API_PREFIX}/workspaces/${id}`)
}

export async function createWorkspace(data: WorkspaceCreate): Promise<Workspace> {
  return post<Workspace>(`${API_PREFIX}/workspaces`, data)
}

export async function updateWorkspace(id: number, data: WorkspaceUpdate): Promise<Workspace> {
  return put<Workspace>(`${API_PREFIX}/workspaces/${id}`, data)
}

export async function fetchWorkspaceMembers(workspaceId: number): Promise<WorkspaceMember[]> {
  return get<WorkspaceMember[]>(`${API_PREFIX}/workspaces/${workspaceId}/members`)
}

export async function addWorkspaceMember(
  workspaceId: number,
  data: WorkspaceMemberCreate
): Promise<WorkspaceMember> {
  return post<WorkspaceMember>(`${API_PREFIX}/workspaces/${workspaceId}/members`, data)
}
