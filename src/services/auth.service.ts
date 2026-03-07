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
    const response = await axiosInstance.post('/Auth/register', data)
    return response.data
  }

  // Verify account with confirmation code
  async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
    const response = await axiosInstance.post('/Auth/verify-account', data)
    return response.data
  }

  // Login user
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/Auth/login', data)
    const { AccessToken, IdToken, RefreshToken, Role, FullName } = response.data

    // Save tokens and user info to localStorage
    if (AccessToken) {
      localStorage.setItem('accessToken', AccessToken)
    }
    if (IdToken) {
      localStorage.setItem('idToken', IdToken)
    }
    if (RefreshToken) {
      localStorage.setItem('refreshToken', RefreshToken)
    }
    if (Role) {
      localStorage.setItem('userRole', Role)
    }
    if (FullName) {
      localStorage.setItem('fullName', FullName)
    }

    return response.data
  }

  // Logout user
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await axiosInstance.post('/Auth/logout')

      // Clear localStorage regardless of API response
      this.clearLocalStorage()

      return response.data
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

    if (!role || !fullName) return null

    return {
      Role: role,
      FullName: fullName,
      // Note: We don't store Id and Email in localStorage for security
      // These should be fetched from API if needed
      Id: '',
      Email: ''
    }
  }
}

export default new AuthService()
