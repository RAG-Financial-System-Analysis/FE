import React from 'react'
import { Link } from 'react-router-dom'
import { RegisterForm } from '@/components/auth/RegisterForm'

const RegisterPage: React.FC = () => {
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
            RAG Financial Analysis
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
          {/* Header Section */}
          <div className='p-8 pb-0'>
            <div className='text-center mb-6'>
              <h1 className='text-primary dark:text-white text-2xl font-bold mb-2'>Tạo tài khoản mới</h1>
              <p className='text-gray-500 dark:text-gray-400'>Đăng ký để sử dụng hệ thống phân tích tài chính RAG</p>
            </div>
          </div>

          {/* Registration Form */}
          <div className='p-8 pt-0'>
            <RegisterForm />
          </div>

          {/* Footer */}
          <div className='bg-gray-50 dark:bg-gray-800/50 p-6 text-center border-t border-gray-100 dark:border-gray-800'>
            <p className='text-primary/80 dark:text-gray-400 text-xs font-normal leading-relaxed max-w-sm mx-auto'>
              Bằng việc tạo tài khoản, bạn đồng ý với{' '}
              <Link to='#' className='underline text-primary hover:text-blue-700'>
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link to='#' className='underline text-primary hover:text-blue-700'>
                Chính sách bảo mật
              </Link>{' '}
              của chúng tôi.
            </p>
          </div>
        </div>
      </main>

      {/* Support Footer */}
      <footer className='p-6 text-center'>
        <p className='text-gray-400 text-xs'>© 2026 RAG Financial Analysis System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default RegisterPage
