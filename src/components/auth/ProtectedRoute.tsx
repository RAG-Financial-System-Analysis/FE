import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type UserRole } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, hasRole } = useAuth()

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Loader2 className='w-10 h-10 text-primary animate-spin' />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to='/unauthorized' replace />
  }

  return <Outlet />
}

export default ProtectedRoute
