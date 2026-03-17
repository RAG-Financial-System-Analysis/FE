import { useState } from 'react'
import { Eye, EyeOff, HelpCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import authService from '@/services/auth.service'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login({ email: email, password: password })

      // Update auth context with correct parameters
      login(response.accessToken, response.idToken, response.refreshToken, response.role, response.fullName)

      // Redirect based on role
      if (response.role === 'Admin') {
        navigate('/admin')
      } else if (response.role === 'Analyst') {
        navigate('/analyst')
      } else {
        // Fallback for other roles
        navigate('/analyst')
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f6f6f8] dark:bg-[#101622] font-['Inter']">
      {/* LEFT PANEL */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0f49bd]'>
        <div
          className='absolute inset-0 z-0 bg-center bg-no-repeat bg-cover opacity-60'
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6MbNSQMvnZBIz4We2G-qWyom0csBeeUtr3lDzyLJUMbvJJ7BuRI0U4WaMGP5ILr_-6jQhiogoEdQRJFpzYyPgt7mKJjjmnfgx5wlL9fgxs8goq6V7Qpm1Fh3tHeuMmR4rVuPLjopu1jqsN5J7jKjtJXOF0L7D3aIX9PdWR71A46fLeEH13UgLg8v_MsnkR69IerCSIHZIU7kFE8QKrbggnMuh02ofaFLGIP5lh-T-gcv8vUhue8sYJ0GklZoWvCsbkaigbgI6KVC_")'
          }}
        />
        <div className='absolute inset-0 z-10 bg-gradient-to-br from-[#0f49bd]/80 to-[#101622]/90' />

        <div className='relative z-20 flex flex-col justify-between p-12 text-white w-full'>
          <div className='flex items-center gap-3'>
            <div className='size-8'>
              <Logo />
            </div>
            <span className='text-xl font-bold tracking-tight'>Analyst Portal</span>
          </div>

          <div className='max-w-md'>
            <h1 className='text-4xl font-bold leading-tight mb-4'>Precision in Financial Evaluation</h1>
            <p className='text-lg text-white/80 leading-relaxed'>
              Access comprehensive ratio-based analysis tools and institutional corporate datasets designed for academic
              financial research.
            </p>
          </div>

          <div className='text-sm text-white/60'>© 2026 Financial Analysis. All rights reserved.</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className='flex flex-1 flex-col items-center justify-center bg-white dark:bg-[#101622] px-6 py-12 lg:px-20'>
        {/* Mobile Header Only */}
        <div className='lg:hidden absolute top-8 left-8 flex items-center gap-2'>
          <div className='size-6 text-[#0f49bd]'>
            <Logo />
          </div>
          <span className='text-lg font-bold text-[#101622] dark:text-white'>Analyst Portal</span>
        </div>

        <div className='w-full max-w-md'>
          {/* add: simple back link for testing */}
          <a href='/' className='inline-block mb-6 text-sm font-semibold text-[#0f49bd] hover:underline'>
            ← Back to Home
          </a>

          <div className='mb-10'>
            <h2 className='text-[#0d121b] dark:text-white text-[32px] font-bold leading-tight'>Welcome Back</h2>
            <p className='text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal mt-2'>
              Access your academic financial tools
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
              <p className='text-sm text-red-800'>{error}</p>
            </div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Email */}
            <div className='flex flex-col'>
              <label className='text-[#0d121b] dark:text-white text-base font-medium leading-normal pb-2'>
                Institutional Email
              </label>
              <input
                type='email'
                autoComplete='email'
                placeholder='name@university.edu'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-1 focus:ring-[#0f49bd] border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622]/50 h-14 placeholder:text-[#4c669a] p-[15px] text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </div>

            {/* Password */}
            <div className='flex flex-col'>
              <label className='text-[#0d121b] dark:text-white text-base font-medium leading-normal pb-2'>
                Password
              </label>
              <div className='flex w-full flex-1 items-stretch rounded-lg group'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-1 focus:ring-[#0f49bd] border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622]/50 h-14 placeholder:text-[#4c669a] p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                  className='text-[#4c669a] flex border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622]/50 items-center justify-center pr-[15px] pl-3 rounded-r-lg border-l-0 cursor-pointer hover:text-[#0f49bd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {showPassword ? <EyeOff className='w-[18px] h-[18px]' /> : <Eye className='w-[18px] h-[18px]' />}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' className='size-4 rounded border-gray-300 text-[#0f49bd] focus:ring-[#0f49bd]' />
                <span className='text-sm text-[#4c669a] dark:text-gray-400 font-medium'>Remember me</span>
              </label>
              <a href='#' className='text-sm font-semibold text-[#0f49bd] hover:underline'>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className='flex w-full items-center justify-center overflow-hidden rounded-lg h-14 px-6 bg-[#0f49bd] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-[#0f49bd]/20 hover:bg-[#0f49bd]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin mr-2' />
                  Signing in...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Support */}
          <div className='mt-12 flex flex-col items-center gap-4'>
            <p className='text-sm text-[#4c669a] dark:text-gray-400'>
              Don't have an account?{' '}
              <a href='/register' className='text-[#0f49bd] font-semibold hover:underline'>
                Sign up here
              </a>
            </p>
            <p className='text-sm text-[#4c669a] dark:text-gray-400'>Issues with your credentials?</p>
            <button className='flex items-center gap-2 px-6 py-2 border border-[#cfd7e7] dark:border-gray-700 rounded-full text-sm font-semibold text-[#0d121b] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors'>
              <HelpCircle className='w-[18px] h-[18px] text-[#4c669a]' />
              Institutional Access Support
            </button>
          </div>
        </div>

        <div className='mt-auto pt-8 flex gap-6 text-xs text-[#4c669a] dark:text-gray-500 uppercase tracking-widest font-semibold'>
          <a className='hover:text-[#0f49bd] transition-colors' href='#'>
            Privacy Policy
          </a>
          <a className='hover:text-[#0f49bd] transition-colors' href='#'>
            Terms of Service
          </a>
          <a className='hover:text-[#0f49bd] transition-colors' href='#'>
            Security
          </a>
        </div>
      </div>
    </div>
  )
}

/* Logo component */
function Logo() {
  return (
    <svg viewBox='0 0 48 48' fill='currentColor' aria-hidden='true'>
      <path d='M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z' />
    </svg>
  )
}
