import { authApi } from './api'
import type {
  RegisterRequest,
  LoginRequest,
  VerifyAccountRequest,
  RegisterResponse,
  LoginResponse,
  VerifyAccountResponse,
  LogoutResponse,
  UserRole
} from '@/types/auth.types'

/**
 * Auth Service - Business logic and data transformation
 *
 * Handles authentication operations including user registration, login, logout,
 * and token management. Manages authentication state in localStorage.
 *
 * @class AuthService
 * @example
 * ```typescript
 * import { authService } from '@/services'
 *
 * // Register new user
 * await authService.register({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   fullName: 'John Doe'
 * })
 *
 * // Login
 * const result = await authService.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * })
 *
 * // Check if authenticated
 * if (authService.isAuthenticated()) {
 *   console.log('User is logged in')
 * }
 * ```
 */
class AuthService {
  /**
   * Register a new user account
   *
   * @param {RegisterRequest} data - Registration data
   * @param {string} data.email - User email address
   * @param {string} data.password - User password
   * @param {string} data.fullName - User's full name
   * @returns {Promise<RegisterResponse>} Registration result with user ID
   * @throws {Error} If registration fails (e.g., email already exists)
   *
   * @example
   * ```typescript
   * const result = await authService.register({
   *   email: 'newuser@example.com',
   *   password: 'SecurePass123!',
   *   fullName: 'Jane Doe'
   * })
   * console.log(result.userId) // New user ID
   * ```
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await authApi.register(data)
    return {
      message: response.data.message,
      userId: response.data.userId
    }
  }

  /**
   * Verify user account with confirmation code
   *
   * Completes the account verification process after registration.
   *
   * @param {VerifyAccountRequest} data - Verification data
   * @param {string} data.email - User email address
   * @param {string} data.code - Verification code sent to email
   * @returns {Promise<VerifyAccountResponse>} Verification result
   * @throws {Error} If verification fails (invalid code or email)
   *
   * @example
   * ```typescript
   * await authService.verifyAccount({
   *   email: 'user@example.com',
   *   code: '123456'
   * })
   * ```
   */
  async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
    const response = await authApi.verifyAccount(data)
    return {
      message: response.data.message
    }
  }

  /**
   * Authenticate user with email and password
   *
   * Logs in a user and stores authentication tokens in localStorage.
   * Automatically saves user information for later retrieval.
   *
   * @param {LoginRequest} data - Login credentials
   * @param {string} data.email - User email address
   * @param {string} data.password - User password
   * @returns {Promise<LoginResponse>} Login result with tokens and user info
   * @throws {Error} If login fails (invalid credentials)
   *
   * @example
   * ```typescript
   * const result = await authService.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * })
   * console.log(result.accessToken) // JWT access token
   * console.log(result.role) // User role (Admin or Analyst)
   * ```
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await authApi.login(data)

    // Extract response data (API returns camelCase)
    const accessToken = response.data.accessToken
    const idToken = response.data.idToken
    const refreshToken = response.data.refreshToken
    const role = response.data.role
    const fullName = response.data.fullName
    const email = data.email // Use email from login request

    // Save tokens and user info to localStorage
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }
    if (idToken) {
      localStorage.setItem('idToken', idToken)
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
    if (role) {
      localStorage.setItem('userRole', role)
    }
    if (fullName) {
      localStorage.setItem('fullName', fullName)
    }
    if (email) {
      localStorage.setItem('userEmail', email)
    }

    return {
      accessToken,
      idToken,
      refreshToken,
      role,
      fullName
    }
  }

  /**
   * Logout the current user
   *
   * Clears all authentication tokens and user information from localStorage.
   * Completes the logout process even if the API call fails.
   *
   * @returns {Promise<LogoutResponse>} Logout result
   * @throws {Error} If API request fails (but localStorage is still cleared)
   *
   * @example
   * ```typescript
   * await authService.logout()
   * // User is now logged out
   * ```
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await authApi.logout()

      // Clear localStorage regardless of API response
      this.clearLocalStorage()

      return {
        message: response.data?.message || 'Logged out'
      }
    } catch (error) {
      // Clear localStorage even if API call fails
      this.clearLocalStorage()
      throw error
    }
  }

  /**
   * Clear all authentication data from localStorage
   *
   * @private
   * @returns {void}
   */
  private clearLocalStorage(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('fullName')
    localStorage.removeItem('userEmail')
  }

  /**
   * Get the current user's role
   *
   * @returns {UserRole | null} User role (Admin, Analyst) or null if not authenticated
   *
   * @example
   * ```typescript
   * const role = authService.getUserRole()
   * if (role === 'Admin') {
   *   // Show admin features
   * }
   * ```
   */
  getUserRole(): UserRole | null {
    const role = localStorage.getItem('userRole')
    return role as UserRole | null
  }

  /**
   * Get the current user's full name
   *
   * @returns {string | null} User's full name or null if not authenticated
   *
   * @example
   * ```typescript
   * const name = authService.getFullName()
   * console.log(`Welcome, ${name}`)
   * ```
   */
  getFullName(): string | null {
    return localStorage.getItem('fullName')
  }

  /**
   * Get the current user's email address
   *
   * @returns {string | null} User's email or null if not authenticated
   *
   * @example
   * ```typescript
   * const email = authService.getEmail()
   * ```
   */
  getEmail(): string | null {
    return localStorage.getItem('userEmail')
  }

  /**
   * Check if user is currently authenticated
   *
   * @returns {boolean} True if user has a valid access token
   *
   * @example
   * ```typescript
   * if (authService.isAuthenticated()) {
   *   // Show authenticated UI
   * } else {
   *   // Show login page
   * }
   * ```
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  }

  /**
   * Get the current access token
   *
   * @returns {string | null} JWT access token or null if not authenticated
   *
   * @example
   * ```typescript
   * const token = authService.getAccessToken()
   * // Use token for API requests
   * ```
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  /**
   * Get the current ID token
   *
   * @returns {string | null} ID token or null if not authenticated
   *
   * @example
   * ```typescript
   * const idToken = authService.getIdToken()
   * ```
   */
  getIdToken(): string | null {
    return localStorage.getItem('idToken')
  }

  /**
   * Get the current refresh token
   *
   * @returns {string | null} Refresh token or null if not authenticated
   *
   * @example
   * ```typescript
   * const refreshToken = authService.getRefreshToken()
   * ```
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  /**
   * Check if user has any of the specified roles
   *
   * @param {UserRole[]} allowedRoles - Array of allowed roles to check
   * @returns {boolean} True if user has one of the allowed roles
   *
   * @example
   * ```typescript
   * if (authService.hasRole(['Admin', 'Analyst'])) {
   *   // User is either Admin or Analyst
   * }
   * ```
   */
  hasRole(allowedRoles: UserRole[]): boolean {
    const userRole = this.getUserRole()
    if (!userRole) return false
    return allowedRoles.includes(userRole)
  }

  /**
   * Check if user is an admin
   *
   * @returns {boolean} True if user role is Admin
   *
   * @example
   * ```typescript
   * if (authService.isAdmin()) {
   *   // Show admin panel
   * }
   * ```
   */
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin'
  }

  /**
   * Check if user is an analyst
   *
   * @returns {boolean} True if user role is Analyst
   *
   * @example
   * ```typescript
   * if (authService.isAnalyst()) {
   *   // Show analyst features
   * }
   * ```
   */
  isAnalyst(): boolean {
    return this.getUserRole() === 'Analyst'
  }

  /**
   * Get current user information from localStorage
   *
   * @returns {Object | null} User object with role, fullName, and email, or null if not authenticated
   * @returns {string} return.role - User role
   * @returns {string} return.fullName - User's full name
   * @returns {string} return.email - User's email
   * @returns {string} return.id - Empty string (user ID not stored for security)
   *
   * @example
   * ```typescript
   * const user = authService.getCurrentUser()
   * if (user) {
   *   console.log(`${user.fullName} (${user.role})`)
   * }
   * ```
   */
  getCurrentUser() {
    const role = this.getUserRole()
    const fullName = this.getFullName()
    const email = this.getEmail()

    if (!role || !fullName) return null

    return {
      role: role,
      fullName: fullName,
      email: email || '',
      // Note: We don't store id in localStorage for security
      // This should be fetched from API if needed
      id: ''
    }
  }
}

export const authService = new AuthService()
