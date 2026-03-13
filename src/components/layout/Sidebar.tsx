import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, LogOut, FileBarChart, User, Bot, BarChart3 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onViewChange?: (view: 'chat' | 'analytics') => void
  currentView?: 'chat' | 'analytics'
}

const Sidebar: React.FC<SidebarProps> = ({ onViewChange, currentView }) => {
  const { logout, user, hasRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleItemClick = (item: any) => {
    console.log('Item clicked:', item.label, 'viewType:', item.viewType, 'currentPath:', location.pathname) // Debug log

    // If clicking Create Analytics
    if (item.viewType === 'analytics') {
      if (location.pathname === '/chat') {
        // Already on chat page, just switch view
        console.log('Switching to analytics view') // Debug log
        onViewChange?.('analytics')
      } else {
        // Navigate to chat page first, then switch view will happen via useEffect
        console.log('Navigating to /chat with analytics view') // Debug log
        navigate('/chat?view=analytics')
      }
    }
    // If clicking AI Chat
    else if (item.path === '/chat' && !item.viewType) {
      if (location.pathname === '/chat') {
        // Already on chat page, just switch to chat view
        console.log('Switching to chat view') // Debug log
        onViewChange?.('chat')
      } else {
        // Navigate to chat page
        console.log('Navigating to /chat') // Debug log
        navigate('/chat')
      }
    }
    // Other items - navigate normally
    else {
      console.log('Navigating to:', item.path) // Debug log
      navigate(item.path)
    }
  }

  const isItemActive = (item: any) => {
    if (location.pathname === '/chat') {
      if (item.path === '/chat' && currentView === 'chat') return true
      if (item.viewType === 'analytics' && currentView === 'analytics') return true
      return false
    }
    return location.pathname === item.path
  }

  const menuItems = [
    // Dashboard - only for Admin
    ...(hasRole(['Admin'])
      ? [
          {
            label: 'Dashboard',
            icon: <LayoutDashboard size={20} />,
            path: '/dashboard'
          }
        ]
      : []),
    // Chat feature - only for Analyst and Admin
    ...(hasRole(['Analyst', 'Admin'])
      ? [
          {
            label: 'AI Chat',
            icon: <Bot size={20} />,
            path: '/chat'
          }
        ]
      : []),
    {
      label: 'Report',
      icon: <FileBarChart size={20} />,
      path: '/report'
    },
    // Create Analytics - only for Analyst and Admin
    ...(hasRole(['Analyst', 'Admin'])
      ? [
          {
            label: 'Create Analytics',
            icon: <BarChart3 size={20} />,
            path: '/chat',
            viewType: 'analytics'
          }
        ]
      : [])
  ]

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <aside className='w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20'>
      <div className='p-6'>
        {/* Logo / Brand */}
        <div className='flex items-center gap-2 mb-8'>
          <div className='w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center'>
            <span className='text-white font-bold text-xs'>FS</span>
          </div>
          <h1 className='text-sm font-bold text-gray-700'>Financial Analyzer</h1>
        </div>

        {/* Analyst Avatar - Clickable → Profile */}
        <button
          onClick={() => navigate('/profile')}
          className='flex items-center gap-3 mb-8 px-2 w-full rounded-xl py-2 hover:bg-gray-50 transition-colors group text-left'
        >
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0'>
            {initials}
          </div>
          <div className='flex-1 overflow-hidden'>
            <span className='font-semibold text-gray-700 text-sm truncate block'>{user?.fullName || 'Analyst'}</span>
            <span className='text-[10px] text-gray-400 group-hover:text-blue-500 transition-colors'>
              View Profile →
            </span>
          </div>
          <User size={15} className='text-gray-300 group-hover:text-blue-400 transition-colors shrink-0' />
        </button>

        <nav className='space-y-1'>
          {menuItems.map((item) => {
            const isActive = isItemActive(item)
            return (
              <button
                key={`${item.path}-${item.viewType || 'default'}`}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm',
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 active:bg-gray-100'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && <div className='ml-auto w-1.5 h-1.5 rounded-full bg-blue-600' />}
              </button>
            )
          })}
        </nav>
      </div>

      <div className='mt-auto p-6 border-t border-gray-100'>
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className='flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm group'
        >
          <LogOut size={20} className='group-hover:translate-x-1 transition-transform' />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
