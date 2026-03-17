import { X, BarChart3, Code, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsType {
  id: string
  name: string
  code: string
  description?: string
}

interface ViewAnalyticsTypeModalProps {
  analyticsType: AnalyticsType | null
  isOpen: boolean
  onClose: () => void
}

export const ViewAnalyticsTypeModal = ({ analyticsType, isOpen, onClose }: ViewAnalyticsTypeModalProps) => {
  if (!isOpen || !analyticsType) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>Chi Tiết Loại Phân Tích</h2>
          <Button variant='ghost' size='sm' onClick={onClose} className='text-slate-400 hover:text-slate-600'>
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          <div className='space-y-6'>
            {/* Analytics Type Header */}
            <div className='flex items-start gap-6 p-6 bg-slate-50 rounded-xl'>
              <div className='w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl'>
                <BarChart3 className='w-10 h-10' />
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>{analyticsType.name}</h3>
                <div className='flex items-center gap-4 mb-3'>
                  <div className='flex items-center gap-2 text-slate-600'>
                    <Code className='w-4 h-4' />
                    <span className='font-medium font-mono'>{analyticsType.code}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Type Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <BarChart3 className='w-5 h-5' />
                  Thông Tin Cơ Bản
                </h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>ID:</span>
                    <span className='text-slate-900 font-mono text-sm'>{analyticsType.id}</span>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Mã code:</span>
                    <span className='text-slate-900 font-medium font-mono'>{analyticsType.code}</span>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Tên hiển thị:</span>
                    <span className='text-slate-900'>{analyticsType.name}</span>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <Calendar className='w-5 h-5' />
                  Trạng Thái
                </h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Trạng thái:</span>
                    <span className='text-green-600 font-medium'>Hoạt động</span>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Loại:</span>
                    <span className='text-slate-900'>Phân tích tự động</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {analyticsType.description && (
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <FileText className='w-5 h-5' />
                  Mô Tả
                </h4>
                <div className='bg-slate-50 rounded-lg p-4 border border-slate-200'>
                  <p className='text-slate-700 leading-relaxed'>{analyticsType.description}</p>
                </div>
              </div>
            )}

            {/* Usage Information */}
            <div className='space-y-4'>
              <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                <BarChart3 className='w-5 h-5' />
                Thông Tin Sử Dụng
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                      <BarChart3 className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm text-blue-600 font-medium'>Phiên chat</p>
                      <p className='text-2xl font-bold text-blue-900'>-</p>
                    </div>
                  </div>
                </div>
                <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                      <FileText className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <p className='text-sm text-green-600 font-medium'>Báo cáo tạo</p>
                      <p className='text-2xl font-bold text-green-900'>-</p>
                    </div>
                  </div>
                </div>
                <div className='bg-purple-50 rounded-lg p-4 border border-purple-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                      <Calendar className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <p className='text-sm text-purple-600 font-medium'>Lần dùng cuối</p>
                      <p className='text-sm font-medium text-purple-900'>-</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50'>
          <Button variant='outline' onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
