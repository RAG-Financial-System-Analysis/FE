import { useEffect, useCallback } from 'react'
import { useAdmin, useAutoRefresh } from '@/hooks'
import { Users, FileText, MessageSquare, HardDrive, TrendingUp, AlertCircle, BarChart3, PieChart } from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { AutoRefreshIndicator } from '@/components/common'

const DashboardContent = () => {
  const { systemStats, isLoading, error, loadSystemStats, clearError } = useAdmin()

  useEffect(() => {
    loadSystemStats()
  }, [loadSystemStats])

  // Auto refresh function
  const handleAutoRefresh = useCallback(async () => {
    await loadSystemStats()
  }, [loadSystemStats])

  // Auto refresh hook - 60 seconds interval for admin dashboard
  const autoRefresh = useAutoRefresh({
    interval: 60000, // 60 seconds
    onRefresh: handleAutoRefresh
  })

  if (isLoading && !systemStats) {
    return (
      <div className='p-8 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Đang tải thống kê hệ thống...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Admin Dashboard</h1>
            <p className='text-slate-600'>Tổng quan về hệ thống và hoạt động</p>
          </div>
          <AutoRefreshIndicator
            isRefreshing={autoRefresh.isRefreshing}
            lastRefresh={autoRefresh.lastRefresh}
            isAutoRefreshEnabled={autoRefresh.isAutoRefreshEnabled}
            onToggleAutoRefresh={autoRefresh.toggleAutoRefresh}
            onForceRefresh={autoRefresh.forceRefresh}
            interval={60000}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 shrink-0' />
          <div className='flex-1'>
            <h3 className='text-red-800 font-medium mb-1'>Có lỗi xảy ra</h3>
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
          <button onClick={clearError} className='text-red-600 hover:text-red-700 hover:bg-red-100 rounded p-1'>
            ✕
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <Users className='w-6 h-6 text-blue-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-slate-900'>Người Dùng</h3>
              <p className='text-3xl font-bold text-blue-600 mt-1'>
                {systemStats?.users?.total?.toLocaleString() || '0'}
              </p>
              <p className='text-sm text-slate-500 mt-1'>Tổng số người dùng</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <FileText className='w-6 h-6 text-green-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-slate-900'>Báo Cáo</h3>
              <p className='text-3xl font-bold text-green-600 mt-1'>
                {systemStats?.reports?.total?.toLocaleString() || '0'}
              </p>
              <p className='text-sm text-slate-500 mt-1'>Tổng số báo cáo</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <MessageSquare className='w-6 h-6 text-purple-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-slate-900'>Chat Sessions</h3>
              <p className='text-3xl font-bold text-purple-600 mt-1'>
                {systemStats?.chatSessions?.total?.toLocaleString() || '0'}
              </p>
              <p className='text-sm text-slate-500 mt-1'>Tổng số phiên chat</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
              <HardDrive className='w-6 h-6 text-orange-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-slate-900'>Dung Lượng</h3>
              <p className='text-3xl font-bold text-orange-600 mt-1'>
                {systemStats?.storage?.totalSizeGB ? `${systemStats.storage.totalSizeGB.toFixed(1)} GB` : '0 GB'}
              </p>
              <p className='text-sm text-slate-500 mt-1'>Dung lượng đã sử dụng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* User Statistics */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-slate-900'>Thống Kê Người Dùng</h3>
            <Users className='w-5 h-5 text-blue-600' />
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Tổng số</span>
              <span className='text-sm font-semibold text-slate-900'>
                {systemStats?.users?.total?.toLocaleString() || '0'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Đang hoạt động</span>
              <span className='text-sm font-semibold text-green-600'>
                {systemStats?.users?.active?.toLocaleString() || '0'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Quản trị viên</span>
              <span className='text-sm font-semibold text-purple-600'>
                {systemStats?.users?.admins?.toLocaleString() || '0'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Phân tích viên</span>
              <span className='text-sm font-semibold text-blue-600'>
                {systemStats?.users?.analysts?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Statistics */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-slate-900'>Hoạt Động Tháng Này</h3>
            <TrendingUp className='w-5 h-5 text-green-600' />
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Báo cáo mới</span>
              <span className='text-sm font-semibold text-green-600'>
                {systemStats?.reports?.thisMonth?.toLocaleString() || '0'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Chat sessions</span>
              <span className='text-sm font-semibold text-purple-600'>
                {systemStats?.chatSessions?.thisMonth?.toLocaleString() || '0'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Phân tích được tạo</span>
              <span className='text-sm font-semibold text-blue-600'>
                {systemStats?.analytics?.thisMonth?.toLocaleString() || '0'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Tin nhắn trung bình/session</span>
              <span className='text-sm font-semibold text-slate-900'>
                {systemStats?.chatSessions?.averageMessagesPerSession?.toFixed(1) || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* User Distribution Chart */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-slate-900'>Phân Bố Người Dùng</h3>
            <PieChart className='w-5 h-5 text-blue-600' />
          </div>
          <div className='h-64'>
            {systemStats?.users?.admins || systemStats?.users?.analysts ? (
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Quản trị viên', value: systemStats?.users?.admins || 0 },
                      { name: 'Phân tích viên', value: systemStats?.users?.analysts || 0 }
                    ].filter((item) => item.value > 0)}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    dataKey='value'
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    fill='#8884d8'
                  >
                    {[
                      { name: 'Quản trị viên', value: systemStats?.users?.admins || 0, color: '#8b5cf6' },
                      { name: 'Phân tích viên', value: systemStats?.users?.analysts || 0, color: '#3b82f6' }
                    ]
                      .filter((item) => item.value > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center text-slate-400'>
                  <Users className='w-12 h-12 mx-auto mb-4 opacity-50' />
                  <p className='text-lg font-medium mb-2'>Chưa có dữ liệu người dùng</p>
                  <p className='text-sm'>Biểu đồ sẽ hiển thị khi có người dùng trong hệ thống</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reports Visibility Distribution */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-slate-900'>Phân Bố Báo Cáo</h3>
            <FileText className='w-5 h-5 text-green-600' />
          </div>
          <div className='h-64'>
            {systemStats?.reports?.total ? (
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Công khai', value: systemStats?.reports?.public || 0 },
                      { name: 'Riêng tư', value: systemStats?.reports?.private || 0 }
                    ].filter((item) => item.value > 0)}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    dataKey='value'
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    fill='#8884d8'
                  >
                    {[
                      { name: 'Công khai', value: systemStats?.reports?.public || 0, color: '#10b981' },
                      { name: 'Riêng tư', value: systemStats?.reports?.private || 0, color: '#f59e0b' }
                    ]
                      .filter((item) => item.value > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center text-slate-400'>
                  <FileText className='w-12 h-12 mx-auto mb-4 opacity-50' />
                  <p className='text-lg font-medium mb-2'>Chưa có báo cáo</p>
                  <p className='text-sm'>Biểu đồ sẽ hiển thị khi có báo cáo trong hệ thống</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Performance Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Activity Comparison Chart */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-slate-900'>So Sánh Hoạt Động</h3>
            <BarChart3 className='w-5 h-5 text-blue-600' />
          </div>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={[
                  {
                    name: 'Báo cáo',
                    'Tổng số': systemStats?.reports?.total || 0,
                    'Tháng này': systemStats?.reports?.thisMonth || 0
                  },
                  {
                    name: 'Chat',
                    'Tổng số': systemStats?.chatSessions?.total || 0,
                    'Tháng này': systemStats?.chatSessions?.thisMonth || 0
                  },
                  {
                    name: 'Phân tích',
                    'Tổng số': systemStats?.analytics?.reportsGenerated || 0,
                    'Tháng này': systemStats?.analytics?.thisMonth || 0
                  }
                ]}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='Tổng số' fill='#3b82f6' />
                <Bar dataKey='Tháng này' fill='#10b981' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Status */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-slate-900'>Trạng Thái Người Dùng</h3>
            <Users className='w-5 h-5 text-purple-600' />
          </div>
          <div className='h-64'>
            {systemStats?.users?.total ? (
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={[
                    {
                      name: 'Người dùng',
                      'Đang hoạt động': systemStats?.users?.active || 0,
                      'Không hoạt động': (systemStats?.users?.total || 0) - (systemStats?.users?.active || 0)
                    }
                  ]}
                  layout='vertical'
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis type='category' dataKey='name' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='Đang hoạt động' fill='#10b981' stackId='a' />
                  <Bar dataKey='Không hoạt động' fill='#ef4444' stackId='a' />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center text-slate-400'>
                  <Users className='w-12 h-12 mx-auto mb-4 opacity-50' />
                  <p className='text-lg font-medium mb-2'>Chưa có dữ liệu</p>
                  <p className='text-sm'>Biểu đồ sẽ hiển thị khi có người dùng trong hệ thống</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
