export interface User {
  id: string
  email: string
  fullName: string
  role: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export const UserRole = {
  Admin: 'Admin',
  User: 'User',
  Guest: 'Guest'
} as const

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]
