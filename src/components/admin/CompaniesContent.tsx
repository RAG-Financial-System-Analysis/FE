import { useEffect, useState } from 'react'
import { useCompanies } from '@/hooks/useCompanies'
import { Building2, Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from '@/types/companies.types'

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  company?: Company | null
  onSave: (data: CreateCompanyRequest | UpdateCompanyRequest) => Promise<void>
}

const CompanyModal = ({ isOpen, onClose, company, onSave }: CompanyModalProps) => {
  const [formData, setFormData] = useState({
    ticker: '',
    name: '',
    description: '',
    industry: '',
    website: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (company) {
      setFormData({
        ticker: company.ticker || '',
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        website: company.website || ''
      })
    } else {
      setFormData({
        ticker: '',
        name: '',
        description: '',
        industry: '',
        website: ''
      })
    }
  }, [company])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving company:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>{company ? 'Chỉnh Sửa Công Ty' : 'Thêm Công Ty Mới'}</h2>
          <button onClick={onClose} className='text-slate-400 hover:text-slate-600'>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Mã ticker *</label>
            <input
              type='text'
              value={formData.ticker}
              onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='VD: FPT, VCB, VNM'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Tên công ty *</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              rows={3}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Ngành nghề</label>
            <input
              type='text'
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Website</label>
            <input
              type='url'
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='https://example.com'
            />
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50'
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : company ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CompaniesContent = () => {
  const { companies, isLoading, error, loadCompanies, createCompany, updateCompany, deleteCompany, clearError } =
    useCompanies()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCompany = () => {
    setSelectedCompany(null)
    setIsModalOpen(true)
  }

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handleSaveCompany = async (data: CreateCompanyRequest | UpdateCompanyRequest) => {
    try {
      if (selectedCompany) {
        await updateCompany(selectedCompany.id, data)
        toast.success('Cập nhật công ty thành công!')
      } else {
        await createCompany(data)
        toast.success('Tạo công ty mới thành công!')
      }
      await loadCompanies()
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra'
      toast.error(errorMessage)
      throw error // Re-throw để modal có thể handle
    }
  }

  const handleDeleteCompany = async (companyId: string) => {
    if (deleteConfirm === companyId) {
      try {
        await deleteCompany(companyId)
        toast.success('Xóa công ty thành công!')
        setDeleteConfirm(null)
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi khi xóa công ty'
        toast.error(errorMessage)
      }
    } else {
      setDeleteConfirm(companyId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  if (isLoading && companies.length === 0) {
    return (
      <div className='p-8 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Đang tải danh sách công ty...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Quản Lý Công Ty</h1>
          <p className='text-slate-600'>Quản lý thông tin các công ty trong hệ thống</p>
        </div>
        <button
          onClick={handleCreateCompany}
          className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          <Plus className='w-4 h-4' />
          Thêm Công Ty
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 shrink-0' />
          <div className='flex-1'>
            <h3 className='text-red-800 font-medium mb-1'>Có lỗi xảy ra</h3>
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
          <button onClick={clearError} className='text-red-600 hover:text-red-700 hover:bg-red-100 rounded p-1'>
            ✕
          </button>
        </div>
      )}

      {/* Search */}
      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Tìm kiếm công ty...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredCompanies.map((company) => (
          <div key={company.id} className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <Building2 className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-slate-900'>{company.name}</h3>
                  <p className='text-sm text-slate-500'>{company.ticker}</p>
                  {company.industry && <p className='text-xs text-slate-400'>{company.industry}</p>}
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <button
                  onClick={() => handleEditCompany(company)}
                  className='p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded'
                  title='Chỉnh sửa'
                >
                  <Edit className='w-4 h-4' />
                </button>
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className={`p-1 rounded ${
                    deleteConfirm === company.id
                      ? 'text-red-600 bg-red-50'
                      : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title={deleteConfirm === company.id ? 'Nhấn lại để xác nhận xóa' : 'Xóa'}
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>

            {company.description && <p className='text-sm text-slate-600 mb-3 line-clamp-2'>{company.description}</p>}

            <div className='space-y-2'>
              {company.website && (
                <div className='flex items-center gap-2 text-sm'>
                  <span className='text-slate-500'>Website:</span>
                  <a
                    href={company.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline truncate'
                  >
                    {company.website}
                  </a>
                </div>
              )}
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-slate-500'>Ngành:</span>
                <span className='text-slate-700'>{company.industry || 'Chưa xác định'}</span>
              </div>
            </div>

            <div className='mt-4 pt-4 border-t border-slate-100'>
              <p className='text-xs text-slate-500'>
                Tạo ngày {new Date(company.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && !isLoading && (
        <div className='text-center py-12'>
          <Building2 className='w-12 h-12 text-slate-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-slate-900 mb-2'>Không tìm thấy công ty</h3>
          <p className='text-slate-500 mb-4'>
            {searchTerm ? 'Không có công ty nào phù hợp với từ khóa tìm kiếm' : 'Chưa có công ty nào trong hệ thống'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateCompany}
              className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              <Plus className='w-4 h-4' />
              Thêm Công Ty Đầu Tiên
            </button>
          )}
        </div>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
        onSave={handleSaveCompany}
      />
    </div>
  )
}

export default CompaniesContent
