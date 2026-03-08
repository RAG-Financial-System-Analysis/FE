import type { ReactNode } from 'react'
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface AdminLayoutProps {
  children: ReactNode
  activeMenu: string
  onMenuChange: (menu: string) => void
}

const AdminLayout = ({ children, activeMenu, onMenuChange }: AdminLayoutProps) => {
  const navigate = useNavigate()
  const { logout, fullName } = useAuth()
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'User Management', icon: Users },
    { name: 'Audit Logs', icon: FileText },
    { name: 'System Config', icon: Settings }
  ]

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='w-64 bg-white border-r border-gray-200 flex flex-col'>
        {/* Logo */}
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
              <LayoutDashboard className='w-6 h-6 text-white' />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className='flex-1 p-4'>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => onMenuChange(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeMenu === item.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span className='font-medium'>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className='p-4 border-t border-gray-200'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
            <div className='flex-1'>
              <div className='text-sm font-medium text-gray-900'>{fullName || 'Admin'}</div>
              <div className='text-xs text-gray-500'>Admin</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className='w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors'
          >
            <LogOut className='w-4 h-4' />
            <span className='text-sm font-medium'>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>{children}</div>
    </div>
  )
}

export default AdminLayout
