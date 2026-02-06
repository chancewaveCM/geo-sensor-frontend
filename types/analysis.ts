// 분석 관련 타입 정의

export type QueryCategory = 'introductory' | 'comparative' | 'critical'
export type GeneratedQueryStatus = 'generated' | 'edited' | 'selected' | 'excluded'

export interface CompanyProfile {
  id: number
  name: string
  industry: string
  description: string
  target_audience?: string
  main_products?: string
  competitors?: string
  unique_value?: string
  website_url?: string
  project_id?: number
  owner_id: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CompanyProfileCreate {
  name: string
  industry: string
  description: string
  target_audience?: string
  main_products?: string
  competitors?: string
  unique_value?: string
  website_url?: string
  project_id?: number
}

export interface CompanyProfileUpdate {
  name?: string
  industry?: string
  description?: string
  target_audience?: string
  main_products?: string
  competitors?: string
  unique_value?: string
  website_url?: string
  is_active?: boolean
}

export interface GeneratedQuery {
  id: number
  text: string
  order_index: number
  category: QueryCategory
  status: GeneratedQueryStatus
  is_selected: boolean
  original_text?: string
  company_profile_id: number
  created_at: string
  updated_at: string
}

export interface GeneratedQueryUpdate {
  text?: string
  is_selected?: boolean
  status?: GeneratedQueryStatus
}

export type AnalysisStep = 1 | 2 | 3
