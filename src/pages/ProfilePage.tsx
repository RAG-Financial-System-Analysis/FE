import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, Clock, ArrowLeft, LogOut, Edit3, CheckCircle, ChevronRight } from 'lucide-react'
import { Sidebar } from '@/components/layout'
import { useAuth } from '@/context'
import { Button } from '@/components/ui'

const ProfilePage = () => {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  const isAdmin = role === 'Admin'
  const roleLabel = isAdmin ? 'Administrator' : 'Analyst'

  const stats = [
    { label: 'Role', value: roleLabel, icon: <Shield size={18} className='text-blue-500' />, bg: 'bg-blue-50' },
    {
      label: 'Status',
      value: 'Active',
      icon: <CheckCircle size={18} className='text-emerald-500' />,
      bg: 'bg-emerald-50'
    },
    { label: 'Joined', value: 'March 2026', icon: <Clock size={18} className='text-amber-500' />, bg: 'bg-amber-50' }
  ]

  const info = [
    { label: 'Full Name', value: user?.fullName ?? '–', icon: <User size={15} className='text-gray-400' /> },
    { label: 'Email Address', value: user?.email ?? '–', icon: <Mail size={15} className='text-gray-400' /> }
  ]

  return (
    <div className='flex min-h-screen bg-slate-50 font-outfit'>
      <Sidebar />

      <main className='flex-1 ml-64 p-8 xl:p-12 max-w-3xl'>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-8 text-sm font-medium group'
        >
          <ArrowLeft size={16} className='group-hover:-translate-x-0.5 transition-transform' />
          Back
        </button>

        {/* ── Hero card ── */}
        <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 md:p-10 shadow-2xl shadow-blue-200 mb-6'>
          {/* Decorative blobs (Tailwind) */}
          <div className='absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none' />
          <div className='absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none' />

          <div className='relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6'>
            {/* Avatar */}
            <div className='w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shrink-0'>
              {initials}
            </div>

            {/* Info */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-wrap items-center gap-3 mb-1.5'>
                <h1 className='text-2xl md:text-3xl font-extrabold text-white truncate'>
                  {user?.fullName ?? 'Analyst'}
                </h1>
                <span className='px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30'>
                  {roleLabel}
                </span>
              </div>
              <p className='text-blue-100 text-sm flex items-center gap-2'>
                <Mail size={13} />
                {user?.email ?? 'No email on record'}
              </p>
            </div>

            {/* Edit button */}
            <button className='shrink-0 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-sm font-semibold text-white transition-colors'>
              <Edit3 size={14} />
              Edit
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          {stats.map((s) => (
            <div
              key={s.label}
              className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4'
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
              <div className='min-w-0'>
                <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider truncate'>{s.label}</p>
                <p className='text-sm font-bold text-gray-900 truncate mt-0.5'>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Account Details ── */}
        <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6'>
          <h3 className='text-sm font-bold text-gray-900 mb-5 flex items-center gap-2'>
            <User size={16} className='text-blue-500' />
            Account Details
          </h3>
          <div className='divide-y divide-gray-50'>
            {info.map((row) => (
              <div key={row.label} className='flex items-center justify-between py-4'>
                <div className='flex items-center gap-2 text-sm text-gray-400 font-medium'>
                  {row.icon}
                  {row.label}
                </div>
                <span className='text-sm font-semibold text-gray-800 text-right'>{row.value}</span>
              </div>
            ))}
            <div className='flex items-center justify-between py-4'>
              <div className='flex items-center gap-2 text-sm text-gray-400 font-medium'>
                <Shield size={15} className='text-gray-400' />
                Role
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
              >
                {roleLabel}
              </span>
            </div>
            <div className='flex items-center justify-between py-4'>
              <div className='flex items-center gap-2 text-sm text-gray-400 font-medium'>
                <CheckCircle size={15} className='text-gray-400' />
                Account Status
              </div>
              <div className='flex items-center gap-1.5 text-emerald-600 text-sm font-semibold'>
                <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                Active
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation shortcuts ── */}
        <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6'>
          <h3 className='text-sm font-bold text-gray-900 mb-4'>Quick Navigation</h3>
          {[
            { label: 'AI Chat', path: '/chat' },
            { label: 'View Reports', path: '/report' }
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className='flex items-center justify-between w-full py-3.5 border-b border-gray-50 last:border-0 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group'
            >
              {link.label}
              <ChevronRight size={15} className='text-gray-300 group-hover:text-blue-400 transition-colors' />
            </button>
          ))}
        </div>

        {/* ── Logout ── */}
        <Button
          onClick={handleLogout}
          variant='outline'
          className='w-full h-12 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 font-bold flex items-center gap-2 justify-center text-sm transition-colors'
        >
          <LogOut size={17} />
          Sign Out
        </Button>
      </main>
    </div>
  )
}

export default ProfilePage
