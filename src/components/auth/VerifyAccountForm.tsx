import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthActions } from '@/hooks/useAuthActions'
import type { VerifyAccountRequest } from '@/types/auth.types'

export const VerifyAccountForm: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyAccount, isVerifying, error, clearError } = useAuthActions()

  // Get email from navigation state or allow manual input
  const emailFromState = location.state?.email || ''

  const [formData, setFormData] = useState<VerifyAccountRequest>({
    Email: emailFromState,
    Code: ''
  })

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

    const result = await verifyAccount(formData)

    if (result.success) {
      setSuccessMessage(result.message)
      // Navigate to login page after 2 seconds
      setTimeout(() => {
        navigate('/login', {
          state: { email: formData.Email, verified: true }
        })
      }, 2000)
    }
  }

  const isFormValid = formData.Email && formData.Code

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-6'>Xác thực tài khoản</h2>

      <div className='mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded'>
        <p className='text-sm'>
          Chúng tôi đã gửi mã xác thực đến email của bạn. Vui lòng kiểm tra hộp thư và nhập mã xác thực bên dưới.
        </p>
      </div>

      {successMessage && (
        <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded'>{successMessage}</div>
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
            value={formData.Email}
            onChange={handleInputChange}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Nhập email'
          />
        </div>

        <div>
          <label htmlFor='Code' className='block text-sm font-medium text-gray-700 mb-1'>
            Mã xác thực
          </label>
          <input
            type='text'
            id='Code'
            name='Code'
            value={formData.Code}
            onChange={handleInputChange}
            required
            maxLength={6}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest'
            placeholder='123456'
          />
          <p className='text-xs text-gray-500 mt-1'>Nhập mã 6 số từ email xác thực</p>
        </div>

        <button
          type='submit'
          disabled={!isFormValid || isVerifying}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isVerifying ? 'Đang xác thực...' : 'Xác thực tài khoản'}
        </button>
      </form>

      <div className='mt-4 text-center space-y-2'>
        <p className='text-sm text-gray-600'>
          Không nhận được mã?{' '}
          <button
            onClick={() => {
              // TODO: Implement resend verification code
              alert('Tính năng gửi lại mã sẽ được triển khai sau')
            }}
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            Gửi lại mã
          </button>
        </p>

        <p className='text-sm text-gray-600'>
          <button onClick={() => navigate('/login')} className='text-blue-600 hover:text-blue-800 font-medium'>
            Quay lại đăng nhập
          </button>
        </p>
      </div>
    </div>
  )
}
