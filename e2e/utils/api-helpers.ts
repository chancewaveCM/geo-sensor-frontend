const API_BASE = 'http://localhost:8765/api/v1'

export interface CompanyProfileData {
  name: string
  industry: string
  description: string
  target_audience?: string
  main_products?: string
  competitors?: string
  unique_value?: string
  website_url?: string
}

/**
 * Create company profile via API (for test setup)
 * @param token - JWT access token
 * @param data - Company profile data
 * @returns Created profile data
 */
export async function createProfileViaApi(token: string, data: CompanyProfileData) {
  const response = await fetch(`${API_BASE}/company-profiles/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Failed to create profile: ${response.status}`)
  }

  return response.json()
}

/**
 * Delete profile via API (for cleanup)
 * @param token - JWT access token
 * @param id - Profile ID to delete
 * @returns True if deletion was successful
 */
export async function deleteProfileViaApi(token: string, id: number) {
  const response = await fetch(`${API_BASE}/company-profiles/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.ok
}

/**
 * List all profiles (for cleanup)
 * @param token - JWT access token
 * @returns Object with items array and total count
 */
export async function listProfilesViaApi(token: string) {
  const response = await fetch(`${API_BASE}/company-profiles/?include_inactive=true`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    return { items: [], total: 0 }
  }

  return response.json()
}

/**
 * Clean up all test data for a user
 * @param token - JWT access token
 */
export async function cleanupTestData(token: string) {
  try {
    const profiles = await listProfilesViaApi(token)
    for (const profile of profiles.items) {
      await deleteProfileViaApi(token, profile.id)
    }
  } catch (error) {
    console.warn('Cleanup error:', error)
  }
}

/**
 * Login via API to get token
 * @param email - User email
 * @param password - User password
 * @returns JWT access token
 */
export async function loginViaApi(email: string, password: string): Promise<string> {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`)
  }

  const data = await response.json()
  return data.access_token
}

/**
 * Register via API
 * @param email - User email
 * @param password - User password
 * @param name - User display name
 * @returns Fetch Response object
 */
export async function registerViaApi(email: string, password: string, name: string) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name })
  })

  return response
}
