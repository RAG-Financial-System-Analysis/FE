import axiosInstance from '@/lib/axios'

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

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  testRole: string
  message?: string
}

export interface RegisterResponse {
  message: string
  userId: string
}

export interface VerifyAccountResponse {
  message: string
}

class AuthService {
  // Register new user
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosInstance.post('/Auth/register', data)
    return response.data
  }

  // Login user
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/Auth/login', data)
    const { accessToken, refreshToken, testRole } = response.data

    // Save tokens and role to localStorage
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
    if (testRole) {
      localStorage.setItem('userRole', testRole)
    }

    return response.data
  }

  // Verify account with code
  async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
    const response = await axiosInstance.post('/Auth/verify-account', data)
    return response.data
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
  }

  // Get current user role
  getUserRole(): string | null {
    return localStorage.getItem('userRole')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  // Test role-based access
  async testAdminAccess(): Promise<any> {
    const response = await axiosInstance.get('/TestRole/admin-only')
    return response.data
  }
}

export default new AuthService()
