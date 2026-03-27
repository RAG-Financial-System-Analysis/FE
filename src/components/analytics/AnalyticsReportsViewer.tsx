import React, { useState, useEffect } from 'react'
import { useAnalytics, useChat } from '@/hooks'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
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
  FileJson,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { AnalyticsReport } from '@/types'

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

  const { sessions, loadSessions } = useChat()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5) // 5 items per page as requested
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Load sessions on component mount
  useEffect(() => {
    loadSessions()
  }, [loadSessions])

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
    <div className='h-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <div className='p-8 max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                <BarChart3 className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>Xem Báo Cáo Phân Tích</h1>
                <p className='text-slate-600 mt-1'>Xem và tải xuống các báo cáo phân tích đã tạo</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8'>
            <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <Input
                  type='text'
                  placeholder='Tìm kiếm theo tiêu đề...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-400'
                />
              </div>
              <div className='sm:w-64'>
                <div className='relative'>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => {
                      setSelectedSessionId(e.target.value)
                      setCurrentPage(1) // Reset to first page when changing session
                    }}
                    className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200 hover:border-slate-400'
                  >
                    <option value=''>Tất cả sessions</option>
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button
                  type='submit'
                  variant='outline'
                  className='flex items-center gap-2 px-6 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200'
                >
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
                  className='flex items-center gap-2 px-6 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200'
                >
                  <RefreshCw className='w-4 h-4' />
                  Làm mới
                </Button>
              </div>
            </form>
          </div>

          {/* Error State */}
          {error && (
            <div className='bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 mb-8'>
              <div className='flex items-center gap-3 text-red-800 mb-3'>
                <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                  <AlertCircle className='w-4 h-4 text-red-600' />
                </div>
                <span className='font-semibold'>Có lỗi xảy ra</span>
              </div>
              <p className='text-red-700 mb-4'>{error}</p>
              <Button
                onClick={clearError}
                variant='outline'
                size='sm'
                className='border-red-300 text-red-700 hover:bg-red-50 rounded-xl'
              >
                Thử lại
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center'>
                  <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
                </div>
                <span className='text-slate-600 font-medium'>Đang tải báo cáo...</span>
              </div>
            </div>
          )}

          {/* Reports List */}
          {!isLoading && (
            <>
              <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden'>
                {filteredReports.length === 0 ? (
                  <div className='text-center py-16'>
                    <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center'>
                      <BarChart3 className='w-10 h-10 text-slate-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-slate-700 mb-3'>Chưa có báo cáo phân tích</h3>
                    <p className='text-slate-500 mb-6'>Các báo cáo phân tích sẽ hiển thị ở đây</p>
                  </div>
                ) : (
                  <div className='divide-y divide-slate-200/60'>
                    {filteredReports.map((report) => (
                      <div key={report.id} className='p-6 hover:bg-slate-50/50 transition-all duration-200'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1 min-w-0'>
                            <h3 className='text-lg font-semibold text-slate-900 mb-3 flex items-center gap-3'>
                              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <FileJson className='w-4 h-4 text-blue-600' />
                              </div>
                              {report.title}
                            </h3>

                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-4'>
                              <div className='flex items-center gap-2'>
                                <Calendar className='w-4 h-4 text-slate-400' />
                                <span>Tạo: {new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Clock className='w-4 h-4 text-slate-400' />
                                <span>Lúc: {new Date(report.createdAt).toLocaleTimeString('vi-VN')}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <FileText className='w-4 h-4 text-slate-400' />
                                <span>Loại: {formatGenerationType(report.generationType)}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <BarChart3 className='w-4 h-4 text-slate-400' />
                                <span>Định dạng: {formatFileSize()}</span>
                              </div>
                            </div>

                            {report.sessionId && (
                              <div className='bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-blue-200/60'>
                                <p className='text-xs text-blue-700 font-semibold mb-2 flex items-center gap-2'>
                                  <BarChart3 className='w-3 h-3' />
                                  Session liên quan:
                                </p>
                                <p className='text-sm text-blue-800 font-medium mb-1'>
                                  {sessions.find((s) => s.id === report.sessionId)?.title || 'Session không tìm thấy'}
                                </p>
                                <p className='text-xs text-blue-600 font-mono break-all'>{report.sessionId}</p>
                              </div>
                            )}
                          </div>

                          <div className='flex items-center gap-3 ml-6'>
                            <Button
                              onClick={() => handleViewReport(report.id)}
                              variant='outline'
                              size='sm'
                              className='flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200'
                            >
                              <Eye className='w-4 h-4' />
                              Xem chi tiết
                            </Button>
                            {report.fileUrl && (
                              <Button
                                onClick={() => handleDownloadReport(report)}
                                variant='outline'
                                size='sm'
                                className='flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200'
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
              {filteredReports.length > 0 && (
                <div className='flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 px-6 py-4 mt-8 shadow-lg'>
                  <div className='text-sm text-slate-600'>
                    Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalReports)}{' '}
                    trong tổng số {totalReports} báo cáo
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-1'
                    >
                      <ChevronLeft className='w-4 h-4' />
                      Trước
                    </Button>
                    <span className='text-sm text-slate-700 px-3'>
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-1'
                    >
                      Sau
                      <ChevronRight className='w-4 h-4' />
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
                            <span className='text-sm font-medium text-blue-900'>Session</span>
                          </div>
                          <p className='text-sm font-medium text-blue-800 mb-1'>
                            {sessions.find((s) => s.id === currentReport.sessionId)?.title || 'Session không tìm thấy'}
                          </p>
                          <p className='font-mono text-xs text-blue-600 break-all'>ID: {currentReport.sessionId}</p>
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
                            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'
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
                            className='flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50'
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
      </div>
    </div>
  )
}

export default AnalyticsReportsViewer
