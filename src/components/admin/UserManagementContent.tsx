import { useEffect, useState, useCallback } from 'react'
import type { User } from '@/services/admin.service'
import { adminService } from '@/services/admin.service'
import { Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const UserManagementContent = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await adminService.getUsers(page, pageSize)
      setUsers(response.Data)
      setTotal(response.Total)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      setDeletingUserId(userId)
      await adminService.deleteUser(userId)
      await loadUsers() // Reload list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      alert(errorMessage)
    } finally {
      setDeletingUserId(null)
    }
  }

  const filteredUsers = users.filter(user =>
    user.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(total / pageSize)

  if (loading && users.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center'>
        <div className='text-gray-500'>Loading users...</div>
      </div>
    )
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>User Management</h1>
        <p className='text-gray-500'>Manage system users and their permissions</p>
      </div>

      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600'>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className='mb-6 bg-white rounded-xl p-4 border border-gray-200'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search by name or email...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Last Login
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filteredUsers.map((user) => (
                <tr key={user.Id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>{user.FullName}</div>
                      <div className='text-sm text-gray-500'>{user.Email}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.Role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.Role}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.IsActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {user.LastLoginAt 
                      ? new Date(user.LastLoginAt).toLocaleDateString() 
                      : 'Never'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center gap-2'>
                      <button
                        className='text-blue-600 hover:text-blue-900'
                        title='Edit user'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.Id)}
                        disabled={deletingUserId === user.Id}
                        className='text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed'
                        title='Delete user'
                      >
                        {deletingUserId === user.Id ? (
                          <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                        ) : (
                          <Trash2 className='w-4 h-4' />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} users
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

export default UserManagementContent
