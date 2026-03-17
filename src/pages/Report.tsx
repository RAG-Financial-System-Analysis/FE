import { useState, useEffect } from 'react'
import {
  FileText,
  Upload,
  Search,
  FileUp,
  Loader2,
  Building2,
  Calendar,
  FileBarChart,
  Trash2,
  Users,
  Lock
} from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import reportsService from '@/services/reportsService'
import { companyService } from '@/services/companyService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface ReportItem {
  id: string
  companyName: string
  ticker: string
  categoryName: string
  year: number
  period: string
  visibility: string
  fileName: string
  fileSizeKb: number
  createdAt: string
  uploadedBy?: {
    id: string
    fullName: string
  }
}

const ReportPage = () => {
  useAuth() // Keep auth context active
  const [myReports, setMyReports] = useState<ReportItem[]>([])
  const [publicReports, setPublicReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [companies, setCompanies] = useState<{ id: string; name: string; ticker: string }[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedPeriod, setSelectedPeriod] = useState('Q4')
  const [selectedVisibility, setSelectedVisibility] = useState<'private' | 'public'>('private')
  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my')
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    fetchReports()
    fetchCompanies()
    fetchCategories()

    // Show a welcome toast when component mounts
    toast.success('Welcome to Financial Reports!')
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)

      // Fetch my reports and public reports separately
      const [myReportsResponse, publicReportsResponse] = await Promise.all([
        reportsService.getMyReports({ page: 1, pageSize: 100 }).catch(() => {
          return { data: [] }
        }),
        reportsService.getPublicReports({ page: 1, pageSize: 100 }).catch(() => {
          return { data: [] }
        })
      ])

      setMyReports(myReportsResponse?.data || [])
      setPublicReports(publicReportsResponse?.data || [])
    } catch {
      setMyReports([])
      setPublicReports([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const list = await companyService.getCompanies(1, 100)

      if (Array.isArray(list) && list.length > 0) {
        setCompanies(list.map((c) => ({ id: c.id, name: c.name, ticker: c.ticker })))
        setSelectedCompany(list[0].id)
      } else {
        setCompanies([])
      }
    } catch {
      setCompanies([])
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await reportsService.getReportCategories()

      const categoriesList = response.categories || []
      if (categoriesList.length > 0) {
        setCategories(categoriesList.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })))
        setSelectedCategory(categoriesList[0].id)
      } else {
        setCategories([])
      }
    } catch {
      setCategories([])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !selectedCompany || !selectedCategory) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    setUploading(true)
    try {
      await reportsService.uploadReportAsync({
        file: file,
        companyId: selectedCompany,
        categoryId: selectedCategory,
        year: selectedYear,
        period: selectedPeriod,
        visibility: selectedVisibility
      })
      setFile(null)
      toast.success('Upload báo cáo thành công!')
      fetchReports()
    } catch {
      toast.error('Không thể upload báo cáo')
    } finally {
      setUploading(false)
    }
  }

  const handleDownloadReport = async (id: string, fileName: string) => {
    try {
      const blob = await reportsService.downloadReport(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      toast.error('Không thể tải xuống báo cáo')
    }
  }

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) return

    try {
      await reportsService.deleteReport(id)
      fetchReports()
      toast.success('Xóa báo cáo thành công!')
    } catch {
      toast.error('Không thể xóa báo cáo')
    }
  }

  const handleViewDetail = async (report: ReportItem) => {
    try {
      const detail = await reportsService.getReportDetail(report.id)
      setSelectedReport({ ...report, ...detail })
      setShowDetailModal(true)
    } catch {
      toast.error('Không thể tải chi tiết báo cáo')
    }
  }

  const handleUpdateVisibility = async (reportId: string, newVisibility: 'public' | 'private') => {
    try {
      await reportsService.updateVisibility(reportId, { visibility: newVisibility })
      fetchReports()
      setShowDetailModal(false)
      toast.success('Cập nhật visibility thành công!')
    } catch {
      toast.error('Không thể cập nhật visibility')
    }
  }

  // Filter reports based on search text
  const filterReports = (reports: ReportItem[]) => {
    if (!searchText.trim()) return reports

    const searchLower = searchText.toLowerCase().trim()
    return reports.filter((report) => {
      const fileNameMatch = report.fileName.toLowerCase().includes(searchLower)
      const companyMatch = report.companyName.toLowerCase().includes(searchLower)
      const tickerMatch = report.ticker.toLowerCase().includes(searchLower)
      const categoryMatch = report.categoryName.toLowerCase().includes(searchLower)
      const yearMatch = report.year.toString().includes(searchLower)
      const periodMatch = report.period.toLowerCase().includes(searchLower)

      return fileNameMatch || companyMatch || tickerMatch || categoryMatch || yearMatch || periodMatch
    })
  }

  const currentReports = filterReports(activeTab === 'my' ? myReports : publicReports)

  return (
    <div className='flex min-h-screen bg-gray-50/50 font-outfit'>
      <Sidebar />
      <main className='flex-1 ml-64 p-8 md:p-12 max-w-7xl'>
        <div className='flex justify-between items-center mb-10'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Financial Reports</h2>
            <p className='text-gray-500 font-light'>Manage and analyze your uploaded PDF disclosures</p>
          </div>

          <div className='flex gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Search reports...'
                className='pl-10 w-64 bg-white border-gray-100 rounded-xl'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Upload Section */}
          <div className='lg:col-span-1'>
            <div className='bg-white p-8 rounded-4xl shadow-sm border border-gray-50'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold'>
                  <FileUp size={20} />
                </div>
                <h3 className='text-xl font-bold text-gray-900'>Upload Report</h3>
              </div>

              <form onSubmit={handleUpload} className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Select Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className='w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-xl p-3 focus:ring-blue-500'
                    disabled={companies.length === 0}
                  >
                    {companies.length === 0 ? (
                      <option value=''>Đang tải công ty...</option>
                    ) : (
                      companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.ticker})
                        </option>
                      ))
                    )}
                  </select>
                  {companies.length === 0 && (
                    <p className='text-xs text-red-500 mt-1'>Không thể tải danh sách công ty. Vui lòng thử lại.</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Select Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className='w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-xl p-3 focus:ring-blue-500'
                    disabled={categories.length === 0}
                  >
                    {categories.length === 0 ? (
                      <option value=''>Đang tải danh mục...</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                  {categories.length === 0 && (
                    <p className='text-xs text-red-500 mt-1'>Không thể tải danh sách danh mục. Vui lòng thử lại.</p>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Year</label>
                    <Input
                      type='number'
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className='bg-gray-50 border-gray-100 rounded-xl'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Period</label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className='w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-xl p-3 focus:ring-blue-500'
                    >
                      <option value='Q1'>Q1</option>
                      <option value='Q2'>Q2</option>
                      <option value='Q3'>Q3</option>
                      <option value='Q4'>Q4</option>
                      <option value='Annual'>Annual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Visibility</label>
                  <select
                    value={selectedVisibility}
                    onChange={(e) => setSelectedVisibility(e.target.value as 'private' | 'public')}
                    className='w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-xl p-3 focus:ring-blue-500'
                  >
                    <option value='private'>Private (Chỉ mình tôi)</option>
                    <option value='public'>Public (Mọi người)</option>
                  </select>
                </div>

                <div className='border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative'>
                  <input
                    type='file'
                    accept='.pdf'
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className='absolute inset-0 opacity-0 cursor-pointer'
                  />
                  <div className='flex flex-col items-center gap-2'>
                    <Upload className='w-8 h-8 text-blue-500' />
                    <span className='text-sm text-gray-500 font-medium'>
                      {file ? file.name : 'Click or drag PDF to upload'}
                    </span>
                    <span className='text-[10px] text-gray-400'>Max file size: 10MB</span>
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={uploading || !file || !selectedCompany || !selectedCategory}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold'
                >
                  {uploading ? <Loader2 className='animate-spin w-5 h-5' /> : 'Upload & Process'}
                </Button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-4xl shadow-sm border border-gray-50 overflow-hidden'>
              {/* Tabs */}
              <div className='border-b border-gray-50'>
                <div className='flex'>
                  <button
                    onClick={() => setActiveTab('my')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'my'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className='flex items-center justify-center gap-2'>
                      <Lock size={16} />
                      My Reports ({myReports.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('public')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'public'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className='flex items-center justify-center gap-2'>
                      <Users size={16} />
                      Public Reports ({publicReports.length})
                    </div>
                  </button>
                </div>
              </div>

              <div className='p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30'>
                <h4 className='font-bold text-gray-800 flex items-center gap-2'>
                  <FileText size={18} className='text-blue-500' />
                  {activeTab === 'my' ? 'My Reports' : 'Public Reports'}
                  {searchText && <span className='text-sm font-normal text-gray-600'>- Search: "{searchText}"</span>}
                </h4>
                <span className='text-xs text-gray-400'>
                  {currentReports.length} reports found
                  {searchText && ` (filtered from ${activeTab === 'my' ? myReports.length : publicReports.length})`}
                </span>
              </div>

              <div className='divide-y divide-gray-50'>
                {loading ? (
                  <div className='p-20 text-center'>
                    <Loader2 className='w-8 h-8 text-blue-500 animate-spin mx-auto mb-4' />
                    <p className='text-sm text-gray-400'>Loading reports...</p>
                  </div>
                ) : currentReports.length === 0 ? (
                  <div className='p-20 text-center'>
                    <p className='text-gray-400'>
                      {searchText
                        ? `No reports found for "${searchText}"`
                        : activeTab === 'my'
                          ? 'No reports uploaded yet.'
                          : 'No public reports available.'}
                    </p>
                    {searchText && (
                      <button
                        onClick={() => setSearchText('')}
                        className='mt-2 text-blue-600 hover:text-blue-800 text-sm underline'
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  currentReports.map((report) => (
                    <div
                      key={report.id}
                      className='p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-red-500 shadow-sm'>
                          <FileBarChart size={24} />
                        </div>
                        <div>
                          <h5 className='font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                            {report.fileName}
                          </h5>
                          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-1'>
                            <span className='flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded'>
                              <Building2 size={12} /> {report.ticker}
                            </span>
                            <span className='flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded'>
                              <Calendar size={12} /> {report.year} {report.period}
                            </span>
                            <span className='text-[11px] text-gray-400 uppercase tracking-wider font-bold'>
                              {report.categoryName}
                            </span>
                            {report.visibility === 'public' ? (
                              <span className='flex items-center gap-1 text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded'>
                                <Users size={10} /> Public
                              </span>
                            ) : (
                              <span className='flex items-center gap-1 text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded'>
                                <Lock size={10} /> Private
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <button
                          onClick={() => handleViewDetail(report)}
                          className='px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report.id, report.fileName)}
                          className='px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors'
                        >
                          Download
                        </button>
                        {/* Toggle visibility button for my reports */}
                        {activeTab === 'my' && (
                          <button
                            onClick={() =>
                              handleUpdateVisibility(report.id, report.visibility === 'public' ? 'private' : 'public')
                            }
                            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                              report.visibility === 'public'
                                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                            }`}
                            title={`Change to ${report.visibility === 'public' ? 'Private' : 'Public'}`}
                          >
                            {report.visibility === 'public' ? 'Make Private' : 'Make Public'}
                          </button>
                        )}
                        {/* Only show delete button for my reports */}
                        {activeTab === 'my' && (
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                            title='Delete Report'
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Detail Modal */}
        {showDetailModal && selectedReport && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto'>
              <div className='flex justify-between items-start mb-6'>
                <div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-2'>Report Details</h3>
                  <p className='text-gray-600'>{selectedReport.fileName}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Company</label>
                    <p className='text-gray-900'>
                      {selectedReport.companyName} ({selectedReport.ticker})
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Category</label>
                    <p className='text-gray-900'>{selectedReport.categoryName}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Year & Period</label>
                    <p className='text-gray-900'>
                      {selectedReport.year} - {selectedReport.period}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>File Size</label>
                    <p className='text-gray-900'>{selectedReport.fileSizeKb} KB</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Visibility</label>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          selectedReport.visibility === 'public'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {selectedReport.visibility === 'public' ? 'Public' : 'Private'}
                      </span>
                      {activeTab === 'my' && (
                        <button
                          onClick={() =>
                            handleUpdateVisibility(
                              selectedReport.id,
                              selectedReport.visibility === 'public' ? 'private' : 'public'
                            )
                          }
                          className='text-xs text-blue-600 hover:text-blue-800 underline'
                        >
                          Change to {selectedReport.visibility === 'public' ? 'Private' : 'Public'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Created At</label>
                    <p className='text-gray-900'>{new Date(selectedReport.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                {selectedReport.uploadedBy && (
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Uploaded By</label>
                    <p className='text-gray-900'>{selectedReport.uploadedBy.fullName}</p>
                  </div>
                )}
              </div>

              <div className='flex gap-3 mt-8'>
                <button
                  onClick={() => handleDownloadReport(selectedReport.id, selectedReport.fileName)}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors'
                >
                  Download Report
                </button>
                {activeTab === 'my' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      handleDeleteReport(selectedReport.id)
                    }}
                    className='bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors'
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ReportPage
