import React, { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useChat } from '@/hooks/useChat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BarChart3, Loader2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateAnalyticsReport: React.FC = () => {
  const { generateReportAsync, isLoading } = useAnalytics()
  const { sessions, loadSessions } = useChat()
  const [title, setTitle] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState('')

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !selectedSessionId) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      const result = await generateReportAsync({
        sessionId: selectedSessionId,
        title: title.trim()
      })

      if (result.success) {
        toast.success('Tạo báo cáo phân tích thành công! Báo cáo đang được xử lý trong nền.')
        setTitle('')
        setSelectedSessionId('')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error generating analytics report:', error)
      toast.error('Có lỗi xảy ra khi tạo báo cáo')
    }
  }

  return (
    <div className='h-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <div className='p-8 max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                <BarChart3 className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>Tạo Báo Cáo Phân Tích</h1>
                <p className='text-slate-600 mt-1'>Tạo báo cáo phân tích AI từ chat session</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-2xl mx-auto'>
            <form onSubmit={handleGenerate} className='space-y-8'>
              {/* Session Selection */}
              <div className='space-y-3'>
                <label className='block text-sm font-semibold text-slate-700'>
                  Chọn Session <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-slate-900 appearance-none cursor-pointer transition-all duration-200 hover:border-slate-400'
                    required
                  >
                    <option value=''>Chọn session chat</option>
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title} - {session.analyticsTypeName}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>
                <p className='text-xs text-slate-500 flex items-center gap-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  Chọn session chat mà bạn muốn tạo báo cáo phân tích
                </p>
              </div>

              {/* Title */}
              <div className='space-y-3'>
                <label className='block text-sm font-semibold text-slate-700'>
                  Tiêu đề báo cáo <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Nhập tiêu đề cho báo cáo phân tích'
                  className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-400'
                  required
                />
                <p className='text-xs text-slate-500 flex items-center gap-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                  Tiêu đề sẽ được hiển thị trong danh sách báo cáo
                </p>
              </div>

              {/* Submit Button */}
              <div className='pt-6 border-t border-slate-200'>
                <Button
                  type='submit'
                  disabled={isLoading || !title.trim() || !selectedSessionId}
                  className='w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      Đang tạo báo cáo...
                    </>
                  ) : (
                    <>
                      <Plus className='w-5 h-5' />
                      Tạo báo cáo phân tích
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className='grid md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto'>
            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <h3 className='font-semibold text-slate-800'>Xử lý nhanh</h3>
              </div>
              <p className='text-sm text-slate-600'>
                Báo cáo được tạo tự động trong nền, bạn có thể tiếp tục làm việc khác
              </p>
            </div>

            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center'>
                  <svg className='w-4 h-4 text-emerald-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='font-semibold text-slate-800'>Thông báo kết quả</h3>
              </div>
              <p className='text-sm text-slate-600'>Nhận thông báo ngay khi báo cáo hoàn thành và sẵn sàng xem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAnalyticsReport
