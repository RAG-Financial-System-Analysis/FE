import { Activity, TrendingUp, Zap, Clock } from 'lucide-react'

const DashboardContent = () => {
  const stats = [
    {
      icon: Activity,
      label: 'API Calls Today',
      value: '1,234,567',
      trend: '+12%',
      trendUp: true
    },
    {
      icon: TrendingUp,
      label: 'System Health',
      value: '98.5%',
      trend: '+0.8%',
      trendUp: true
    },
    {
      icon: Zap,
      label: 'Active Users',
      value: '342',
      trend: '+8%',
      trendUp: true
    },
    {
      icon: Clock,
      label: 'Avg Response Time',
      value: '145ms',
      trend: '-5%',
      trendUp: false
    }
  ]

  const alerts = [
    {
      type: 'warning',
      message: 'Rate limit threshold reached for API endpoint /v1/users',
      time: '2 mins ago',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-500'
    },
    {
      type: 'info',
      message: 'System backup completed successfully',
      time: '1 hour ago',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-500'
    },
    {
      type: 'error',
      message: 'Failed authentication attempt detected from IP 192.168.1.100',
      time: '3 hours ago',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-500'
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
                <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                  <Icon className='w-5 h-5 text-blue-600' />
                </div>
                <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className='text-sm text-gray-500 mb-1'>{stat.label}</div>
              <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Recent Alerts */}
      <div className='bg-white rounded-xl p-6 border border-gray-200 mb-8'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Recent Alerts</h2>
        <div className='space-y-3'>
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border ${alert.color}`}>
              <div className='flex items-start gap-3'>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${alert.iconColor}`}>
                  {alert.type === 'warning' && '⚠'}
                  {alert.type === 'info' && 'ℹ'}
                  {alert.type === 'error' && '✕'}
                </div>
                <div className='flex-1'>
                  <p className='text-sm text-gray-900 mb-1'>{alert.message}</p>
                  <p className='text-xs text-gray-500'>{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>System Status</h3>
          <p className='text-gray-600 text-sm mb-3'>All services operational</p>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span className='text-sm text-green-600 font-medium'>Healthy</span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>API Endpoints</h3>
          <p className='text-gray-600 text-sm mb-3'>24 endpoints configured</p>
          <p className='text-xs text-gray-500'>Last updated 30 min ago</p>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>Active Sessions</h3>
          <p className='text-gray-600 text-sm mb-3'>342 users online</p>
          <p className='text-xs text-gray-500'>Peak: 512 users</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
