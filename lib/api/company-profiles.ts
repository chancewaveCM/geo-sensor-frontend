import { get, post, put, del } from '@/lib/api-client'
import type { CompanyProfile, CompanyProfileCreate } from '@/types/analysis'

const API_PREFIX = '/api/v1'

export interface CompanyProfileListResponse {
  items: CompanyProfile[]
  total: number
}

export async function getCompanyProfiles(
  includeInactive = false
): Promise<CompanyProfileListResponse> {
  const params = includeInactive ? '?include_inactive=true' : ''
  return get<CompanyProfileListResponse>(`${API_PREFIX}/company-profiles/${params}`)
}

export async function getCompanyProfile(id: number): Promise<CompanyProfile> {
  return get<CompanyProfile>(`${API_PREFIX}/company-profiles/${id}`)
}

export async function createCompanyProfile(
  data: CompanyProfileCreate
): Promise<CompanyProfile> {
  return post<CompanyProfile>(`${API_PREFIX}/company-profiles/`, data)
}

export async function updateCompanyProfile(
  id: number,
  data: Partial<CompanyProfileCreate>
): Promise<CompanyProfile> {
  return put<CompanyProfile>(`${API_PREFIX}/company-profiles/${id}`, data)
}

export async function deactivateCompanyProfile(id: number): Promise<void> {
  return del(`${API_PREFIX}/company-profiles/${id}`)
}

export async function reactivateCompanyProfile(id: number): Promise<CompanyProfile> {
  return put<CompanyProfile>(`${API_PREFIX}/company-profiles/${id}/reactivate`, {})
}
