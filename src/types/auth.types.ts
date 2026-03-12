// User interface matching API specification
export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
}

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
}

// User roles matching backend SystemRoles
export const UserRole = {
  Admin: 'Admin',
  Analyst: 'Analyst'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Authentication request interfaces (camelCase to match API)
export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface VerifyAccountRequest {
  email: string
  code: string
}

// Authentication response interfaces (camelCase to match API)
export interface RegisterResponse {
  message: string
  userId: string
}

export interface LoginResponse {
  accessToken: string
  idToken: string
  refreshToken: string
  role: UserRole
  fullName: string
}

export interface VerifyAccountResponse {
  message: string
}

export interface LogoutResponse {
  message: string
}

// Error response interface
export interface ApiErrorResponse {
  message: string
  details?: string
}
