import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000, // 20 seconds default timeout - safe for API Gateway
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add API key if available
    if (API_KEY) {
      config.headers['X-API-Key'] = API_KEY
    }

    // Add access token if available
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Clear tokens and redirect to login
      // Note: The backend doesn't have a refresh token endpoint in the API spec
      // So we just clear tokens and redirect to login
      localStorage.removeItem('accessToken')
      localStorage.removeItem('idToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('fullName')

      // Only redirect if we're not already on a public route
      const currentPath = window.location.pathname
      const publicRoutes = ['/login', '/register', '/verify-account', '/']

      if (!publicRoutes.includes(currentPath)) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
