'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  getAccessToken,
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthResponse
} from '@/lib/auth'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getAccessToken()
    if (token) {
      // TODO: Fetch user profile from API
      // For now, just set loading to false
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authLogin(credentials)
    setUser(response.user)
    router.push('/dashboard' as any)
    return response
  }

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await authRegister(credentials)
    setUser(response.user)
    router.push('/dashboard' as any)
    return response
  }

  const logout = () => {
    setUser(null)
    authLogout()
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user || !!getAccessToken(),
    login,
    register,
    logout,
  }
}
