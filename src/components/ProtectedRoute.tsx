import { Navigate } from 'react-router-dom'
import authService from '@/services/auth.service'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated()
  const userRole = authService.getUserRole()

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to='/login' replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to home if user doesn't have required role
    return <Navigate to='/' replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
