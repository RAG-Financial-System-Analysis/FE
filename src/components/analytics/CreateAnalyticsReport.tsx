import React, { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useReports } from '@/hooks/useReports'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Calendar, Building2, BarChart3, Loader2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Report } from '@/types/reports.types'

const CreateAnalyticsReport: React.FC = () => {
  const { generateReport, isLoading } = useAnalytics()
  const { myReports, publicReports, loadMyReports, loadPublicReports, isLoading: reportsLoading } = useReports()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [title, setTitle] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [reportType, setReportType] = useState<'my' | 'public'>('my')

  useEffect(() => {
    loadMyReports()
    loadPublicReports()
  }, [loadMyReports, loadPublicReports])

  const currentReports = reportType === 'my' ? myReports : publicReports

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedReport || !title.trim() || !sessionId.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      const result = await generateReport({
        sessionId: sessionId.trim(),
        reportFinancialId: selectedReport.id,
        title: title.trim()
      })

      if (result.success) {
        toast.success('Tạo báo cáo phân tích thành công!')
        setSelectedReport(null)
        setTitle('')
        setSessionId('')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error generating analytics report:', error)
      toast.error('Có lỗi xảy ra khi tạo báo cáo')
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
          <BarChart3 className='w-6 h-6 text-blue-600' />
          Tạo Báo Cáo Phân Tích
        </h1>
        <p className='text-gray-600 mt-1'>Tạo báo cáo phân tích AI từ chat session và báo cáo tài chính</p>
      </div>

      {/* Form */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <form onSubmit={handleGenerate} className='space-y-6'>
          {/* Session ID */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Session ID <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder='Nhập Session ID từ chat session'
              className='w-full'
              required
            />
            <p className='text-xs text-gray-500 mt-1'>Lấy Session ID từ chat session mà bạn muốn tạo báo cáo</p>
          </div>

          {/* Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Tiêu đề báo cáo <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Nhập tiêu đề cho báo cáo phân tích'
              className='w-full'
              required
            />
          </div>

          {/* Report Type Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Chọn báo cáo tài chính <span className='text-red-500'>*</span>
            </label>

            {/* Report Type Tabs */}
            <div className='flex mb-3 bg-gray-100 rounded-lg p-1'>
              <button
                type='button'
                onClick={() => {
                  setReportType('my')
                  setSelectedReport(null)
                }}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  reportType === 'my' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Báo cáo của tôi ({myReports.length})
              </button>
              <button
                type='button'
                onClick={() => {
                  setReportType('public')
                  setSelectedReport(null)
                }}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  reportType === 'public' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Báo cáo công khai ({publicReports.length})
              </button>
            </div>

            {/* Loading State */}
            {reportsLoading && (
              <div className='border border-gray-300 rounded-lg p-4'>
                <div className='flex items-center justify-center'>
                  <Loader2 className='w-5 h-5 animate-spin text-blue-600 mr-2' />
                  <span className='text-gray-600'>Đang tải báo cáo...</span>
                </div>
              </div>
            )}

            {/* Reports List */}
            {!reportsLoading && (
              <div className='border border-gray-300 rounded-lg max-h-80 overflow-y-auto'>
                {currentReports.length === 0 ? (
                  <div className='p-4 text-center text-gray-500'>
                    <FileText className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                    <p>Không có báo cáo nào</p>
                    <p className='text-xs mt-1'>
                      {reportType === 'my'
                        ? 'Vui lòng upload báo cáo tài chính trước'
                        : 'Chưa có báo cáo công khai nào'}
                    </p>
                  </div>
                ) : (
                  <div className='divide-y divide-gray-200'>
                    {currentReports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedReport?.id === report.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className='flex items-start gap-3'>
                          <div
                            className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                              selectedReport?.id === report.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}
                          >
                            {selectedReport?.id === report.id && <div className='w-2 h-2 bg-white rounded-full'></div>}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-gray-900 truncate'>{report.fileName}</p>
                            <div className='flex items-center gap-4 text-sm text-gray-500 mt-1'>
                              <span className='flex items-center gap-1'>
                                <Building2 className='w-4 h-4' />
                                {report.companyName}
                              </span>
                              <span className='flex items-center gap-1'>
                                <Calendar className='w-4 h-4' />
                                {report.year} - {report.period}
                              </span>
                              {report.visibility === 'public' && (
                                <span className='bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs'>
                                  Công khai
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-4 border-t border-gray-200'>
            <Button
              type='submit'
              disabled={isLoading || !selectedReport || !title.trim() || !sessionId.trim()}
              className='flex items-center gap-2 px-6'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Đang tạo báo cáo...
                </>
              ) : (
                <>
                  <Plus className='w-4 h-4' />
                  Tạo báo cáo phân tích
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAnalyticsReport
