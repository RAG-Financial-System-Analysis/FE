import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import authService from '@/services/auth.service'
import type { RegisterRequest, LoginRequest, VerifyAccountRequest } from '@/types/auth.types'

interface UseAuthActionsReturn {
  // Loading states
  isRegistering: boolean
  isVerifying: boolean
  isLoggingIn: boolean
  isLoggingOut: boolean

  // Actions
  register: (data: RegisterRequest) => Promise<{ success: boolean; message: string; userId?: string }>
  verifyAccount: (data: VerifyAccountRequest) => Promise<{ success: boolean; message: string }>
  login: (data: LoginRequest) => Promise<{ success: boolean; message: string; role?: string }>
  logout: () => Promise<{ success: boolean; message: string }>

  // Error handling
  error: string | null
  clearError: () => void
}

export const useAuthActions = (): UseAuthActionsReturn => {
  const { login: contextLogin, logout: contextLogout } = useAuth()

  const [isRegistering, setIsRegistering] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const register = async (data: RegisterRequest) => {
    setIsRegistering(true)
    setError(null)

    try {
      const response = await authService.register(data)
      return {
        success: true,
        message: response.Message,
        userId: response.UserId
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { Message?: string } } })?.response?.data?.Message ||
        'Registration failed. Please try again.'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const verifyAccount = async (data: VerifyAccountRequest) => {
    setIsVerifying(true)
    setError(null)

    try {
      const response = await authService.verifyAccount(data)
      return {
        success: true,
        message: response.Message
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { Message?: string } } })?.response?.data?.Message ||
        'Verification failed. Please try again.'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const login = async (data: LoginRequest) => {
    setIsLoggingIn(true)
    setError(null)

    try {
      const response = await authService.login(data)

      // Update context with login data
      contextLogin(response.AccessToken, response.IdToken, response.RefreshToken, response.Role, response.FullName)

      return {
        success: true,
        message: 'Login successful',
        role: response.Role
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { Message?: string } } })?.response?.data?.Message ||
        'Login failed. Please check your credentials.'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = async () => {
    setIsLoggingOut(true)
    setError(null)

    try {
      await contextLogout()
      return {
        success: true,
        message: 'Logged out successfully'
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { Message?: string } } })?.response?.data?.Message || 'Logout failed'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoggingOut(false)
    }
  }

  return {
    // Loading states
    isRegistering,
    isVerifying,
    isLoggingIn,
    isLoggingOut,

    // Actions
    register,
    verifyAccount,
    login,
    logout,

    // Error handling
    error,
    clearError
  }
}
