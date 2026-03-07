import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthActions } from '@/hooks/useAuthActions'
import type { RegisterRequest } from '@/types/auth.types'

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const { register, isRegistering, error, clearError } = useAuthActions()

  const [formData, setFormData] = useState<RegisterRequest>({
    Email: '',
    Password: '',
    FullName: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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

    const result = await register(formData)

    if (result.success) {
      setSuccessMessage(result.message)
      // Navigate to verification page after 2 seconds
      setTimeout(() => {
        navigate('/verify-account', {
          state: { email: formData.Email }
        })
      }, 2000)
    }
  }

  const isFormValid = formData.Email && formData.Password && formData.FullName

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-6'>Đăng ký tài khoản</h2>

      {successMessage && (
        <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded'>{successMessage}</div>
      )}

      {error && <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='FullName' className='block text-sm font-medium text-gray-700 mb-1'>
            Họ và tên
          </label>
          <input
            type='text'
            id='FullName'
            name='FullName'
            value={formData.FullName}
            onChange={handleInputChange}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Nhập họ và tên'
          />
        </div>

        <div>
          <label htmlFor='Email' className='block text-sm font-medium text-gray-700 mb-1'>
            Email
          </label>
          <input
            type='email'
            id='Email'
            name='Email'
            value={formData.Email}
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
              value={formData.Password}
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
          <p className='text-xs text-gray-500 mt-1'>
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
          </p>
        </div>

        <button
          type='submit'
          disabled={!isFormValid || isRegistering}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isRegistering ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      <div className='mt-4 text-center'>
        <p className='text-sm text-gray-600'>
          Đã có tài khoản?{' '}
          <button onClick={() => navigate('/login')} className='text-blue-600 hover:text-blue-800 font-medium'>
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  )
}
