import React from 'react'
import { Link } from 'react-router-dom'
import { RegisterForm } from '@/components/auth'

const RegisterPage: React.FC = () => {
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
            <span className='text-xl font-bold tracking-tight'>RAG Financial Analysis</span>
          </div>

          <div className='max-w-md'>
            <h1 className='text-4xl font-bold leading-tight mb-4'>Join Our Research Platform</h1>
            <p className='text-lg text-white/80 leading-relaxed'>
              Create your account to access comprehensive financial analysis tools and institutional datasets designed
              for academic research.
            </p>
          </div>

          <div className='text-sm text-white/60'>© 2026 RAG Financial Analysis. All rights reserved.</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className='flex flex-1 flex-col items-center justify-center bg-white dark:bg-[#101622] px-6 py-12 lg:px-20'>
        {/* Mobile Header Only */}
        <div className='lg:hidden absolute top-8 left-8 flex items-center gap-2'>
          <div className='size-6 text-[#0f49bd]'>
            <Logo />
          </div>
          <span className='text-lg font-bold text-[#101622] dark:text-white'>RAG Financial Analysis</span>
        </div>

        <div className='w-full max-w-md'>
          {/* Back link */}
          <Link to='/' className='inline-block mb-6 text-sm font-semibold text-[#0f49bd] hover:underline'>
            ← Back to Home
          </Link>

          <div className='mb-10'>
            <h2 className='text-[#0d121b] dark:text-white text-[32px] font-bold leading-tight'>Create Account</h2>
            <p className='text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal mt-2'>
              Join our financial analysis platform
            </p>
          </div>

          {/* Registration Form */}
          <RegisterForm />

          {/* Support */}
          <div className='mt-12 flex flex-col items-center gap-4'>
            <p className='text-sm text-[#4c669a] dark:text-gray-400'>
              Already have an account?{' '}
              <Link to='/login' className='text-[#0f49bd] font-semibold hover:underline'>
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className='mt-auto pt-8 flex gap-6 text-xs text-[#4c669a] dark:text-gray-500 uppercase tracking-widest font-semibold'>
          <Link className='hover:text-[#0f49bd] transition-colors' to='#'>
            Privacy Policy
          </Link>
          <Link className='hover:text-[#0f49bd] transition-colors' to='#'>
            Terms of Service
          </Link>
          <Link className='hover:text-[#0f49bd] transition-colors' to='#'>
            Security
          </Link>
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

export default RegisterPage
