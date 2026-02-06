import { post } from './api-client'
import { apiClient } from './api-client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface User {
  id: string
  email: string
  name: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // OAuth2 expects form-urlencoded with 'username' field
  const formData = new URLSearchParams()
  formData.append('username', credentials.email)
  formData.append('password', credentials.password)

  const response = await apiClient.post<{ access_token: string; token_type: string }>('/api/v1/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })

  const authResponse: AuthResponse = {
    access_token: response.data.access_token,
    refresh_token: '',
    token_type: response.data.token_type,
    user: { id: '', email: credentials.email, name: '' }
  }

  // Store tokens in both localStorage and cookie (for middleware)
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', authResponse.access_token)
    document.cookie = `access_token=${authResponse.access_token}; path=/; max-age=${60 * 30}; SameSite=Lax`
  }

  return authResponse
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  // Backend expects 'full_name' not 'name'
  const registerData = {
    email: credentials.email,
    password: credentials.password,
    full_name: credentials.name
  }

  const response = await post<{ id: number; email: string; full_name: string | null }>('/api/v1/auth/register', registerData)

  // Auto-login after registration
  return login({ email: credentials.email, password: credentials.password })
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    document.cookie = 'access_token=; path=/; max-age=0'
    window.location.href = '/login'
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

export async function checkEmailAvailability(email: string): Promise<{ available: boolean; message: string }> {
  const response = await apiClient.get<{ available: boolean; message: string }>(`/api/v1/users/check-email?email=${encodeURIComponent(email)}`)
  return response.data
}
