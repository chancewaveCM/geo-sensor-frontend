export interface Workspace {
  id: number
  name: string
  slug: string
  description: string | null
  my_role?: 'admin' | 'user'
  user_role?: string
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: number
  user_id: number
  email: string | null
  full_name: string | null
  role: 'admin' | 'user'
  joined_at: string | null
  created_at: string
}

export interface WorkspaceCreate {
  name: string
  description?: string
}

export interface WorkspaceUpdate {
  name?: string
  description?: string
}

export interface WorkspaceWithRole extends Workspace {
  my_role?: 'admin' | 'user'
  user_role?: string
  member_count?: number
}

export interface WorkspaceMemberCreate {
  email: string
  role: 'admin' | 'user'
}
