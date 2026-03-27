import { createContext, useContext } from 'react'
import type { AuthUser, UserRole } from '@/types'

// Re-export UserRole so consumers can import it from AuthContext
export type { UserRole }

interface AuthContextType {
  // State
  user: AuthUser | null
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
