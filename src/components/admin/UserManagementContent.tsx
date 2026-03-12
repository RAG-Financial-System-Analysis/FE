import { useEffect, useState, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import type { User } from '@/types/admin.types'
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, UserPlus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { EditUserModal } from './EditUserModal'
import toast from 'react-hot-toast'
import AutoRefreshIndicator from '@/components/common/AutoRefreshIndicator'

const UserManagementContent = () => {
  const { users, isLoading, error, totalUsers, loadUsers, deleteUser, clearError } = useAdmin()

  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null)

  // Load users on component mount and when page changes
  useEffect(() => {
    loadUsers({ page, pageSize })
  }, [loadUsers, page, pageSize])

  // Auto refresh function
  const handleAutoRefresh = useCallback(async () => {
    await loadUsers({ page, pageSize })
  }, [loadUsers, page, pageSize])

  // Auto refresh hook - 45 seconds interval for analyst management
  const autoRefresh = useAutoRefresh({
    interval: 45000, // 45 seconds
    onRefresh: handleAutoRefresh,
    dependencies: [page, pageSize]
  })

  const handleDeleteUser = async (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName })
    setShowDeleteConfirm(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    setDeletingUserId(userToDelete.id)
    const result = await deleteUser(userToDelete.id)

    if (result.success) {
      toast.success(result.message || 'Xóa người dùng thành công!')
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi xóa người dùng')
    }

    setDeletingUserId(null)
    setShowDeleteConfirm(false)
    setUserToDelete(null)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingUser(null)
  }

  const handleSaveUser = async () => {
    // API Update User chưa được phát triển - fix cứng
    return {
      success: false,
      message: 'Tính năng chưa được phát triển'
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalUsers / pageSize)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa đăng nhập'
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'analyst':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading && users.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Đang tải danh sách analyst...</p>
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
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Quản Lý Analyst</h1>
            <p className='text-slate-600'>Quản lý analyst hệ thống và phân quyền</p>
          </div>
          <div className='flex items-center gap-4'>
            <AutoRefreshIndicator
              isRefreshing={autoRefresh.isRefreshing}
              lastRefresh={autoRefresh.lastRefresh}
              isAutoRefreshEnabled={autoRefresh.isAutoRefreshEnabled}
              onToggleAutoRefresh={autoRefresh.toggleAutoRefresh}
              onForceRefresh={autoRefresh.forceRefresh}
              interval={45000}
            />
            <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
              <UserPlus className='w-4 h-4 mr-2' />
              Thêm Analyst
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
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

      {/* Search and Stats */}
      <div className='mb-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-4'>
            <div className='relative flex-1 min-w-80'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
              <Input
                type='text'
                placeholder='Tìm kiếm theo tên, email hoặc vai trò...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 h-10'
              />
            </div>
          </div>
          <div className='text-sm text-slate-600'>
            Tổng cộng: <span className='font-semibold text-slate-900'>{totalUsers}</span> analyst
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <UserPlus className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-blue-600 font-medium'>Tổng Analyst</p>
                <p className='text-2xl font-bold text-blue-900'>{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              </div>
              <div>
                <p className='text-sm text-green-600 font-medium'>Đang Hoạt Động</p>
                <p className='text-2xl font-bold text-green-900'>{users.filter((u) => u.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className='bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                <div className='w-5 h-5 text-purple-600'>👑</div>
              </div>
              <div>
                <p className='text-sm text-purple-600 font-medium'>Quản Trị Viên</p>
                <p className='text-2xl font-bold text-purple-900'>
                  {users.filter((u) => u.role.toLowerCase() === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50 border-b border-slate-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Analyst
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Vai Trò
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Trạng Thái
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Lần Đăng Nhập Cuối
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Ngày Tạo
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center'>
                    <div className='text-slate-400'>
                      <Search className='w-12 h-12 mx-auto mb-4 opacity-50' />
                      <p className='text-lg font-medium mb-2'>Không tìm thấy analyst nào</p>
                      <p className='text-sm'>
                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có analyst nào trong hệ thống'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className='text-sm font-semibold text-slate-900'>{user.fullName}</div>
                          <div className='text-sm text-slate-500'>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className={`text-sm font-medium ${user.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                          {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600'>{formatDate(user.lastLoginAt)}</td>
                    <td className='px-6 py-4 text-sm text-slate-600'>{formatDate(user.createdAt)}</td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleEditUser(user)}
                          className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteUser(user.id, user.fullName)}
                          disabled={deletingUserId === user.id}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50'
                        >
                          {deletingUserId === user.id ? (
                            <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                          ) : (
                            <Trash2 className='w-4 h-4' />
                          )}
                        </Button>
                      </div>
                    </td>
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
              Hiển thị {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, totalUsers)} trong tổng số{' '}
              {totalUsers} analyst
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

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setUserToDelete(null)
        }}
        onConfirm={confirmDeleteUser}
        title='Xóa Analyst'
        message={`Bạn có chắc chắn muốn xóa analyst "${userToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText='Xóa'
        cancelText='Hủy'
        type='danger'
        isLoading={deletingUserId === userToDelete?.id}
      />
    </div>
  )
}

export default UserManagementContent
