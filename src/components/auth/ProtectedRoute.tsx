import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, hasRole, loading } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check role requirements
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Redirect based on user role
    if (!isAuthenticated) {
      return <Navigate to='/login' state={{ from: location }} replace />
    }

    // User is authenticated but doesn't have required role
    return <Navigate to='/unauthorized' replace />
  }

  return <>{children}</>
}

export { ProtectedRoute }

// Convenience components for specific roles
export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['Admin']}>{children}</ProtectedRoute>
)

export const AnalystRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['Admin', 'Analyst']}>{children}</ProtectedRoute>
)

export const PublicRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
)

// Default export for backward compatibility
export default ProtectedRoute
