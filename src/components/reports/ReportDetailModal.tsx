import { useEffect } from 'react'
import { useReports } from '@/hooks/useReports'
import {
  X,
  FileText,
  Building2,
  Calendar,
  User,
  Download,
  Globe,
  Lock,
  HardDrive,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReportDetailModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: string
}

export const ReportDetailModal = ({ isOpen, onClose, reportId }: ReportDetailModalProps) => {
  const { currentReport, isLoading, error, loadReportDetail, downloadReport } = useReports()

  useEffect(() => {
    if (isOpen && reportId) {
      loadReportDetail(reportId)
    }
  }, [isOpen, reportId, loadReportDetail])

  if (!isOpen) return null

  const handleDownload = async () => {
    if (currentReport) {
      await downloadReport(currentReport.id, currentReport.fileName)
    }
  }

  const formatFileSize = (sizeKb: number) => {
    if (sizeKb < 1024) return `${sizeKb} KB`
    return `${(sizeKb / 1024).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMetricValue = (value: number, unit: string) => {
    if (unit === 'VND' && value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} tỷ ${unit}`
    }
    if (unit === 'VND' && value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} triệu ${unit}`
    }
    if (unit === '%') {
      return `${value.toFixed(2)}%`
    }
    return `${value.toLocaleString()} ${unit}`
  }

  return (
    <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-slate-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-slate-900'>Chi Tiết Báo Cáo</h2>
            <Button variant='ghost' size='sm' onClick={onClose}>
              <X className='w-5 h-5' />
            </Button>
          </div>
        </div>

        <div className='p-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                <p className='text-slate-600'>Đang tải chi tiết báo cáo...</p>
              </div>
            </div>
          ) : error ? (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 shrink-0' />
              <div>
                <h3 className='text-red-800 font-medium mb-1'>Có lỗi xảy ra</h3>
                <p className='text-red-700 text-sm'>{error}</p>
              </div>
            </div>
          ) : currentReport ? (
            <div className='space-y-6'>
              {/* Header Info */}
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-3'>
                      <FileText className='w-6 h-6 text-blue-600' />
                      <h3 className='text-xl font-semibold text-slate-900'>{currentReport.fileName}</h3>
                      {currentReport.visibility === 'private' ? (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700'>
                          <Lock className='w-4 h-4 mr-1' />
                          Riêng tư
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700'>
                          <Globe className='w-4 h-4 mr-1' />
                          Công khai
                        </span>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='flex items-center gap-2 text-slate-600'>
                        <Building2 className='w-4 h-4' />
                        <span>
                          {currentReport.company.name} ({currentReport.company.ticker})
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-slate-600'>
                        <FileText className='w-4 h-4' />
                        <span>{currentReport.categoryName}</span>
                      </div>
                      <div className='flex items-center gap-2 text-slate-600'>
                        <Calendar className='w-4 h-4' />
                        <span>
                          {currentReport.year} - {currentReport.period}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-slate-600'>
                        <HardDrive className='w-4 h-4' />
                        <span>{formatFileSize(currentReport.fileSizeKb)}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleDownload} className='bg-blue-600 hover:bg-blue-700 text-white ml-4'>
                    <Download className='w-4 h-4 mr-2' />
                    Tải Xuống
                  </Button>
                </div>
              </div>

              {/* Upload Info */}
              <div className='bg-white rounded-xl p-6 border border-slate-200'>
                <h4 className='text-lg font-semibold text-slate-900 mb-4'>Thông Tin Upload</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center gap-3'>
                    <User className='w-5 h-5 text-slate-400' />
                    <div>
                      <p className='text-sm text-slate-500'>Được tải lên bởi</p>
                      <p className='font-medium text-slate-900'>{currentReport.uploadedBy.fullName}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Calendar className='w-5 h-5 text-slate-400' />
                    <div>
                      <p className='text-sm text-slate-500'>Thời gian tải lên</p>
                      <p className='font-medium text-slate-900'>{formatDate(currentReport.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              {currentReport.metrics && currentReport.metrics.length > 0 && (
                <div className='bg-white rounded-xl p-6 border border-slate-200'>
                  <div className='flex items-center gap-2 mb-4'>
                    <TrendingUp className='w-5 h-5 text-green-600' />
                    <h4 className='text-lg font-semibold text-slate-900'>Chỉ Số Tài Chính</h4>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {currentReport.metrics.map((metric, index) => (
                      <div key={index} className='bg-slate-50 rounded-lg p-4'>
                        <h5 className='font-medium text-slate-900 mb-1'>{metric.name}</h5>
                        <p className='text-sm text-slate-500 mb-2'>{metric.code}</p>
                        <p className='text-lg font-semibold text-blue-600'>
                          {formatMetricValue(metric.value, metric.unit)}
                        </p>
                        {metric.group && <p className='text-xs text-slate-400 mt-1'>Nhóm: {metric.group}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className='bg-white rounded-xl p-6 border border-slate-200'>
                <h4 className='text-lg font-semibold text-slate-900 mb-4'>Thông Tin File</h4>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Tên file:</span>
                    <span className='font-medium text-slate-900'>{currentReport.fileName}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Kích thước:</span>
                    <span className='font-medium text-slate-900'>{formatFileSize(currentReport.fileSizeKb)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Đường dẫn:</span>
                    <span
                      className='font-medium text-slate-900 text-sm truncate max-w-xs'
                      title={currentReport.fileUrl}
                    >
                      {currentReport.fileUrl}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-slate-600'>Quyền truy cập:</span>
                    <span
                      className={`font-medium ${currentReport.visibility === 'private' ? 'text-slate-700' : 'text-green-600'}`}
                    >
                      {currentReport.visibility === 'private' ? 'Riêng tư' : 'Công khai'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center py-12'>
              <FileText className='w-16 h-16 text-slate-300 mx-auto mb-4' />
              <p className='text-slate-500'>Không tìm thấy thông tin báo cáo</p>
            </div>
          )}
        </div>

        <div className='p-6 border-t border-slate-200 flex justify-end'>
          <Button onClick={onClose} variant='outline'>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
