import React, { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { User, UpdateUserRequest } from '@/types/admin.types'

interface EditUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, data: UpdateUserRequest) => Promise<{ success: boolean; message: string }>
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    fullName: '',
    role: 'Analyst',
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive
      })
      setError(null)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await onSave(user.id, formData)

      if (result.success) {
        onClose()
      } else {
        setError(result.message)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật người dùng'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setError(null)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>Chỉnh Sửa Người Dùng</h2>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClose}
            disabled={isLoading}
            className='text-slate-400 hover:text-slate-600'
          >
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6'>
          {error && (
            <div className='mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2'>
              <AlertCircle className='w-4 h-4 text-red-600 mt-0.5 shrink-0' />
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          )}

          <div className='space-y-4'>
            {/* Email (Read-only) */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Email</label>
              <Input type='email' value={user.email} disabled className='bg-slate-50 text-slate-500' />
              <p className='text-xs text-slate-500 mt-1'>Email không thể thay đổi</p>
            </div>

            {/* Full Name */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Họ và Tên <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder='Nhập họ và tên'
                required
                disabled={isLoading}
              />
            </div>

            {/* Role */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Vai Trò <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500'
                required
                disabled={isLoading}
              >
                <option value='Analyst'>Analyst</option>
                <option value='Admin'>Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Trạng Thái</label>
              <div className='flex items-center gap-3'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='isActive'
                    checked={formData.isActive}
                    onChange={() => setFormData((prev) => ({ ...prev, isActive: true }))}
                    disabled={isLoading}
                    className='text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-slate-700'>Hoạt động</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='isActive'
                    checked={!formData.isActive}
                    onChange={() => setFormData((prev) => ({ ...prev, isActive: false }))}
                    disabled={isLoading}
                    className='text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-slate-700'>Không hoạt động</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200'>
            <Button type='button' variant='outline' onClick={handleClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type='submit' disabled={isLoading} className='bg-blue-600 hover:bg-blue-700 text-white'>
              {isLoading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Lưu Thay Đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
