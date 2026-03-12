import { useEffect, useState } from 'react'
import { useReports } from '@/hooks/useReports'
import { useCompanies } from '@/hooks/useCompanies'
import { useAdmin } from '@/hooks/useAdmin'
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Globe,
  Lock,
  AlertCircle,
  Plus,
  Calendar,
  Building2,
  FileType,
  HardDrive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadReportModal } from './UploadReportModal'
import { ReportDetailModal } from './ReportDetailModal'

const ReportsContent = () => {
  const {
    myReports,
    publicReports,
    isLoading,
    error,
    totalMyReports,
    totalPublicReports,
    loadMyReports,
    loadPublicReports,
    updateVisibility,
    deleteReport,
    downloadReport,
    clearError
  } = useReports()

  const { companies, loadCompanies } = useCompanies()
  const { reportCategories, loadReportCategories } = useAdmin()

  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my')
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    loadMyReports()
    loadPublicReports()
    loadCompanies()
    loadReportCategories()
  }, [loadMyReports, loadPublicReports, loadCompanies, loadReportCategories])

  const currentReports = activeTab === 'my' ? myReports : publicReports

  const filteredReports = currentReports.filter(
    (report) =>
      report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleVisibilityToggle = async (reportId: string, currentVisibility: 'private' | 'public') => {
    const newVisibility = currentVisibility === 'private' ? 'public' : 'private'
    const result = await updateVisibility(reportId, { visibility: newVisibility })

    if (result.success) {
      // Refresh both lists
      loadMyReports()
      loadPublicReports()
    }
  }

  const handleDeleteReport = async (reportId: string, fileName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa báo cáo "${fileName}"?`)) return

    const result = await deleteReport(reportId)
    if (result.success) {
      // Refresh both lists
      loadMyReports()
      loadPublicReports()
    }
  }

  const handleDownloadReport = async (reportId: string, fileName: string) => {
    await downloadReport(reportId, fileName)
  }

  const handleViewReport = (reportId: string) => {
    setSelectedReport(reportId)
    setIsDetailModalOpen(true)
  }

  const formatFileSize = (sizeKb: number) => {
    if (sizeKb < 1024) return `${sizeKb} KB`
    return `${(sizeKb / 1024).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading && currentReports.length === 0) {
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
    <div className='p-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Quản Lý Báo Cáo</h1>
            <p className='text-slate-600'>Upload, quản lý và chia sẻ báo cáo tài chính</p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)} className='bg-blue-600 hover:bg-blue-700 text-white'>
            <Upload className='w-4 h-4 mr-2' />
            Upload Báo Cáo
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

      {/* Tabs and Search */}
      <div className='mb-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-1 bg-slate-100 rounded-lg p-1'>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className='w-4 h-4 mr-2 inline' />
              Báo Cáo Của Tôi ({totalMyReports})
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'public' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className='w-4 h-4 mr-2 inline' />
              Báo Cáo Công Khai ({totalPublicReports})
            </button>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
            <Input
              type='text'
              placeholder='Tìm kiếm theo tên file, công ty, ticker...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 h-10'
            />
          </div>
          <Button variant='outline' className='h-10'>
            <Filter className='w-4 h-4 mr-2' />
            Bộ Lọc
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        {filteredReports.length === 0 ? (
          <div className='p-12 text-center'>
            <FileText className='w-16 h-16 text-slate-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-slate-900 mb-2'>
              {searchTerm ? 'Không tìm thấy báo cáo nào' : 'Chưa có báo cáo nào'}
            </h3>
            <p className='text-slate-500 mb-6'>
              {searchTerm
                ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc'
                : activeTab === 'my'
                  ? 'Upload báo cáo đầu tiên của bạn để bắt đầu'
                  : 'Chưa có báo cáo công khai nào được chia sẻ'}
            </p>
            {activeTab === 'my' && !searchTerm && (
              <Button onClick={() => setIsUploadModalOpen(true)} className='bg-blue-600 hover:bg-blue-700 text-white'>
                <Plus className='w-4 h-4 mr-2' />
                Upload Báo Cáo Đầu Tiên
              </Button>
            )}
          </div>
        ) : (
          <div className='divide-y divide-slate-200'>
            {filteredReports.map((report) => (
              <div key={report.id} className='p-6 hover:bg-slate-50 transition-colors'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='flex items-center gap-2'>
                        <FileText className='w-5 h-5 text-blue-600' />
                        <h3 className='text-lg font-semibold text-slate-900 truncate'>{report.fileName}</h3>
                      </div>
                      <div className='flex items-center gap-2'>
                        {report.visibility === 'private' ? (
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700'>
                            <Lock className='w-3 h-3 mr-1' />
                            Riêng tư
                          </span>
                        ) : (
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                            <Globe className='w-3 h-3 mr-1' />
                            Công khai
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-3'>
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <Building2 className='w-4 h-4' />
                        <span>
                          {report.companyName} ({report.ticker})
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <FileType className='w-4 h-4' />
                        <span>{report.categoryName}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <Calendar className='w-4 h-4' />
                        <span>
                          {report.year} - {report.period}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <HardDrive className='w-4 h-4' />
                        <span>{formatFileSize(report.fileSizeKb)}</span>
                      </div>
                    </div>

                    <p className='text-sm text-slate-500'>Tải lên: {formatDate(report.createdAt)}</p>
                  </div>

                  <div className='flex items-center gap-2 ml-4'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleViewReport(report.id)}
                      className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDownloadReport(report.id, report.fileName)}
                      className='text-green-600 hover:text-green-700 hover:bg-green-50'
                    >
                      <Download className='w-4 h-4' />
                    </Button>
                    {activeTab === 'my' && (
                      <>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleVisibilityToggle(report.id, report.visibility)}
                          className={
                            report.visibility === 'private'
                              ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                              : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                          }
                          title={report.visibility === 'private' ? 'Công khai báo cáo' : 'Chuyển về riêng tư'}
                        >
                          {report.visibility === 'private' ? (
                            <Globe className='w-4 h-4' />
                          ) : (
                            <Lock className='w-4 h-4' />
                          )}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteReport(report.id, report.fileName)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <UploadReportModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        companies={companies}
        categories={reportCategories}
        onSuccess={() => {
          loadMyReports()
          loadPublicReports()
        }}
      />

      {selectedReport && (
        <ReportDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedReport(null)
          }}
          reportId={selectedReport}
        />
      )}
    </div>
  )
}

export default ReportsContent
