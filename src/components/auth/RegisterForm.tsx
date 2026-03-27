import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { useAuthActions } from '@/hooks'
import type { RegisterRequest } from '@/types'

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const { register, isRegistering, error, clearError } = useAuthActions()

  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    fullName: ''
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
          state: { email: formData.email }
        })
      }, 2000)
    }
  }

  const isFormValid = formData.email && formData.password && formData.fullName

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3'>
          <CheckCircle className='w-5 h-5 text-green-600 shrink-0 mt-0.5' />
          <p className='text-sm text-green-800'>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
          <p className='text-sm text-red-800'>{error}</p>
        </div>
      )}

      <form className='space-y-6' onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className='flex flex-col'>
          <label className='text-[#0d121b] dark:text-white text-base font-medium leading-normal pb-2'>Họ và tên</label>
          <input
            type='text'
            id='fullName'
            name='fullName'
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={isRegistering}
            placeholder='Nhập họ và tên đầy đủ'
            className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-1 focus:ring-[#0f49bd] border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622]/50 h-14 placeholder:text-[#4c669a] p-[15px] text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed'
          />
        </div>

        {/* Email */}
        <div className='flex flex-col'>
          <label className='text-[#0d121b] dark:text-white text-base font-medium leading-normal pb-2'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isRegistering}
            placeholder='name@example.com'
            className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-1 focus:ring-[#0f49bd] border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622]/50 h-14 placeholder:text-[#4c669a] p-[15px] text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed'
          />
        </div>

        {/* Password */}
        <div className='flex flex-col'>
          <label className='text-[#0d121b] dark:text-white text-base font-medium leading-normal pb-2'>Mật khẩu</label>
          <div className='flex w-full flex-1 items-stretch rounded-lg group'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isRegistering}
              placeholder='Nhập mật khẩu'
              className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-1 focus:ring-[#0f49bd] border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622]/50 h-14 placeholder:text-[#4c669a] p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed'
            />
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isRegistering}
              className='text-[#4c669a] flex border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622]/50 items-center justify-center pr-[15px] pl-3 rounded-r-lg border-l-0 cursor-pointer hover:text-[#0f49bd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {showPassword ? <EyeOff className='w-[18px] h-[18px]' /> : <Eye className='w-[18px] h-[18px]' />}
            </button>
          </div>
          <p className='text-xs text-[#4c669a] dark:text-gray-400 mt-2'>
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
          </p>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={!isFormValid || isRegistering}
          className='flex w-full items-center justify-center overflow-hidden rounded-lg h-14 px-6 bg-[#0f49bd] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-[#0f49bd]/20 hover:bg-[#0f49bd]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isRegistering ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin mr-2' />
              Đang tạo tài khoản...
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>
    </div>
  )
}
