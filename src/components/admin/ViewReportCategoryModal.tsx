import { X, FolderOpen, FileText, Calendar, Hash, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ReportCategory } from '@/types/admin.types'

interface ViewReportCategoryModalProps {
  category: ReportCategory | null
  isOpen: boolean
  onClose: () => void
}

const ViewReportCategoryModal = ({ category, isOpen, onClose }: ViewReportCategoryModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen || !category) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>Chi Tiết Danh Mục Báo Cáo</h2>
          <Button variant='ghost' size='sm' onClick={onClose} className='text-slate-400 hover:text-slate-600'>
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          <div className='space-y-6'>
            {/* Category Header */}
            <div className='flex items-start gap-6 p-6 bg-slate-50 rounded-xl'>
              <div className='w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl'>
                <FolderOpen className='w-10 h-10' />
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>{category.name}</h3>
                <div className='flex items-center gap-4 mb-3'>
                  <div className='flex items-center gap-2 text-slate-600'>
                    <Hash className='w-4 h-4' />
                    <span className='font-medium font-mono'>{category.id}</span>
                  </div>
                  <span className='px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200'>
                    {category.associatedReportsCount || 0} báo cáo
                  </span>
                </div>
              </div>
            </div>

            {/* Category Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <FolderOpen className='w-5 h-5' />
                  Thông Tin Cơ Bản
                </h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>ID:</span>
                    <span className='text-slate-900 font-mono text-sm'>{category.id}</span>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Tên danh mục:</span>
                    <span className='text-slate-900 font-medium'>{category.name}</span>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Số báo cáo:</span>
                    <span className='text-slate-900 font-medium'>{category.associatedReportsCount || 0}</span>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <BarChart3 className='w-5 h-5' />
                  Thống Kê
                </h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Trạng thái:</span>
                    <span className='text-green-600 font-medium'>Hoạt động</span>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                    <span className='text-slate-600'>Loại:</span>
                    <span className='text-slate-900'>Danh mục báo cáo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {category.description && (
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <FileText className='w-5 h-5' />
                  Mô Tả
                </h4>
                <div className='bg-slate-50 rounded-lg p-4 border border-slate-200'>
                  <p className='text-slate-700 leading-relaxed'>{category.description}</p>
                </div>
              </div>
            )}

            {/* Associated Reports */}
            {category.associatedReports && category.associatedReports.length > 0 && (
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                  <FileText className='w-5 h-5' />
                  Báo Cáo Liên Kết ({category.associatedReportsCount || 0})
                </h4>
                <div className='bg-white border border-slate-200 rounded-lg overflow-hidden'>
                  <div className='max-h-64 overflow-y-auto'>
                    <table className='w-full'>
                      <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr>
                          <th className='px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                            Báo Cáo
                          </th>
                          <th className='px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                            Công Ty
                          </th>
                          <th className='px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                            Ngày Tạo
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-200'>
                        {category.associatedReports.map((report) => (
                          <tr key={report.id} className='hover:bg-slate-50'>
                            <td className='px-4 py-3'>
                              <div className='flex items-center gap-2'>
                                <FileText className='w-4 h-4 text-slate-400' />
                                <span className='text-sm font-medium text-slate-900 truncate'>{report.title}</span>
                              </div>
                            </td>
                            <td className='px-4 py-3 text-sm text-slate-600'>{report.companyName}</td>
                            <td className='px-4 py-3 text-sm text-slate-600'>{formatDate(report.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Statistics */}
            <div className='space-y-4'>
              <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                <BarChart3 className='w-5 h-5' />
                Thống Kê Sử Dụng
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                      <FileText className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm text-blue-600 font-medium'>Tổng báo cáo</p>
                      <p className='text-2xl font-bold text-blue-900'>{category.associatedReportsCount || 0}</p>
                    </div>
                  </div>
                </div>
                <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                      <Calendar className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <p className='text-sm text-green-600 font-medium'>Báo cáo gần đây</p>
                      <p className='text-2xl font-bold text-green-900'>
                        {category.associatedReports?.filter((report) => {
                          const reportDate = new Date(report.createdAt)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return reportDate > weekAgo
                        }).length || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='bg-purple-50 rounded-lg p-4 border border-purple-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                      <BarChart3 className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <p className='text-sm text-purple-600 font-medium'>Công ty khác nhau</p>
                      <p className='text-2xl font-bold text-purple-900'>
                        {new Set(category.associatedReports?.map((report) => report.companyName) || []).size}
                      </p>
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

export default ViewReportCategoryModal
