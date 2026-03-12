import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, AuthState } from '@/types/auth.types'
import { UserRole } from '@/types/auth.types'
import authService from '@/services/auth.service'

// Re-export UserRole so consumers can import it from AuthContext
export type { UserRole }

interface AuthContextType {
  // State
  user: User | null
  accessToken: string | null
  idToken: string | null
  refreshToken: string | null
  role: UserRole | null
  fullName: string | null
  isAuthenticated: boolean
  loading: boolean

  // Actions
  login: (accessToken: string, idToken: string, refreshToken: string, role: UserRole, fullName: string) => void
  logout: () => Promise<void>

  // Role checking utilities
  hasRole: (allowedRoles: UserRole[]) => boolean
  isAdmin: () => boolean
  isAnalyst: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    idToken: null
  })
  const [loading, setLoading] = useState(true)

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      // For now, we'll use the stored information
      // In the future, this could call an API endpoint like /api/user/profile
      const role = authService.getUserRole()
      const fullName = authService.getFullName()
      const email = authService.getEmail()

      if (role && fullName) {
        const user: User = {
          id: 'current-user', // Placeholder ID
          email: email || 'No email on record', // Use stored email or placeholder
          fullName: fullName,
          role: role
        }

        setAuthState((prev) => ({
          ...prev,
          user
        }))
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = authService.getAccessToken()
      const idToken = authService.getIdToken()
      const refreshToken = authService.getRefreshToken()
      const role = authService.getUserRole()
      const fullName = authService.getFullName()

      if (accessToken && role && fullName) {
        const user: User = {
          id: '', // Will be populated from API if needed
          email: '', // Will be populated from API if needed
          fullName: fullName,
          role: role
        }

        setAuthState({
          isAuthenticated: true,
          user,
          accessToken,
          idToken,
          refreshToken
        })

        // Try to fetch full user profile
        fetchUserProfile()
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (accessToken: string, idToken: string, refreshToken: string, role: UserRole, fullName: string) => {
    const email = authService.getEmail() // Get email from localStorage if available

    const user: User = {
      id: 'current-user', // Placeholder ID
      email: email || 'No email on record', // Use stored email or placeholder
      fullName: fullName,
      role: role
    }

    setAuthState({
      isAuthenticated: true,
      user,
      accessToken,
      idToken,
      refreshToken
    })
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with local logout even if API fails
    }

    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      idToken: null,
      refreshToken: null
    })
  }

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!authState.user?.role) return false
    return allowedRoles.includes(authState.user.role)
  }

  const isAdmin = (): boolean => {
    return authState.user?.role === 'Admin'
  }

  const isAnalyst = (): boolean => {
    return authState.user?.role === 'Analyst'
  }

  const contextValue: AuthContextType = {
    // State
    user: authState.user,
    accessToken: authState.accessToken,
    idToken: authState.idToken,
    refreshToken: authState.refreshToken,
    role: authState.user?.role || null,
    fullName: authState.user?.fullName || null,
    isAuthenticated: authState.isAuthenticated,
    loading,

    // Actions
    login,
    logout,

    // Role checking utilities
    hasRole,
    isAdmin,
    isAnalyst
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
