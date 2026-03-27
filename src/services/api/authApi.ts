import axiosInstance from '@/lib/axios'
import type {
  RegisterRequest,
  LoginRequest,
  VerifyAccountRequest,
  RegisterResponse,
  LoginResponse,
  VerifyAccountResponse,
  LogoutResponse
} from '@/types/auth.types'

/**
 * Auth API module - Pure API communication with no business logic
 */
export const authApi = {
  register: (data: RegisterRequest) => axiosInstance.post<RegisterResponse>('/api/Auth/register', data),

  verifyAccount: (data: VerifyAccountRequest) =>
    axiosInstance.post<VerifyAccountResponse>('/api/Auth/verify-account', data),

  login: (data: LoginRequest) => axiosInstance.post<LoginResponse>('/api/Auth/login', data),

  logout: () => axiosInstance.post<LogoutResponse>('/api/Auth/logout')
}
