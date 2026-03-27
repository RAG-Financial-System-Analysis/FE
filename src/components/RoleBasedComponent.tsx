import { useAuth, type UserRole } from '@/context'
import type { ReactNode } from 'react'

interface RoleBasedComponentProps {
  allowedRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component to conditionally render content based on user role
 *
 * @example
 * ```tsx
 * <RoleBasedComponent allowedRoles={['Admin', 'Analyst']}>
 *   <button>Admin/Analyst Only Button</button>
 * </RoleBasedComponent>
 * ```
 */
export const RoleBasedComponent = ({ allowedRoles, children, fallback = null }: RoleBasedComponentProps) => {
  const { hasRole } = useAuth()

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook to check if user has specific role
 *
 * @example
 * ```tsx
 * const isAdmin = useHasRole(['Admin'])
 * if (isAdmin) {
 *   // Show admin features
 * }
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useHasRole = (allowedRoles: UserRole[]): boolean => {
  const { hasRole } = useAuth()
  return hasRole(allowedRoles)
}
