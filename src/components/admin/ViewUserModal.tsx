import { useState, useEffect } from 'react'
import { X, User, Mail, Shield, Calendar, Clock, Activity } from 'lucide-react'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { UserDetail } from '@/types'

interface ViewUserModalProps {
  userId: string | null
  isOpen: boolean
  onClose: () => void
}

export const ViewUserModal = ({ userId, isOpen, onClose }: ViewUserModalProps) => {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserDetail = async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const detail = await adminService.getUserDetail(userId)
      setUserDetail(detail)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông tin chi tiết'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa có thông tin'
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>Chi Tiết Người Dùng</h2>
          <Button variant='ghost' size='sm' onClick={onClose} className='text-slate-400 hover:text-slate-600'>
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                <p className='text-slate-600'>Đang tải thông tin...</p>
              </div>
            </div>
          ) : error ? (
            <div className='text-center py-12'>
              <div className='text-red-600 mb-4'>
                <X className='w-12 h-12 mx-auto mb-2' />
                <p className='text-lg font-medium'>Có lỗi xảy ra</p>
                <p className='text-sm text-slate-600'>{error}</p>
              </div>
              <Button onClick={fetchUserDetail} className='mt-4'>
                Thử lại
              </Button>
            </div>
          ) : userDetail ? (
            <div className='space-y-6'>
              {/* User Avatar and Basic Info */}
              <div className='flex items-start gap-6 p-6 bg-slate-50 rounded-xl'>
                <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl'>
                  {userDetail.fullName.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-bold text-slate-900 mb-2'>{userDetail.fullName}</h3>
                  <div className='flex items-center gap-4 mb-3'>
                    <div className='flex items-center gap-2 text-slate-600'>
                      <Mail className='w-4 h-4' />
                      <span>{userDetail.email}</span>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${getRoleBadgeColor(
                        userDetail.role
                      )}`}
                    >
                      {userDetail.role}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-3 h-3 rounded-full ${userDetail.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                    ></div>
                    <span className={`text-sm font-medium ${userDetail.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                      {userDetail.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                    <User className='w-5 h-5' />
                    Thông Tin Tài Khoản
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>ID:</span>
                      <span className='text-slate-900 font-mono text-sm'>{userDetail.id}</span>
                    </div>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>Vai trò:</span>
                      <span className='text-slate-900 font-medium'>{userDetail.role}</span>
                    </div>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>Trạng thái:</span>
                      <span className={`font-medium ${userDetail.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                        {userDetail.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                    <Clock className='w-5 h-5' />
                    Thời Gian
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>Ngày tạo:</span>
                      <span className='text-slate-900 text-sm'>{formatDate(userDetail.createdAt)}</span>
                    </div>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>Đăng nhập cuối:</span>
                      <span className='text-slate-900 text-sm'>{formatDate(userDetail.lastLoginAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <Activity className='w-5 h-5' />
                  Thống Kê Hoạt Động
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                        <Shield className='w-5 h-5 text-blue-600' />
                      </div>
                      <div>
                        <p className='text-sm text-blue-600 font-medium'>Báo cáo đã tải lên</p>
                        <p className='text-2xl font-bold text-blue-900'>
                          {userDetail.statistics?.reportsUploaded || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                        <Calendar className='w-5 h-5 text-green-600' />
                      </div>
                      <div>
                        <p className='text-sm text-green-600 font-medium'>Phiên chat</p>
                        <p className='text-2xl font-bold text-green-900'>{userDetail.statistics?.chatSessions || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50'>
          <Button variant='outline' onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
