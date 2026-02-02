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

export type UserRole = 'Admin' | 'Source' | 'Provider' | 'Analyst' | 'Member'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  role: UserRole
  fullName: string
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
    const { accessToken, refreshToken, role, fullName } = response.data

    // Save tokens, role and fullName to localStorage
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
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
    localStorage.removeItem('fullName')
  }

  // Get current user role
  getUserRole(): UserRole | null {
    return localStorage.getItem('userRole') as UserRole | null
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
}

export default new AuthService()
