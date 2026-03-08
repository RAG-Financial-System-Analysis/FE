import { Activity, TrendingUp, Users, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminService, SystemStatistics } from '@/services/admin.service'

const DashboardContent = () => {
  const [statistics, setStatistics] = useState<SystemStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const data = await adminService.getStatistics()
      setStatistics(data)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='p-8 flex items-center justify-center'>
        <div className='text-gray-500'>Loading statistics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-600'>
          {error}
        </div>
      </div>
    )
  }

  if (!statistics) return null

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: statistics.Users.Total.toString(),
      subtitle: `${statistics.Users.Active} active`,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: FileText,
      label: 'Total Reports',
      value: statistics.Reports.Total.toString(),
      subtitle: `${statistics.Reports.Public} public`,
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Activity,
      label: 'Chat Sessions',
      value: statistics.ChatSessions.Total.toString(),
      subtitle: `${statistics.ChatSessions.ActiveToday} today`,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: TrendingUp,
      label: 'Storage Used',
      value: `${statistics.Storage.TotalSizeGB.toFixed(1)} GB`,
      subtitle: `${statistics.Storage.FilesCount} files`,
      color: 'bg-orange-50 text-orange-600'
    }
  ]

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard Overview</h1>
        <p className='text-gray-500'>Monitor system performance and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className='bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5' />
                </div>
              </div>
              <div className='text-sm text-gray-500 mb-1'>{stat.label}</div>
              <div className='text-2xl font-bold text-gray-900 mb-1'>{stat.value}</div>
              <div className='text-xs text-gray-500'>{stat.subtitle}</div>
            </div>
          )
        })}
      </div>

      {/* User Breakdown */}
      <div className='bg-white rounded-xl p-6 border border-gray-200 mb-8'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>User Breakdown by Role</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-4 bg-blue-50 rounded-lg'>
            <div className='text-sm text-gray-600 mb-1'>Admin Users</div>
            <div className='text-2xl font-bold text-blue-600'>{statistics.Users.ByRole.Admin}</div>
          </div>
          <div className='p-4 bg-green-50 rounded-lg'>
            <div className='text-sm text-gray-600 mb-1'>Analyst Users</div>
            <div className='text-2xl font-bold text-green-600'>{statistics.Users.ByRole.Analyst}</div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>Reports Status</h3>
          <p className='text-gray-600 text-sm mb-3'>{statistics.Reports.Total} total reports</p>
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-500'>Public</span>
              <span className='font-medium'>{statistics.Reports.Public}</span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-500'>Private</span>
              <span className='font-medium'>{statistics.Reports.Private}</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>User Activity</h3>
          <p className='text-gray-600 text-sm mb-3'>{statistics.Users.Active} active users</p>
          <p className='text-xs text-gray-500'>Out of {statistics.Users.Total} total users</p>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>Chat Activity</h3>
          <p className='text-gray-600 text-sm mb-3'>{statistics.ChatSessions.ActiveToday} sessions today</p>
          <p className='text-xs text-gray-500'>Total: {statistics.ChatSessions.Total} sessions</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
