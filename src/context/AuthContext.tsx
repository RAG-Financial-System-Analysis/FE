import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, UserRole, AuthState } from '@/types/auth.types'
import authService from '@/services/auth.service'

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
          Id: '', // We don't store user ID in localStorage
          Email: '', // We don't store email in localStorage
          FullName: fullName,
          Role: role
        }

        setAuthState({
          isAuthenticated: true,
          user,
          accessToken,
          idToken,
          refreshToken
        })
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (accessToken: string, idToken: string, refreshToken: string, role: UserRole, fullName: string) => {
    const user: User = {
      Id: '', // Will be populated from API if needed
      Email: '', // Will be populated from API if needed
      FullName: fullName,
      Role: role
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
    if (!authState.user?.Role) return false
    return allowedRoles.includes(authState.user.Role)
  }

  const isAdmin = (): boolean => {
    return authState.user?.Role === 'Admin'
  }

  const isAnalyst = (): boolean => {
    return authState.user?.Role === 'Analyst'
  }

  const contextValue: AuthContextType = {
    // State
    user: authState.user,
    accessToken: authState.accessToken,
    idToken: authState.idToken,
    refreshToken: authState.refreshToken,
    role: authState.user?.Role || null,
    fullName: authState.user?.FullName || null,
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
