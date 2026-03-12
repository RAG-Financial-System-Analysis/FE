import axiosInstance from '@/lib/axios'
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

class AuthService {
  // Register new user
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosInstance.post('/api/Auth/register', data)
    return {
      message: response.data.message,
      userId: response.data.userId
    }
  }

  // Verify account with confirmation code
  async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
    const response = await axiosInstance.post('/api/Auth/verify-account', data)
    return {
      message: response.data.message
    }
  }

  // Login user
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/api/Auth/login', data)

    // Extract response data (API returns camelCase)
    const accessToken = response.data.accessToken
    const idToken = response.data.idToken
    const refreshToken = response.data.refreshToken
    const role = response.data.role
    const fullName = response.data.fullName
    const email = response.data.email || data.email // Use email from response or fallback to login email

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

  // Logout user
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await axiosInstance.post('/api/Auth/logout')

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

  // Clear all auth data from localStorage
  private clearLocalStorage(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('fullName')
    localStorage.removeItem('userEmail')
  }

  // Get current user role
  getUserRole(): UserRole | null {
    const role = localStorage.getItem('userRole')
    return role as UserRole | null
  }

  // Get full name
  getFullName(): string | null {
    return localStorage.getItem('fullName')
  }

  // Get email
  getEmail(): string | null {
    return localStorage.getItem('userEmail')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  // Get ID token
  getIdToken(): string | null {
    return localStorage.getItem('idToken')
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  // Check if user has specific role
  hasRole(allowedRoles: UserRole[]): boolean {
    const userRole = this.getUserRole()
    if (!userRole) return false
    return allowedRoles.includes(userRole)
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin'
  }

  // Check if user is analyst
  isAnalyst(): boolean {
    return this.getUserRole() === 'Analyst'
  }

  // Get current user info from localStorage
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

export default new AuthService()
