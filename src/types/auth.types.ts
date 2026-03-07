// User interface matching API specification
export interface User {
  Id: string
  Email: string
  FullName: string
  Role: UserRole
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

// Authentication request interfaces (PascalCase to match API)
export interface RegisterRequest {
  Email: string
  Password: string
  FullName: string
}

export interface LoginRequest {
  Email: string
  Password: string
}

export interface VerifyAccountRequest {
  Email: string
  Code: string
}

// Authentication response interfaces (PascalCase to match API)
export interface RegisterResponse {
  Message: string
  UserId: string
}

export interface LoginResponse {
  AccessToken: string
  IdToken: string
  RefreshToken: string
  Role: UserRole
  FullName: string
}

export interface VerifyAccountResponse {
  Message: string
}

export interface LogoutResponse {
  Message: string
}

// Error response interface
export interface ApiErrorResponse {
  Message: string
  Details?: string
}
