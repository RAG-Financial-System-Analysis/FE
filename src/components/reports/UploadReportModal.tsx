import { useState } from 'react'
import { useReports } from '@/hooks/useReports'
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import type { Company } from '@/types/companies.types'
import type { ReportCategory } from '@/types/admin.types'

interface UploadReportModalProps {
  isOpen: boolean
  onClose: () => void
  companies: Company[]
  categories: ReportCategory[]
  onSuccess: () => void
}

export const UploadReportModal = ({ isOpen, onClose, companies, categories, onSuccess }: UploadReportModalProps) => {
  const { uploadReport, isLoading, error } = useReports()

  const [formData, setFormData] = useState({
    companyId: '',
    categoryId: '',
    year: new Date().getFullYear(),
    period: '',
    visibility: 'private' as 'private' | 'public'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Chỉ hỗ trợ file PDF')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      // 100MB
      toast.error('File quá lớn (tối đa 100MB)')
      return
    }
    setSelectedFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error('Vui lòng chọn file PDF')
      return
    }

    if (!formData.companyId || !formData.categoryId || !formData.period) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const result = await uploadReport({
      file: selectedFile,
      companyId: formData.companyId,
      categoryId: formData.categoryId,
      year: formData.year,
      period: formData.period,
      visibility: formData.visibility
    })

    if (result.success) {
      setUploadSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          companyId: '',
          categoryId: '',
          year: new Date().getFullYear(),
          period: '',
          visibility: 'private'
        })
        setSelectedFile(null)
        setUploadSuccess(false)
      }, 2000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-slate-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-slate-900'>Upload Báo Cáo Tài Chính</h2>
            <Button variant='ghost' size='sm' onClick={onClose}>
              <X className='w-5 h-5' />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* File Upload Area */}
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              File PDF <span className='text-red-500'>*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className='flex items-center justify-center gap-3'>
                  <FileText className='w-8 h-8 text-green-600' />
                  <div className='text-left'>
                    <p className='text-sm font-medium text-slate-900'>{selectedFile.name}</p>
                    <p className='text-xs text-slate-500'>{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedFile(null)}
                    className='text-red-600 hover:text-red-700'
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className='w-12 h-12 text-slate-400 mx-auto mb-4' />
                  <p className='text-slate-600 mb-2'>Kéo thả file PDF vào đây hoặc</p>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = '.pdf'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) handleFileSelect(file)
                      }
                      input.click()
                    }}
                  >
                    Chọn File
                  </Button>
                  <p className='text-xs text-slate-500 mt-2'>Chỉ hỗ trợ file PDF, tối đa 100MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Company Selection */}
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              Công Ty <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.companyId}
              onChange={(e) => setFormData((prev) => ({ ...prev, companyId: e.target.value }))}
              className='w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Chọn công ty</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} ({company.ticker})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              Loại Báo Cáo <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
              className='w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Chọn loại báo cáo</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year and Period */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Năm <span className='text-red-500'>*</span>
              </label>
              <Input
                type='number'
                min='2000'
                max='2100'
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Kỳ <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                placeholder='Q1, Q2, Q3, Q4, Năm'
                maxLength={10}
                value={formData.period}
                onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Quyền Truy Cập</label>
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='visibility'
                  value='private'
                  checked={formData.visibility === 'private'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, visibility: e.target.value as 'private' | 'public' }))
                  }
                  className='mr-2'
                />
                <span className='text-sm text-slate-700'>Riêng tư (chỉ tôi xem được)</span>
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='visibility'
                  value='public'
                  checked={formData.visibility === 'public'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, visibility: e.target.value as 'private' | 'public' }))
                  }
                  className='mr-2'
                />
                <span className='text-sm text-slate-700'>Công khai (mọi người xem được)</span>
              </label>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 shrink-0' />
              <div>
                <h3 className='text-red-800 font-medium mb-1'>Có lỗi xảy ra</h3>
                <p className='text-red-700 text-sm'>{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {uploadSuccess && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3'>
              <CheckCircle className='w-5 h-5 text-green-600 mt-0.5 shrink-0' />
              <div>
                <h3 className='text-green-800 font-medium mb-1'>Upload thành công!</h3>
                <p className='text-green-700 text-sm'>Báo cáo đã được tải lên và xử lý thành công.</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-200'>
            <Button type='button' variant='outline' onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={isLoading || !selectedFile || uploadSuccess}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              {isLoading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className='w-4 h-4 mr-2' />
                  Upload Báo Cáo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
