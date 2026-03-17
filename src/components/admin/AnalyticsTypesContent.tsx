import { useEffect, useState } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import type { AnalyticsType, CreateAnalyticsTypeRequest } from '@/types/admin.types'
import {
  Edit,
  Trash2,
  Search,
  Plus,
  AlertCircle,
  BarChart3,
  Code,
  Calendar,
  Hash,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { ViewAnalyticsTypeModal } from './ViewAnalyticsTypeModal'
import toast from 'react-hot-toast'

const AnalyticsTypesContent = () => {
  const {
    analyticsTypes,
    isLoading,
    error,
    totalAnalyticsTypes,
    loadAnalyticsTypes,
    createAnalyticsType,
    updateAnalyticsType,
    deleteAnalyticsType,
    clearError
  } = useAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6) // 2x3 grid
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingType, setEditingType] = useState<AnalyticsType | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deletingTypeId, setDeletingTypeId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState<{ id: string; name: string } | null>(null)
  const [viewingType, setViewingType] = useState<AnalyticsType | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  // Form states
  const [formData, setFormData] = useState<CreateAnalyticsTypeRequest>({
    code: '',
    name: '',
    description: ''
  })

  useEffect(() => {
    loadAnalyticsTypes()
  }, [loadAnalyticsTypes])

  const filteredTypes = analyticsTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Frontend pagination
  const totalPages = Math.max(1, Math.ceil(filteredTypes.length / pageSize))
  const paginatedTypes = filteredTypes.slice((page - 1) * pageSize, page * pageSize)

  // Reset page when search changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const handleCreateType = async () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const result = await createAnalyticsType(formData)
    if (result.success) {
      setShowCreateModal(false)
      setFormData({ code: '', name: '', description: '' })
      toast.success(result.message || 'Tạo loại phân tích thành công!')
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi tạo loại phân tích')
    }
  }

  const handleEditType = (type: AnalyticsType) => {
    setEditingType(type)
    setFormData({
      code: type.code,
      name: type.name,
      description: type.description || ''
    })
    setShowEditModal(true)
  }

  const handleViewType = (type: AnalyticsType) => {
    setViewingType(type)
    setShowViewModal(true)
  }

  const handleUpdateType = async () => {
    if (!editingType || !formData.code.trim() || !formData.name.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const result = await updateAnalyticsType(editingType.id, formData)

    if (result.success) {
      setShowEditModal(false)
      setEditingType(null)
      setFormData({ code: '', name: '', description: '' })
      toast.success(result.message || 'Cập nhật loại phân tích thành công!')
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi cập nhật loại phân tích')
    }
  }

  const handleDeleteType = async (typeId: string, typeName: string) => {
    setTypeToDelete({ id: typeId, name: typeName })
    setShowDeleteConfirm(true)
  }

  const confirmDeleteType = async () => {
    if (!typeToDelete) return

    setDeletingTypeId(typeToDelete.id)
    const result = await deleteAnalyticsType(typeToDelete.id)

    if (result.success) {
      toast.success(result.message || 'Xóa loại phân tích thành công!')
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi xóa loại phân tích')
    }

    setDeletingTypeId(null)
    setShowDeleteConfirm(false)
    setTypeToDelete(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading && analyticsTypes.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Đang tải loại phân tích...</p>
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
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Quản Lý Loại Phân Tích</h1>
            <p className='text-slate-600'>Quản lý các loại phân tích dữ liệu tài chính</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className='bg-blue-600 hover:bg-blue-700 text-white'>
            <Plus className='w-4 h-4 mr-2' />
            Thêm Loại Phân Tích
          </Button>
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

      {/* Search and Stats */}
      <div className='mb-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <div className='relative flex-1 min-w-80'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
            <Input
              type='text'
              placeholder='Tìm kiếm theo tên, mã code hoặc mô tả...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 h-10'
            />
          </div>
          <div className='text-sm text-slate-600 ml-4'>
            Hiển thị: <span className='font-semibold text-slate-900'>{paginatedTypes.length}</span> /
            <span className='font-semibold text-slate-900'>{filteredTypes.length}</span> loại phân tích
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <BarChart3 className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-blue-600 font-medium'>Tổng Loại Phân Tích</p>
                <p className='text-2xl font-bold text-blue-900'>{totalAnalyticsTypes}</p>
              </div>
            </div>
          </div>
          <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <Code className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-green-600 font-medium'>Có Mô Tả</p>
                <p className='text-2xl font-bold text-green-900'>
                  {analyticsTypes.filter((type) => type.description && type.description.trim()).length}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Calendar className='w-5 h-5 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-purple-600 font-medium'>Tạo Gần Đây</p>
                <p className='text-2xl font-bold text-purple-900'>
                  {
                    analyticsTypes.filter((type) => {
                      const createdDate = new Date(type.createdAt)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return createdDate > weekAgo
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Types Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {paginatedTypes.length === 0 ? (
          <div className='col-span-full flex items-center justify-center py-12'>
            <div className='text-center text-slate-400'>
              <BarChart3 className='w-12 h-12 mx-auto mb-4 opacity-50' />
              <p className='text-lg font-medium mb-2'>Không tìm thấy loại phân tích nào</p>
              <p className='text-sm'>
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có loại phân tích nào trong hệ thống'}
              </p>
            </div>
          </div>
        ) : (
          paginatedTypes.map((type) => (
            <div
              key={type.id}
              className='bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Hash className='w-4 h-4 text-slate-400' />
                      <span className='text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded'>
                        {type.code}
                      </span>
                    </div>
                    <h3 className='text-lg font-semibold text-slate-900 mb-2'>{type.name}</h3>
                    {type.description && <p className='text-sm text-slate-600 mb-3'>{type.description}</p>}
                  </div>
                  <div className='flex items-center gap-2 ml-4'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleViewType(type)}
                      className='text-slate-600 hover:text-slate-700 hover:bg-slate-50'
                      title='Xem chi tiết'
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEditType(type)}
                      className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      title='Chỉnh sửa'
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteType(type.id, type.name)}
                      disabled={deletingTypeId === type.id}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50'
                      title='Xóa'
                    >
                      {deletingTypeId === type.id ? (
                        <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4' />
                      )}
                    </Button>
                  </div>
                </div>

                <div className='border-t border-slate-200 pt-3'>
                  <div className='flex items-center text-xs text-slate-500'>
                    <Calendar className='w-3 h-3 mr-1' />
                    Tạo lúc: {formatDate(type.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between bg-white rounded-xl border border-slate-200 px-6 py-4 mb-8'>
        <div className='text-sm text-slate-600'>
          Hiển thị {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, filteredTypes.length)} trong tổng số{' '}
          {filteredTypes.length} loại phân tích
          {searchTerm && ` (lọc từ ${totalAnalyticsTypes} tổng cộng)`}
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

      {/* View Modal */}
      <ViewAnalyticsTypeModal
        analyticsType={viewingType}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setViewingType(null)
        }}
      />

      {/* Create Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>Tạo Loại Phân Tích Mới</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Mã code *</label>
                <Input
                  type='text'
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder='VD: FINANCIAL_ANALYSIS'
                  className='w-full font-mono'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Tên loại phân tích *</label>
                <Input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='VD: Phân tích tài chính'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Mô tả chi tiết về loại phân tích này'
                  rows={3}
                  className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='flex items-center gap-3 mt-6'>
              <Button onClick={handleCreateType} className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'>
                Tạo Loại Phân Tích
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowCreateModal(false)
                  setFormData({ code: '', name: '', description: '' })
                }}
                className='flex-1'
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingType && (
        <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>Chỉnh Sửa Loại Phân Tích</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Mã code *</label>
                <Input
                  type='text'
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder='VD: FINANCIAL_ANALYSIS'
                  className='w-full font-mono'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Tên loại phân tích *</label>
                <Input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='VD: Phân tích tài chính'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Mô tả chi tiết về loại phân tích này'
                  rows={3}
                  className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='flex items-center gap-3 mt-6'>
              <Button onClick={handleUpdateType} className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'>
                Cập Nhật
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowEditModal(false)
                  setEditingType(null)
                  setFormData({ code: '', name: '', description: '' })
                }}
                className='flex-1'
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setTypeToDelete(null)
        }}
        onConfirm={confirmDeleteType}
        title='Xóa Loại Phân Tích'
        message={`Bạn có chắc chắn muốn xóa loại phân tích "${typeToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText='Xóa'
        cancelText='Hủy'
        type='danger'
        isLoading={deletingTypeId === typeToDelete?.id}
      />
    </div>
  )
}

export default AnalyticsTypesContent
