import { useEffect, useState, useMemo, useCallback } from 'react'
import { useReports } from '@/hooks/useReports'
import { useCompanies } from '@/hooks/useCompanies'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import {
  FileText,
  Search,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  Filter,
  Calendar,
  Building2,
  User,
  Upload,
  Globe,
  Lock
} from 'lucide-react'
import type { Report } from '@/types/reports.types'
import toast from 'react-hot-toast'
import AutoRefreshIndicator from '@/components/common/AutoRefreshIndicator'

const ReportsManagementContent = () => {
  const {
    myReports,
    publicReports,
    reportCategories,
    isLoading,
    error,
    loadMyReports,
    loadPublicReports,
    loadReportCategories,
    deleteReport,
    downloadReport,
    uploadReport,
    updateVisibility,
    clearError
  } = useReports()

  const { companies, loadCompanies } = useCompanies()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'public' | 'private'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    companyId: '',
    categoryId: '',
    year: new Date().getFullYear(),
    period: '',
    visibility: 'private' as 'private' | 'public'
  })
  const [isUploading, setIsUploading] = useState(false)

  // Combine all reports for admin view
  const allReports = useMemo(() => {
    const combined = [...myReports, ...publicReports]
    // Remove duplicates based on ID
    const unique = combined.filter((report, index, self) => index === self.findIndex((r) => r.id === report.id))
    return unique
  }, [myReports, publicReports])

  useEffect(() => {
    loadMyReports()
    loadPublicReports()
    loadReportCategories()
    loadCompanies()
  }, [loadMyReports, loadPublicReports, loadReportCategories, loadCompanies])

  // Auto refresh function
  const handleAutoRefresh = useCallback(async () => {
    await Promise.all([loadMyReports(), loadPublicReports()])
  }, [loadMyReports, loadPublicReports])

  // Auto refresh hook - 45 seconds interval for reports management
  const autoRefresh = useAutoRefresh({
    interval: 45000, // 45 seconds
    onRefresh: handleAutoRefresh
  })

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.categoryName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'public' && report.visibility === 'public') ||
      (filterStatus === 'private' && report.visibility === 'private')

    return matchesSearch && matchesFilter
  })

  const handleDeleteReport = async (reportId: string) => {
    if (deleteConfirm === reportId) {
      await deleteReport(reportId)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(reportId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setShowDetailModal(true)
  }

  const handleDownloadReport = async (report: Report) => {
    await downloadReport(report.id, report.fileName)
  }

  const handleToggleVisibility = async (report: Report) => {
    const newVisibility = report.visibility === 'public' ? 'private' : 'public'
    const result = await updateVisibility(report.id, { visibility: newVisibility })

    if (result.success) {
      toast.success(`Đã chuyển báo cáo thành ${newVisibility === 'public' ? 'công khai' : 'riêng tư'}`)
      // Reload reports to reflect changes
      loadMyReports()
      loadPublicReports()
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi cập nhật visibility')
    }
  }

  const handleUploadReport = async () => {
    if (!uploadForm.file || !uploadForm.companyId || !uploadForm.categoryId || !uploadForm.period) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadReport({
        file: uploadForm.file,
        companyId: uploadForm.companyId,
        categoryId: uploadForm.categoryId,
        year: uploadForm.year,
        period: uploadForm.period,
        visibility: uploadForm.visibility
      })

      if (result.success) {
        toast.success(result.message || 'Upload báo cáo thành công!')
        setShowUploadModal(false)
        setUploadForm({
          file: null,
          companyId: '',
          categoryId: '',
          year: new Date().getFullYear(),
          period: '',
          visibility: 'private'
        })
        // Reload reports
        loadMyReports()
        loadPublicReports()
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi upload báo cáo')
      }
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Có lỗi xảy ra khi upload báo cáo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Chỉ chấp nhận file PDF')
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        // 50MB
        toast.error('File không được vượt quá 50MB')
        return
      }
      setUploadForm((prev) => ({ ...prev, file }))
    }
  }

  const getStatusBadge = (visibility: 'private' | 'public') => {
    return visibility === 'public' ? (
      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
        Công khai
      </span>
    ) : (
      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
        Riêng tư
      </span>
    )
  }

  if (isLoading && allReports.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Đang tải danh sách báo cáo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Quản Lý Báo Cáo</h1>
            <p className='text-slate-600'>Quản lý tất cả báo cáo trong hệ thống</p>
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
            <button
              onClick={() => setShowUploadModal(true)}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <Upload className='w-4 h-4' />
              Upload Báo Cáo
            </button>
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
          <button onClick={clearError} className='text-red-600 hover:text-red-700 hover:bg-red-100 rounded p-1'>
            ✕
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className='mb-6 flex flex-col sm:flex-row gap-4'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Tìm kiếm báo cáo, công ty, danh mục...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        {/* Filter */}
        <div className='flex items-center gap-2'>
          <Filter className='w-4 h-4 text-slate-500' />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'public' | 'private')}
            className='px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='all'>Tất cả</option>
            <option value='public'>Công khai</option>
            <option value='private'>Riêng tư</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-white rounded-lg p-4 border border-slate-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <FileText className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm text-slate-600'>Tổng báo cáo</p>
              <p className='text-xl font-semibold text-slate-900'>{allReports.length}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-slate-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
              <Eye className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-slate-600'>Công khai</p>
              <p className='text-xl font-semibold text-slate-900'>
                {allReports.filter((r) => r.visibility === 'public').length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-slate-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
              <FileText className='w-5 h-5 text-gray-600' />
            </div>
            <div>
              <p className='text-sm text-slate-600'>Riêng tư</p>
              <p className='text-xl font-semibold text-slate-900'>
                {allReports.filter((r) => r.visibility === 'private').length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-slate-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
              <Building2 className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <p className='text-sm text-slate-600'>Công ty</p>
              <p className='text-xl font-semibold text-slate-900'>
                {new Set(allReports.map((r) => r.companyName).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className='bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200'
          >
            {/* Card Header */}
            <div className='p-6 border-b border-slate-100'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
                    <FileText className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-slate-900 line-clamp-1 mb-1'>{report.fileName}</h3>
                    <p className='text-sm text-slate-500'>{(report.fileSizeKb / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                {getStatusBadge(report.visibility)}
              </div>
            </div>

            {/* Card Body */}
            <div className='p-6 space-y-4'>
              {/* Company Info */}
              <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                <Building2 className='w-5 h-5 text-slate-400' />
                <div>
                  <p className='text-sm font-medium text-slate-900'>{report.companyName}</p>
                  <p className='text-xs text-slate-500'>Ticker: {report.ticker}</p>
                </div>
              </div>

              {/* Report Details */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-slate-500 mb-1'>Danh mục</p>
                  <p className='text-sm font-medium text-slate-900'>{report.categoryName}</p>
                </div>
                <div>
                  <p className='text-xs text-slate-500 mb-1'>Năm - Kỳ</p>
                  <p className='text-sm font-medium text-slate-900'>
                    {report.year} - {report.period}
                  </p>
                </div>
              </div>

              {/* Upload Date */}
              <div className='flex items-center gap-2 text-sm text-slate-500'>
                <Calendar className='w-4 h-4' />
                <span>Tải lên: {new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className='px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4 text-slate-400' />
                  <span className='text-sm text-slate-600'>Admin</span>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => handleViewReport(report)}
                    className='p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                    title='Xem chi tiết'
                  >
                    <Eye className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className='p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                    title='Tải xuống'
                  >
                    <Download className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(report)}
                    className={`p-2 rounded-lg transition-colors ${
                      report.visibility === 'public'
                        ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                        : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                    title={`Chuyển thành ${report.visibility === 'public' ? 'riêng tư' : 'công khai'}`}
                  >
                    {report.visibility === 'public' ? <Lock className='w-4 h-4' /> : <Globe className='w-4 h-4' />}
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === report.id
                        ? 'text-red-600 bg-red-50'
                        : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={deleteConfirm === report.id ? 'Nhấn lại để xác nhận xóa' : 'Xóa'}
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && !isLoading && (
        <div className='text-center py-16'>
          <div className='w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <FileText className='w-12 h-12 text-slate-400' />
          </div>
          <h3 className='text-xl font-semibold text-slate-900 mb-2'>Không tìm thấy báo cáo</h3>
          <p className='text-slate-500 max-w-md mx-auto'>
            {searchTerm || filterStatus !== 'all'
              ? 'Không có báo cáo nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.'
              : 'Chưa có báo cáo nào trong hệ thống. Báo cáo sẽ xuất hiện ở đây khi người dùng tải lên.'}
          </p>
        </div>
      )}

      {/* Report Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-slate-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-slate-900'>Chi Tiết Báo Cáo</h2>
                <button onClick={() => setShowDetailModal(false)} className='text-slate-400 hover:text-slate-600'>
                  ✕
                </button>
              </div>
            </div>

            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Tên file</label>
                <p className='text-slate-900'>{selectedReport.fileName}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>Công ty</label>
                  <p className='text-slate-900'>{selectedReport.companyName}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>Ticker</label>
                  <p className='text-slate-900'>{selectedReport.ticker}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>Danh mục</label>
                  <p className='text-slate-900'>{selectedReport.categoryName}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>Năm - Kỳ</label>
                  <p className='text-slate-900'>
                    {selectedReport.year} - {selectedReport.period}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>Trạng thái</label>
                  {getStatusBadge(selectedReport.visibility)}
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>Kích thước</label>
                  <p className='text-slate-900'>{(selectedReport.fileSizeKb / 1024).toFixed(1)} MB</p>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Ngày tải lên</label>
                <p className='text-slate-900'>{new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</p>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => handleDownloadReport(selectedReport)}
                  className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                  Tải xuống
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className='flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50'
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Upload Report Modal */}
      {showUploadModal && (
        <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-slate-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-slate-900'>Upload Báo Cáo Mới</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className='text-slate-400 hover:text-slate-600'
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className='p-6 space-y-6'>
              {/* File Upload */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  File PDF <span className='text-red-500'>*</span>
                </label>
                <div className='border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors'>
                  <input
                    type='file'
                    accept='.pdf'
                    onChange={handleFileChange}
                    className='hidden'
                    id='file-upload'
                    disabled={isUploading}
                  />
                  <label htmlFor='file-upload' className='cursor-pointer'>
                    <Upload className='w-8 h-8 text-slate-400 mx-auto mb-2' />
                    <p className='text-sm text-slate-600'>
                      {uploadForm.file ? uploadForm.file.name : 'Chọn file PDF để upload'}
                    </p>
                    <p className='text-xs text-slate-500 mt-1'>Tối đa 50MB</p>
                  </label>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Company */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Công ty <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={uploadForm.companyId}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, companyId: e.target.value }))}
                    className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    disabled={isUploading}
                  >
                    <option value=''>Chọn công ty</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name} ({company.ticker})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Danh mục <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={uploadForm.categoryId}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                    className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    disabled={isUploading}
                  >
                    <option value=''>Chọn danh mục</option>
                    {reportCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Year */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Năm <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    min='2000'
                    max='2100'
                    value={uploadForm.year}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
                    className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    disabled={isUploading}
                  />
                </div>

                {/* Period */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Kỳ báo cáo <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    placeholder='VD: Q1, Q2, Năm'
                    maxLength={10}
                    value={uploadForm.period}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, period: e.target.value }))}
                    className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Quyền truy cập</label>
                <div className='flex gap-4'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='visibility'
                      value='private'
                      checked={uploadForm.visibility === 'private'}
                      onChange={(e) =>
                        setUploadForm((prev) => ({ ...prev, visibility: e.target.value as 'private' | 'public' }))
                      }
                      className='mr-2'
                      disabled={isUploading}
                    />
                    <span className='text-sm text-slate-700'>Riêng tư</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='visibility'
                      value='public'
                      checked={uploadForm.visibility === 'public'}
                      onChange={(e) =>
                        setUploadForm((prev) => ({ ...prev, visibility: e.target.value as 'private' | 'public' }))
                      }
                      className='mr-2'
                      disabled={isUploading}
                    />
                    <span className='text-sm text-slate-700'>Công khai</span>
                  </label>
                </div>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={handleUploadReport}
                  disabled={
                    isUploading ||
                    !uploadForm.file ||
                    !uploadForm.companyId ||
                    !uploadForm.categoryId ||
                    !uploadForm.period
                  }
                  className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {isUploading ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Đang upload...
                    </>
                  ) : (
                    <>
                      <Upload className='w-4 h-4' />
                      Upload Báo Cáo
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className='flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50'
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsManagementContent
