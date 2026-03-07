import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types/auth.types'

interface UseRoleGuardReturn {
  // Role checking
  hasRole: (allowedRoles: UserRole[]) => boolean
  isAdmin: boolean
  isAnalyst: boolean

  // Route protection
  canAccessAdminRoutes: boolean
  canAccessAnalystRoutes: boolean
  canAccessPublicRoutes: boolean

  // UI helpers
  shouldShowAdminFeatures: boolean
  shouldShowAnalystFeatures: boolean

  // Current user info
  currentRole: UserRole | null
  isAuthenticated: boolean
}

export const useRoleGuard = (): UseRoleGuardReturn => {
  const { isAuthenticated, role, hasRole, isAdmin, isAnalyst } = useAuth()

  const canAccessAdminRoutes = isAuthenticated && isAdmin()
  const canAccessAnalystRoutes = isAuthenticated && (isAdmin() || isAnalyst())
  const canAccessPublicRoutes = true // Public routes are always accessible

  const shouldShowAdminFeatures = canAccessAdminRoutes
  const shouldShowAnalystFeatures = canAccessAnalystRoutes

  return {
    // Role checking
    hasRole,
    isAdmin: isAdmin(),
    isAnalyst: isAnalyst(),

    // Route protection
    canAccessAdminRoutes,
    canAccessAnalystRoutes,
    canAccessPublicRoutes,

    // UI helpers
    shouldShowAdminFeatures,
    shouldShowAnalystFeatures,

    // Current user info
    currentRole: role,
    isAuthenticated
  }
}
