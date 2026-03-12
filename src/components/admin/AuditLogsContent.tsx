import { useEffect, useState } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { Search, ChevronLeft, ChevronRight, AlertCircle, Calendar, User, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const AuditLogsContent = () => {
  const { auditLogs, isLoading, error, totalLogs, clearError, setError } = useAdmin()

  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  useEffect(() => {
    // Audit Logs API chưa được phát triển, hiển thị thông báo
    setError('API Audit Logs chưa được phát triển')
  }, [setError])

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalLogs / pageSize)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'logout':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'create':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'update':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  if (isLoading && auditLogs.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Đang tải lịch sử hoạt động...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Lịch Sử Hoạt Động</h1>
            <p className='text-slate-600'>Theo dõi các hoạt động của người dùng trong hệ thống</p>
          </div>
          <div className='flex items-center gap-3'>
            <Calendar className='w-5 h-5 text-slate-400' />
            <span className='text-sm text-slate-600'>Cập nhật theo thời gian thực</span>
          </div>
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
          <Button
            variant='ghost'
            size='sm'
            onClick={clearError}
            className='text-red-600 hover:text-red-700 hover:bg-red-100'
          >
            ✕
          </Button>
        </div>
      )}

      {/* Search and Filters */}
      <div className='mb-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='relative flex-1 min-w-80'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
            <Input
              type='text'
              placeholder='Tìm kiếm theo email, hành động hoặc chi tiết...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 h-10'
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className='px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>Tất cả hành động</option>
            <option value='login'>Đăng nhập</option>
            <option value='logout'>Đăng xuất</option>
            <option value='create'>Tạo mới</option>
            <option value='update'>Cập nhật</option>
            <option value='delete'>Xóa</option>
          </select>
        </div>

        <div className='text-sm text-slate-600'>
          Tổng cộng: <span className='font-semibold text-slate-900'>{totalLogs}</span> hoạt động
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50 border-b border-slate-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Người Dùng
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Hành Động
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Chi Tiết
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  IP Address
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Thời Gian
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center'>
                    <div className='text-slate-400'>
                      <Activity className='w-12 h-12 mx-auto mb-4 opacity-50' />
                      <p className='text-lg font-medium mb-2'>Không có hoạt động nào</p>
                      <p className='text-sm'>
                        {searchTerm || actionFilter
                          ? 'Thử thay đổi bộ lọc tìm kiếm'
                          : 'Chưa có hoạt động nào được ghi lại'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs'>
                          <User className='w-4 h-4' />
                        </div>
                        <div>
                          <div className='text-sm font-semibold text-slate-900'>{log.userEmail}</div>
                          <div className='text-xs text-slate-500'>ID: {log.userId.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getActionBadgeColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-slate-900 max-w-xs truncate' title={log.details}>
                        {log.details}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600 font-mono'>{log.ipAddress}</td>
                    <td className='px-6 py-4 text-sm text-slate-600'>{formatDate(log.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50'>
            <div className='text-sm text-slate-600'>
              Hiển thị {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, totalLogs)} trong tổng số {totalLogs}{' '}
              hoạt động
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className='px-3'
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>
              <span className='text-sm text-slate-700 px-3'>
                Trang {page} / {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className='px-3'
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLogsContent
