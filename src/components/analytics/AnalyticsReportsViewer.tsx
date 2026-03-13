import React, { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Search,
  BarChart3,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  User,
  Clock,
  FileJson
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { AnalyticsReport } from '@/types/analytics.types'

const AnalyticsReportsViewer: React.FC = () => {
  const {
    analyticsReports,
    currentReport,
    isLoading,
    error,
    totalReports,
    loadAnalyticsReports,
    loadReportDetail,
    clearError
  } = useAnalytics()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Load reports on component mount and when filters change
  useEffect(() => {
    loadAnalyticsReports({
      page: currentPage,
      pageSize,
      sessionId: selectedSessionId || undefined
    })
  }, [currentPage, pageSize, selectedSessionId, loadAnalyticsReports])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadAnalyticsReports({
      page: 1,
      pageSize,
      sessionId: selectedSessionId || undefined
    })
  }

  const handleViewReport = async (reportId: string) => {
    setSelectedReportId(reportId)
    setShowDetailModal(true)
    await loadReportDetail(reportId)
  }

  const handleDownloadReport = (report: AnalyticsReport) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank')
      toast.success('Đang tải xuống báo cáo...')
    } else {
      toast.error('Không có file để tải xuống')
    }
  }

  const filteredReports = analyticsReports.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalReports / pageSize)

  const formatFileSize = () => {
    // Return generic file type info for analytics reports
    return 'JSON'
  }

  const formatGenerationType = (type: string) => {
    switch (type) {
      case 'auto':
        return 'Tự động'
      case 'manual':
        return 'Thủ công'
      default:
        return type
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
          <BarChart3 className='w-6 h-6 text-blue-600' />
          Xem Báo Cáo Phân Tích
        </h1>
        <p className='text-gray-600 mt-1'>Xem và tải xuống các báo cáo phân tích đã tạo</p>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6'>
        <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='Tìm kiếm theo tiêu đề...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='sm:w-64'>
            <Input
              type='text'
              placeholder='Session ID (tùy chọn)'
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='flex gap-2'>
            <Button type='submit' variant='outline' className='flex items-center gap-2'>
              <Search className='w-4 h-4' />
              Tìm kiếm
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setSearchTerm('')
                setSelectedSessionId('')
                setCurrentPage(1)
                loadAnalyticsReports({ page: 1, pageSize })
              }}
              className='flex items-center gap-2'
            >
              <RefreshCw className='w-4 h-4' />
              Làm mới
            </Button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-2 text-red-800'>
            <AlertCircle className='w-5 h-5' />
            <span className='font-medium'>Có lỗi xảy ra</span>
          </div>
          <p className='text-red-700 mt-1'>{error}</p>
          <Button
            onClick={clearError}
            variant='outline'
            size='sm'
            className='mt-2 border-red-300 text-red-700 hover:bg-red-50'
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
          <span className='ml-2 text-gray-600'>Đang tải...</span>
        </div>
      )}

      {/* Reports List */}
      {!isLoading && (
        <>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
            {filteredReports.length === 0 ? (
              <div className='text-center py-12'>
                <BarChart3 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>Chưa có báo cáo phân tích</h3>
                <p className='text-gray-600 mb-4'>Các báo cáo phân tích sẽ hiển thị ở đây</p>
              </div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {filteredReports.map((report) => (
                  <div key={report.id} className='p-6 hover:bg-gray-50 transition-colors'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-medium text-gray-900 mb-2 flex items-center gap-2'>
                          <FileJson className='w-5 h-5 text-blue-600' />
                          {report.title}
                        </h3>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-3'>
                          <div className='flex items-center gap-1'>
                            <Calendar className='w-4 h-4' />
                            <span>Tạo: {new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            <span>Lúc: {new Date(report.createdAt).toLocaleTimeString('vi-VN')}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <FileText className='w-4 h-4' />
                            <span>Loại: {formatGenerationType(report.generationType)}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <BarChart3 className='w-4 h-4' />
                            <span>Định dạng: {formatFileSize()}</span>
                          </div>
                        </div>

                        {report.sessionId && (
                          <div className='bg-blue-50 rounded-lg p-3 mb-3'>
                            <p className='text-xs text-blue-800 font-medium mb-1'>Session liên quan:</p>
                            <p className='text-xs text-blue-600 font-mono break-all'>{report.sessionId}</p>
                          </div>
                        )}
                      </div>

                      <div className='flex items-center gap-2 ml-4'>
                        <Button
                          onClick={() => handleViewReport(report.id)}
                          variant='outline'
                          size='sm'
                          className='flex items-center gap-1'
                        >
                          <Eye className='w-4 h-4' />
                          Xem chi tiết
                        </Button>
                        {report.fileUrl && (
                          <Button
                            onClick={() => handleDownloadReport(report)}
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-1'
                          >
                            <Download className='w-4 h-4' />
                            Tải xuống
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between mt-6'>
              <p className='text-sm text-gray-700'>
                Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalReports)} trong
                tổng số {totalReports} báo cáo
              </p>
              <div className='flex items-center gap-2'>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant='outline'
                  size='sm'
                >
                  Trước
                </Button>
                <span className='px-3 py-1 text-sm text-gray-700'>
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  variant='outline'
                  size='sm'
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Report Detail Modal */}
      {showDetailModal && selectedReportId && currentReport && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                  <FileJson className='w-5 h-5 text-blue-600' />
                  Chi Tiết Báo Cáo Phân Tích
                </h2>
                <Button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedReportId(null)
                  }}
                  variant='outline'
                  size='sm'
                >
                  Đóng
                </Button>
              </div>
            </div>

            <div className='p-6'>
              <div className='space-y-6'>
                {/* Basic Info */}
                <div>
                  <h3 className='font-medium text-gray-900 mb-3'>Thông tin cơ bản</h3>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <span className='text-sm text-gray-500'>Tiêu đề:</span>
                        <p className='font-medium text-gray-900'>{currentReport.title}</p>
                      </div>
                      <div>
                        <span className='text-sm text-gray-500'>Loại tạo:</span>
                        <p className='font-medium text-gray-900'>
                          {formatGenerationType(currentReport.generationType)}
                        </p>
                      </div>
                      <div>
                        <span className='text-sm text-gray-500'>Ngày tạo:</span>
                        <p className='font-medium text-gray-900'>
                          {new Date(currentReport.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      {currentReport.generatedBy && (
                        <div>
                          <span className='text-sm text-gray-500'>Tạo bởi:</span>
                          <p className='font-medium text-gray-900 flex items-center gap-1'>
                            <User className='w-4 h-4' />
                            {currentReport.generatedBy.fullName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                {currentReport.sessionId && (
                  <div>
                    <h3 className='font-medium text-gray-900 mb-3'>Thông tin Session</h3>
                    <div className='bg-blue-50 rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <BarChart3 className='w-4 h-4 text-blue-600' />
                        <span className='text-sm font-medium text-blue-900'>Session ID</span>
                      </div>
                      <p className='font-mono text-sm text-blue-800 break-all'>{currentReport.sessionId}</p>
                    </div>
                  </div>
                )}

                {/* Financial Report Info */}
                {currentReport.reportFinancialId && (
                  <div>
                    <h3 className='font-medium text-gray-900 mb-3'>Báo cáo tài chính liên quan</h3>
                    <div className='bg-green-50 rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <FileText className='w-4 h-4 text-green-600' />
                        <span className='text-sm font-medium text-green-900'>Financial Report ID</span>
                      </div>
                      <p className='font-mono text-sm text-green-800 break-all'>{currentReport.reportFinancialId}</p>
                    </div>
                  </div>
                )}

                {/* Generated Content */}
                {currentReport.generatedContent && (
                  <div>
                    <h3 className='font-medium text-gray-900 mb-3'>Nội dung được tạo</h3>
                    <div className='bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto'>
                      <pre className='text-sm text-gray-700 whitespace-pre-wrap font-mono'>
                        {currentReport.generatedContent}
                      </pre>
                    </div>
                  </div>
                )}

                {/* File Download */}
                {currentReport.fileUrl && (
                  <div>
                    <h3 className='font-medium text-gray-900 mb-3'>File báo cáo</h3>
                    <div className='flex items-center gap-3'>
                      <Button
                        onClick={() => window.open(currentReport.fileUrl, '_blank')}
                        className='flex items-center gap-2'
                      >
                        <ExternalLink className='w-4 h-4' />
                        Mở file báo cáo
                      </Button>
                      <Button
                        onClick={() => {
                          window.open(currentReport.fileUrl, '_blank')
                          toast.success('Đang tải xuống báo cáo...')
                        }}
                        variant='outline'
                        className='flex items-center gap-2'
                      >
                        <Download className='w-4 h-4' />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsReportsViewer
