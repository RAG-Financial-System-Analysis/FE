import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'Admin' | 'Source' | 'Provider' | 'Analyst' | 'Member'

interface User {
  id: string
  name: string
  email: string
  role?: UserRole
  fullName?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  role: UserRole | null
  fullName: string | null
  login: (userData: User, token: string, role: UserRole, fullName: string) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
  hasRole: (allowedRoles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hydrate state from localStorage on mount
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedRole = localStorage.getItem('userRole')
    const storedFullName = localStorage.getItem('fullName')

    // Use a function to batch state updates
    const initializeAuth = () => {
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
      if (storedRole) {
        setRole(storedRole as UserRole)
      }
      if (storedFullName) {
        setFullName(storedFullName)
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (userData: User, authToken: string, userRole: UserRole, userFullName: string) => {
    setUser(userData)
    setToken(authToken)
    setRole(userRole)
    setFullName(userFullName)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
    localStorage.setItem('userRole', userRole)
    localStorage.setItem('fullName', userFullName)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setRole(null)
    setFullName(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('fullName')
  }

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false
    return allowedRoles.includes(role)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, role, fullName, login, logout, isAuthenticated, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
