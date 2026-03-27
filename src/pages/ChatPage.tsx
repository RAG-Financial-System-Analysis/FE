import { ChatInterface } from '@/components/chat'
import { useAuth } from '@/context'
import { Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout'

// Wrapper component for ChatInterface in ChatPage context
const ChatPageInterface: React.FC = () => {
  return (
    <div className='h-full'>
      <ChatInterface />
    </div>
  )
}

const ChatPage: React.FC = () => {
  const { isAuthenticated, hasRole, fullName } = useAuth()

  // Check if user is authenticated and has Analyst or Admin role
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (!hasRole(['Analyst', 'Admin'])) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='text-red-500 mb-4'>
            <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>Không có quyền truy cập</h2>
          <p className='text-gray-600 mb-4'>Bạn cần có quyền Analyst hoặc Admin để sử dụng tính năng Chat</p>
          <button onClick={() => window.history.back()} className='text-blue-600 hover:text-blue-800 font-medium'>
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-outfit'>
      <Sidebar />

      <main className='flex-1 ml-64'>
        {/* Header */}
        <div className='bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/60 px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                  />
                </svg>
              </div>
              <div className='flex items-center gap-3'>
                <div>
                  <h1 className='text-xl font-bold text-slate-900'>AI Assistant Chat</h1>
                  <span className='text-xs text-slate-500'>Phân tích báo cáo tài chính thông minh</span>
                </div>
                <span className='px-2 py-0.5 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full font-medium border border-blue-200'>
                  Analyst Tool
                </span>
              </div>
            </div>

            <div className='text-sm text-slate-600 bg-white/60 px-3 py-2 rounded-lg border border-slate-200'>
              Xin chào, <span className='font-semibold text-slate-800'>{fullName}</span>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className='h-full' style={{ height: 'calc(100vh - 5rem)' }}>
          <ChatPageInterface />
        </div>
      </main>
    </div>
  )
}

export default ChatPage
