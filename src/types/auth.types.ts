/**
 * Authentication and authorization types
 *
 * This module contains types for user authentication, authorization,
 * and authentication state management.
 */

/**
 * User roles in the system
 *
 * @enum {string}
 * @example
 * ```typescript
 * const adminRole: UserRole = 'Admin'
 * const analystRole: UserRole = 'Analyst'
 * ```
 */
export const UserRole = {
  /** Administrator with full system access */
  Admin: 'Admin',
  /** Analyst with limited access to analytics and reports */
  Analyst: 'Analyst'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

/**
 * Simplified user type for authentication context
 *
 * Contains essential user information used throughout the application.
 *
 * @example
 * ```typescript
 * const user: AuthUser = {
 *   id: 'user-123',
 *   email: 'user@example.com',
 *   fullName: 'John Doe',
 *   role: 'Admin'
 * }
 * ```
 */
export interface AuthUser {
  /** Unique user identifier */
  id: string
  /** User's email address */
  email: string
  /** User's full name */
  fullName: string
  /** User's role in the system */
  role: UserRole
}

/**
 * Authentication state interface
 *
 * Represents the current authentication state of the application.
 *
 * @example
 * ```typescript
 * const state: AuthState = {
 *   isAuthenticated: true,
 *   user: { id: '1', email: 'user@example.com', fullName: 'John', role: 'Admin' },
 *   accessToken: 'jwt-token',
 *   refreshToken: 'refresh-token',
 *   idToken: 'id-token'
 * }
 * ```
 */
export interface AuthState {
  /** Whether user is currently authenticated */
  isAuthenticated: boolean
  /** Current authenticated user or null */
  user: AuthUser | null
  /** JWT access token for API requests */
  accessToken: string | null
  /** Token for refreshing access token */
  refreshToken: string | null
  /** OpenID Connect ID token */
  idToken: string | null
}

/**
 * User registration request
 *
 * @example
 * ```typescript
 * const request: RegisterRequest = {
 *   email: 'newuser@example.com',
 *   password: 'SecurePass123!',
 *   fullName: 'Jane Doe'
 * }
 * ```
 */
export interface RegisterRequest {
  /** User's email address */
  email: string
  /** User's password (must meet security requirements) */
  password: string
  /** User's full name */
  fullName: string
}

/**
 * User login request
 *
 * @example
 * ```typescript
 * const request: LoginRequest = {
 *   email: 'user@example.com',
 *   password: 'password123'
 * }
 * ```
 */
export interface LoginRequest {
  /** User's email address */
  email: string
  /** User's password */
  password: string
}

/**
 * Account verification request
 *
 * Used to verify email address after registration.
 *
 * @example
 * ```typescript
 * const request: VerifyAccountRequest = {
 *   email: 'user@example.com',
 *   code: '123456'
 * }
 * ```
 */
export interface VerifyAccountRequest {
  /** User's email address */
  email: string
  /** Verification code sent to email */
  code: string
}

/**
 * User registration response
 *
 * @example
 * ```typescript
 * const response: RegisterResponse = {
 *   message: 'Registration successful',
 *   userId: 'user-123'
 * }
 * ```
 */
export interface RegisterResponse {
  /** Response message */
  message: string
  /** ID of newly created user */
  userId: string
}

/**
 * User login response
 *
 * Contains authentication tokens and user information.
 *
 * @example
 * ```typescript
 * const response: LoginResponse = {
 *   accessToken: 'jwt-token',
 *   idToken: 'id-token',
 *   refreshToken: 'refresh-token',
 *   role: 'Admin',
 *   fullName: 'John Doe'
 * }
 * ```
 */
export interface LoginResponse {
  /** JWT access token for API requests */
  accessToken: string
  /** OpenID Connect ID token */
  idToken: string
  /** Token for refreshing access token */
  refreshToken: string
  /** User's role in the system */
  role: UserRole
  /** User's full name */
  fullName: string
  /** User's email address (optional) */
  email?: string
}

/**
 * Account verification response
 *
 * @example
 * ```typescript
 * const response: VerifyAccountResponse = {
 *   message: 'Account verified successfully'
 * }
 * ```
 */
export interface VerifyAccountResponse {
  /** Response message */
  message: string
}

/**
 * Logout response
 *
 * @example
 * ```typescript
 * const response: LogoutResponse = {
 *   message: 'Logged out successfully'
 * }
 * ```
 */
export interface LogoutResponse {
  /** Response message */
  message: string
}

/**
 * API error response for authentication failures
 *
 * @example
 * ```typescript
 * const error: ApiErrorResponse = {
 *   message: 'Invalid credentials',
 *   details: 'Email or password is incorrect'
 * }
 * ```
 */
export interface ApiErrorResponse {
  /** Error message */
  message: string
  /** Additional error details */
  details?: string
}
