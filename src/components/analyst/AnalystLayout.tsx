import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'
import { BarChart3, MessageSquare, FileText, User, LogOut, Menu, X } from 'lucide-react'
import { ChatInterface } from '@/components/chat/ChatInterface'

type AnalystView = 'chat' | 'reports'

interface AnalystLayoutProps {
  defaultView?: AnalystView
}

const AnalystLayout: React.FC<AnalystLayoutProps> = ({ defaultView = 'chat' }) => {
  const { isAuthenticated, hasRole, fullName, logout } = useAuth()
  const [currentView, setCurrentView] = useState<AnalystView>(defaultView)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check if analyst is authenticated and has Analyst or Admin role
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
          <p className='text-gray-600 mb-4'>Bạn cần có quyền Analyst hoặc Admin để sử dụng tính năng này</p>
          <button onClick={() => window.history.back()} className='text-blue-600 hover:text-blue-800 font-medium'>
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  const navigationItems = [
    {
      id: 'chat' as AnalystView,
      name: 'AI Assistant',
      icon: MessageSquare,
      description: 'Trợ lý AI'
    },
    {
      id: 'reports' as AnalystView,
      name: 'Reports',
      icon: FileText,
      description: 'Báo cáo tài chính'
    }
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return (
          <div className='h-full'>
            <ChatInterface />
          </div>
        )
      case 'reports':
        return (
          <div className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>Reports</h2>
            <p className='text-gray-600'>Báo cáo tài chính sẽ được hiển thị ở đây.</p>
          </div>
        )
      default:
        // Default to chat
        return (
          <div className='h-full'>
            <ChatInterface />
          </div>
        )
    }
  }

  return (
    <div className='flex min-h-screen bg-slate-50'>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-slate-900 bg-opacity-20 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <BarChart3 className='w-5 h-5 text-white' />
            </div>
            <span className='font-bold text-slate-900'>RAG Analyst</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className='lg:hidden p-1 text-slate-400 hover:text-slate-600'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <nav className='p-4 space-y-2'>
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Analyst info */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-slate-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-slate-900 truncate'>{fullName}</p>
              <p className='text-xs text-slate-500'>Analyst</p>
            </div>
          </div>
          <button
            onClick={logout}
            className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors'
          >
            <LogOut className='w-4 h-4' />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Mobile header */}
        <div className='lg:hidden bg-white border-b border-slate-200 px-4 py-3'>
          <div className='flex items-center justify-between'>
            <button onClick={() => setSidebarOpen(true)} className='p-2 text-slate-400 hover:text-slate-600'>
              <Menu className='w-5 h-5' />
            </button>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-blue-600 rounded flex items-center justify-center'>
                <BarChart3 className='w-4 h-4 text-white' />
              </div>
              <span className='font-semibold text-slate-900'>RAG Analyst</span>
            </div>
            <div className='w-9' /> {/* Spacer */}
          </div>
        </div>

        {/* Content */}
        <main className='flex-1 overflow-auto'>{renderContent()}</main>
      </div>
    </div>
  )
}

export default AnalystLayout
