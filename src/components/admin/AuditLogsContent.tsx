import { useEffect, useState } from 'react'
import { adminService, AuditLog } from '@/services/admin.service'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'

const AuditLogsContent = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(50)
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadLogs()
  }, [page, filters])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAuditLogs(page, pageSize, filters)
      setLogs(response.Data)
      setTotal(response.Total)
    } catch (err: any) {
      setError(err.response?.data?.Message || 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800'
    if (action.includes('CREATE') || action.includes('UPLOAD')) return 'bg-green-100 text-green-800'
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  const totalPages = Math.ceil(total / pageSize)

  if (loading && logs.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center'>
        <div className='text-gray-500'>Loading audit logs...</div>
      </div>
    )
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Audit Logs</h1>
        <p className='text-gray-500'>Track all system activities and user actions</p>
      </div>

      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600'>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className='mb-6 bg-white rounded-xl p-4 border border-gray-200'>
        <div className='flex items-center gap-2 mb-3'>
          <Filter className='w-5 h-5 text-gray-500' />
          <h3 className='font-medium text-gray-900'>Filters</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Action Type</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Actions</option>
              <option value='UPLOAD_REPORT'>Upload Report</option>
              <option value='DELETE_REPORT'>Delete Report</option>
              <option value='CREATE_SESSION'>Create Session</option>
              <option value='UPDATE_USER'>Update User</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Start Date</label>
            <input
              type='date'
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>End Date</label>
            <input
              type='date'
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Timestamp
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Action
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Resource
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Details
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {logs.map((log) => (
                <tr key={log.Id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(log.CreatedAt).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>{log.UserName}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.Action)}`}>
                      {log.Action}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {log.ResourceType}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                    {log.Details}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {log.IpAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} logs
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>
            <span className='text-sm text-gray-700'>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuditLogsContent
