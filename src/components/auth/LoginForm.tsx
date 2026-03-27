import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthActions } from '@/hooks'
import type { LoginRequest } from '@/types'

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoggingIn, error, clearError } = useAuthActions()

  // Get email from navigation state if available
  const emailFromState = location.state?.email || ''
  const wasVerified = location.state?.verified || false

  const [formData, setFormData] = useState<LoginRequest>({
    email: emailFromState,
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await login(formData)

    if (result.success) {
      // Redirect based on role
      const from = location.state?.from?.pathname || getDefaultRoute(result.role)
      navigate(from, { replace: true })
    }
  }

  const getDefaultRoute = (role?: string) => {
    switch (role) {
      case 'Admin':
        return '/admin'
      case 'Analyst':
        return '/chat'
      default:
        return '/chat'
    }
  }

  const isFormValid = formData.email && formData.password

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-6'>Đăng nhập</h2>

      {wasVerified && (
        <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded'>
          Tài khoản đã được xác thực thành công! Bây giờ bạn có thể đăng nhập.
        </div>
      )}

      {error && <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='Email' className='block text-sm font-medium text-gray-700 mb-1'>
            Email
          </label>
          <input
            type='email'
            id='Email'
            name='Email'
            value={formData.email}
            onChange={handleInputChange}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Nhập email'
          />
        </div>

        <div>
          <label htmlFor='Password' className='block text-sm font-medium text-gray-700 mb-1'>
            Mật khẩu
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='Password'
              name='Password'
              value={formData.password}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Nhập mật khẩu'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-2 text-gray-500 hover:text-gray-700'
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              id='rememberMe'
              type='checkbox'
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label htmlFor='rememberMe' className='ml-2 block text-sm text-gray-700'>
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button
            type='button'
            onClick={() => {
              // TODO: Implement forgot password
              alert('Tính năng quên mật khẩu sẽ được triển khai sau')
            }}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type='submit'
          disabled={!isFormValid || isLoggingIn}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className='mt-4 text-center'>
        <p className='text-sm text-gray-600'>
          Chưa có tài khoản?{' '}
          <button onClick={() => navigate('/register')} className='text-blue-600 hover:text-blue-800 font-medium'>
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  )
}
