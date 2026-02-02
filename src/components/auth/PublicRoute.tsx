import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * PublicRoute component - Redirects authenticated users away from public pages
 * Used for login, signup pages - if user is already logged in, redirect to dashboard/admin
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading, role } = useAuth()

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Loader2 className='w-10 h-10 text-primary animate-spin' />
      </div>
    )
  }

  // If user is authenticated, redirect based on role
  if (isAuthenticated) {
    // Admin goes to admin panel, others go to dashboard
    return <Navigate to={role === 'Admin' ? '/admin' : '/dashboard'} replace />
  }

  // User is not authenticated, show the public page (login/signup)
  return <>{children}</>
}

export default PublicRoute
