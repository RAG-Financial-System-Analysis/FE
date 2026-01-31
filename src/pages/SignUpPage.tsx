import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, Landmark, Activity, ShieldCheck, EyeOff } from 'lucide-react'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-gray-900 dark:text-white'>
      {/* Top Navigation Bar */}
      <header className='flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-background-dark px-10 py-3'>
        <div className='flex items-center gap-4 text-primary'>
          <div className='size-8'>
            <svg fill='none' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z'
                fill='currentColor'
              ></path>
            </svg>
          </div>
          <h2 className='text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]'>
            Financial Analysis
          </h2>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-500 dark:text-gray-400 hidden sm:block'>Already have an account?</span>
          <Link to='/login'>
            <button className='flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal transition-opacity hover:opacity-90'>
              Log In
            </button>
          </Link>
          <Link to='/'>
            <button className='flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal transition-opacity hover:opacity-90'>
              Back To Home
            </button>
          </Link>
        </div>
      </header>

      {/* Main Registration Container */}
      <main className='flex-1 flex items-center justify-center p-6 md:p-12'>
        <div className='w-full max-w-[640px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden'>
          {/* Progress Bar Section */}
          <div className='flex flex-col gap-2 p-8 pb-0'>
            <div className='flex gap-6 justify-between items-end'>
              <div>
                <p className='text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1'>Step 1 of 2</p>
                <h1 className='text-primary dark:text-white text-2xl font-bold'>Create Your Academic Profile</h1>
              </div>
              <p className='text-primary text-sm font-medium'>Credentials</p>
            </div>
            <div className='mt-4 rounded-full bg-gray-100 dark:bg-gray-800 h-1.5 w-full'>
              <div className='h-1.5 rounded-full bg-primary' style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className='p-8'>
            {/* SSO Option Emphasis */}
            <div className='mb-8'>
              <button className='w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#f0f4ff] dark:bg-primary/10 text-primary border border-primary/20 gap-3 text-base font-bold transition-colors hover:bg-primary/20'>
                <Landmark className='w-6 h-6' />
                <span className='truncate'>Sign up with Institutional SSO</span>
              </button>
              <div className='relative flex py-6 items-center'>
                <div className='flex-grow border-t border-gray-200 dark:border-gray-800'></div>
                <span className='flex-shrink mx-4 text-gray-400 text-sm font-normal'>or use email</span>
                <div className='flex-grow border-t border-gray-200 dark:border-gray-800'></div>
              </div>
            </div>

            {/* Form Section (Variant 2: Step 1) */}
            <form className='space-y-5'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1'>
                  Institutional Email
                </label>
                <input
                  className='w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400'
                  placeholder='name@university.edu'
                  type='email'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1'>Create Password</label>
                <div className='relative'>
                  <input
                    className='w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 pr-12'
                    placeholder='••••••••'
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  >
                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                </div>
                <p className='text-[11px] text-gray-500 mt-1 ml-1 italic'>
                  Use at least 8 characters with a mix of letters and numbers.
                </p>
              </div>
              <div className='pt-6'>
                <button
                  className='w-full bg-primary text-white h-12 rounded-lg font-bold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer'
                  type='button'
                >
                  <span>Next: Professional Focus</span>
                  <ArrowRight className='w-5 h-5' />
                </button>
              </div>
            </form>
          </div>

          {/* Meta Footer */}
          <div className='bg-gray-50 dark:bg-gray-800/50 p-6 text-center border-t border-gray-100 dark:border-gray-800'>
            <p className='text-primary/80 dark:text-gray-400 text-xs font-normal leading-relaxed max-w-sm mx-auto'>
              By creating an account, you agree to FinAnalytica's{' '}
              <Link to='#' className='underline text-primary hover:text-blue-700'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to='#' className='underline text-primary hover:text-blue-700'>
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Support Footer */}
      <footer className='p-6 text-center'>
        <p className='text-gray-400 text-xs'>© 2026 Financial Analysis. Trust Me Bro.</p>
      </footer>
    </div>
  )
}

export default SignUpPage
