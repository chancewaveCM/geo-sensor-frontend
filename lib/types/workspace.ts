export interface Workspace {
  id: number
  name: string
  slug: string
  description: string | null
  user_role?: string
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: number
  workspace_id: number
  user_id: number
  role: 'admin' | 'user'
  joined_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkspaceCreate {
  name: string
  slug: string
  description?: string
}

export interface WorkspaceUpdate {
  name?: string
  description?: string
}

export interface WorkspaceWithRole extends Workspace {
  user_role: string
  member_count?: number
}

export interface WorkspaceMemberCreate {
  user_id: number
  role: 'admin' | 'user'
}
