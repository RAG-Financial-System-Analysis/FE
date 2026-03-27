import { useState, useEffect } from 'react'
import { X, Building, Globe, Calendar, Tag, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import { axiosInstance } from '@/lib'

interface CompanyDetail {
  id: string
  ticker: string
  name: string
  industry: string
  description: string
  website: string
  createdAt: string
}

interface ViewCompanyModalProps {
  companyId: string | null
  isOpen: boolean
  onClose: () => void
}

export const ViewCompanyModal = ({ companyId, isOpen, onClose }: ViewCompanyModalProps) => {
  const [companyDetail, setCompanyDetail] = useState<CompanyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, companyId])

  const fetchCompanyDetail = async () => {
    if (!companyId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get(`/api/Companies/${companyId}`)
      setCompanyDetail(response.data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông tin chi tiết'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>Chi Tiết Công Ty</h2>
          <Button variant='ghost' size='sm' onClick={onClose} className='text-slate-400 hover:text-slate-600'>
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                <p className='text-slate-600'>Đang tải thông tin...</p>
              </div>
            </div>
          ) : error ? (
            <div className='text-center py-12'>
              <div className='text-red-600 mb-4'>
                <X className='w-12 h-12 mx-auto mb-2' />
                <p className='text-lg font-medium'>Có lỗi xảy ra</p>
                <p className='text-sm text-slate-600'>{error}</p>
              </div>
              <Button onClick={fetchCompanyDetail} className='mt-4'>
                Thử lại
              </Button>
            </div>
          ) : companyDetail ? (
            <div className='space-y-6'>
              {/* Company Header */}
              <div className='flex items-start gap-6 p-6 bg-slate-50 rounded-xl'>
                <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl'>
                  {companyDetail.ticker || companyDetail.name.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-bold text-slate-900 mb-2'>{companyDetail.name}</h3>
                  <div className='flex items-center gap-4 mb-3'>
                    <div className='flex items-center gap-2 text-slate-600'>
                      <Tag className='w-4 h-4' />
                      <span className='font-medium'>{companyDetail.ticker}</span>
                    </div>
                    <span className='px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200'>
                      {companyDetail.industry}
                    </span>
                  </div>
                  {companyDetail.website && (
                    <div className='flex items-center gap-2 text-blue-600'>
                      <Globe className='w-4 h-4' />
                      <a
                        href={companyDetail.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:underline'
                      >
                        {companyDetail.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                    <Building className='w-5 h-5' />
                    Thông Tin Cơ Bản
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>ID:</span>
                      <span className='text-slate-900 font-mono text-sm'>{companyDetail.id}</span>
                    </div>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>Mã chứng khoán:</span>
                      <span className='text-slate-900 font-medium'>{companyDetail.ticker}</span>
                    </div>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>Ngành:</span>
                      <span className='text-slate-900'>{companyDetail.industry}</span>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                    <Calendar className='w-5 h-5' />
                    Thời Gian
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between py-2 border-b border-slate-100'>
                      <span className='text-slate-600'>Ngày tạo:</span>
                      <span className='text-slate-900 text-sm'>{formatDate(companyDetail.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {companyDetail.description && (
                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                    <FileText className='w-5 h-5' />
                    Mô Tả
                  </h4>
                  <div className='bg-slate-50 rounded-lg p-4 border border-slate-200'>
                    <p className='text-slate-700 leading-relaxed'>{companyDetail.description}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
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
