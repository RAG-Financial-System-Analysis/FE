import { useEffect, useState } from 'react'
import { useAdmin } from '@/hooks'
import type { ReportCategory, CreateReportCategoryRequest } from '@/types'
import {
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  FolderOpen,
  FileText,
  Calendar,
  Building,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { ConfirmModal } from '@/components/ui'
import { ViewReportCategoryModal } from './index'
import toast from 'react-hot-toast'

const ReportCategoriesContent = () => {
  const {
    reportCategories,
    isLoading,
    error,
    totalCategories,
    loadReportCategories,
    createReportCategory,
    updateReportCategory,
    deleteReportCategory,
    clearError
  } = useAdmin()

  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ReportCategory | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null)
  const [viewingCategory, setViewingCategory] = useState<ReportCategory | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  // Form states
  const [formData, setFormData] = useState<CreateReportCategoryRequest>({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadReportCategories(page, pageSize)
  }, [loadReportCategories, page, pageSize])

  const filteredCategories = reportCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(totalCategories / pageSize))

  const handleCreateCategory = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const result = await createReportCategory(formData)
    if (result.success) {
      setShowCreateModal(false)
      setFormData({ name: '', description: '' })
      toast.success(result.message || 'Tạo danh mục thành công!')
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi tạo danh mục')
    }
  }

  const handleEditCategory = (category: ReportCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description
    })
    setShowEditModal(true)
  }

  const handleViewCategory = (category: ReportCategory) => {
    setViewingCategory(category)
    setShowViewModal(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !formData.name.trim() || !formData.description.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const result = await updateReportCategory(editingCategory.id, formData)

    if (result.success) {
      setShowEditModal(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      toast.success(result.message || 'Cập nhật danh mục thành công!')
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi cập nhật danh mục')
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName })
    setShowDeleteConfirm(true)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return

    setDeletingCategoryId(categoryToDelete.id)
    const result = await deleteReportCategory(categoryToDelete.id)

    if (result.success) {
      toast.success(result.message || 'Xóa danh mục thành công!')
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi xóa danh mục')
    }

    setDeletingCategoryId(null)
    setShowDeleteConfirm(false)
    setCategoryToDelete(null)
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

  if (isLoading && reportCategories.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Đang tải danh mục báo cáo...</p>
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
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Quản Lý Danh Mục Báo Cáo</h1>
            <p className='text-slate-600'>Quản lý các danh mục phân loại báo cáo tài chính</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className='bg-blue-600 hover:bg-blue-700 text-white'>
            <Plus className='w-4 h-4 mr-2' />
            Thêm Danh Mục
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
              placeholder='Tìm kiếm theo tên hoặc mô tả danh mục...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 h-10'
            />
          </div>
          <div className='text-sm text-slate-600 ml-4'>
            Tổng cộng: <span className='font-semibold text-slate-900'>{totalCategories}</span> danh mục
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <FolderOpen className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-blue-600 font-medium'>Tổng Danh Mục</p>
                <p className='text-2xl font-bold text-blue-900'>{totalCategories}</p>
              </div>
            </div>
          </div>
          <div className='bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <FileText className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-green-600 font-medium'>Báo Cáo Liên Kết</p>
                <p className='text-2xl font-bold text-green-900'>
                  {reportCategories.reduce((sum, cat) => sum + (cat.associatedReportsCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-linear-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              </div>
              <div>
                <p className='text-sm text-purple-600 font-medium'>Tạo Gần Đây</p>
                <p className='text-2xl font-bold text-purple-900'>
                  {
                    reportCategories.filter((cat) => {
                      const createdDate = new Date(cat.createdAt)
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

      {/* Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {filteredCategories.length === 0 ? (
          <div className='col-span-full flex items-center justify-center py-12'>
            <div className='text-center text-slate-400'>
              <FolderOpen className='w-12 h-12 mx-auto mb-4 opacity-50' />
              <p className='text-lg font-medium mb-2'>Không tìm thấy danh mục nào</p>
              <p className='text-sm'>
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có danh mục nào trong hệ thống'}
              </p>
            </div>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className='bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-slate-900 mb-2'>{category.name}</h3>
                    <p className='text-sm text-slate-600 mb-3'>{category.description}</p>
                  </div>
                  <div className='flex items-center gap-2 ml-4'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleViewCategory(category)}
                      className='text-slate-600 hover:text-slate-700 hover:bg-slate-50'
                      title='Xem chi tiết'
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEditCategory(category)}
                      className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      title='Chỉnh sửa'
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      disabled={deletingCategoryId === category.id}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50'
                      title='Xóa'
                    >
                      {deletingCategoryId === category.id ? (
                        <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4' />
                      )}
                    </Button>
                  </div>
                </div>

                <div className='space-y-2 mb-4'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-slate-600'>Báo cáo liên kết:</span>
                    <span className='font-semibold text-slate-900'>{category.associatedReportsCount || 0}</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-slate-600'>Ngày tạo:</span>
                    <span className='text-slate-900 text-xs'>{formatDate(category.createdAt)}</span>
                  </div>
                </div>

                {/* Associated Reports */}
                {category.associatedReports && category.associatedReports.length > 0 && (
                  <div className='border-t border-slate-200 pt-4'>
                    <h4 className='text-sm font-medium text-slate-900 mb-2'>Báo cáo gần đây:</h4>
                    <div className='space-y-2'>
                      {category.associatedReports.slice(0, 2).map((report) => (
                        <div key={report.id} className='flex items-start gap-2 text-xs'>
                          <FileText className='w-3 h-3 text-slate-400 mt-0.5 shrink-0' />
                          <div className='flex-1 min-w-0'>
                            <p className='text-slate-700 truncate' title={report.title || report.companyName}>
                              {report.title || `Báo cáo ${report.companyName}`}
                            </p>
                            <div className='flex items-center gap-2 text-slate-500 mt-1'>
                              <Building className='w-3 h-3' />
                              <span>{report.companyName}</span>
                              <Calendar className='w-3 h-3 ml-1' />
                              <span>{formatDate(report.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {category.associatedReports.length > 2 && (
                        <p className='text-xs text-slate-500'>+{category.associatedReports.length - 2} báo cáo khác</p>
                      )}
                    </div>
                  </div>
                )}

                <div className='border-t border-slate-200 pt-3 mt-4'>
                  <div className='flex items-center text-xs text-slate-500'>
                    <Calendar className='w-3 h-3 mr-1' />
                    Tạo lúc: {formatDate(category.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between bg-white rounded-xl border border-slate-200 px-6 py-4'>
        <div className='text-sm text-slate-600'>
          Hiển thị {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, totalCategories)} trong tổng số{' '}
          {totalCategories} danh mục
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>Tạo Danh Mục Mới</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Tên danh mục *</label>
                <Input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='Nhập tên danh mục'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Mô tả *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Nhập mô tả danh mục'
                  rows={3}
                  className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='flex items-center gap-3 mt-6'>
              <Button onClick={handleCreateCategory} className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'>
                Tạo Danh Mục
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowCreateModal(false)
                  setFormData({ name: '', description: '' })
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
      {showEditModal && editingCategory && (
        <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>Chỉnh Sửa Danh Mục</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Tên danh mục *</label>
                <Input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='Nhập tên danh mục'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Mô tả *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Nhập mô tả danh mục'
                  rows={3}
                  className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='flex items-center gap-3 mt-6'>
              <Button onClick={handleUpdateCategory} className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'>
                Cập Nhật
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowEditModal(false)
                  setEditingCategory(null)
                  setFormData({ name: '', description: '' })
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
          setCategoryToDelete(null)
        }}
        onConfirm={confirmDeleteCategory}
        title='Xóa Danh Mục'
        message={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText='Xóa'
        cancelText='Hủy'
        type='danger'
        isLoading={deletingCategoryId === categoryToDelete?.id}
      />

      {/* View Modal */}
      {showViewModal && viewingCategory && (
        <ViewReportCategoryModal
          category={viewingCategory}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setViewingCategory(null)
          }}
        />
      )}
    </div>
  )
}

export default ReportCategoriesContent
