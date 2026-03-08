import { useState, useEffect } from 'react'
import { FileText, Upload, Search, FileUp, Loader2, Building2, Calendar, FileBarChart, Trash2 } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import reportService, { type Report } from '@/services/reportService'
import { companyService } from '@/services/companyService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ReportPage = () => {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [companies, setCompanies] = useState<{ id: string; name: string; ticker: string }[]>([])
    const [selectedCompany, setSelectedCompany] = useState('')
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedPeriod, setSelectedPeriod] = useState('Q4')
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        fetchReports()
        fetchCompanies()
    }, [])

    const fetchReports = async () => {
        try {
            setLoading(true)
            const publicReports = await reportService.getPublicReports(1, 100)
            // API may return a paginated wrapper { data: Report[] } or a plain Report[]
            const raw = publicReports as unknown as { data?: Report[] } | Report[]
            const reportsArray: Report[] = Array.isArray(raw)
                ? raw
                : (raw as { data?: Report[] }).data ?? []
            setReports(reportsArray)
        } catch (error) {
            console.error('Failed to fetch reports:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCompanies = async () => {
        try {
            // getCompanies now returns NormalizedCompany[] directly — no wrapper
            const list = await companyService.getCompanies(1, 100)
            setCompanies(list.map((c) => ({ id: c.id, name: c.name, ticker: c.ticker })))
            if (list.length > 0) setSelectedCompany(list[0].id)
        } catch (error) {
            console.error('Failed to fetch companies:', error)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !selectedCompany) return

        setUploading(true)
        try {
            await reportService.uploadReport({
                File: file,
                CompanyId: selectedCompany,
                CategoryId: '37fa071e-0565-4d7a-83b6-1498b724497e', // Example category ID (Balance Sheet)
                Year: selectedYear,
                Period: selectedPeriod
            })
            setFile(null)
            fetchReports()
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setUploading(false)
        }
    }

    const handleDownloadReport = (id: string, fileName: string) => {
        // Placeholder for download logic
        console.log(`Downloading report ${id}: ${fileName}`)
    }

    const handleDeleteReport = (id: string) => {
        // Placeholder for delete logic
        console.log(`Deleting report ${id}`)
    }

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
                            <Input placeholder='Search reports...' className='pl-10 w-64 bg-white border-gray-100 rounded-xl' />
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Upload Section */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white p-8 rounded-[32px] shadow-sm border border-gray-50'>
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
                                    >
                                        {companies.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.ticker})
                                            </option>
                                        ))}
                                    </select>
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
                                    disabled={uploading || !file || !selectedCompany}
                                    className='w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold'
                                >
                                    {uploading ? <Loader2 className='animate-spin w-5 h-5' /> : 'Upload & Process'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden'>
                            <div className='p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30'>
                                <h4 className='font-bold text-gray-800 flex items-center gap-2'>
                                    <FileText size={18} className='text-blue-500' />
                                    Recent Uploads
                                </h4>
                                <span className='text-xs text-gray-400'>{reports.length} reports found</span>
                            </div>

                            <div className='divide-y divide-gray-50'>
                                {loading ? (
                                    <div className='p-20 text-center'>
                                        <Loader2 className='w-8 h-8 text-blue-500 animate-spin mx-auto mb-4' />
                                        <p className='text-sm text-gray-400'>Loading reports...</p>
                                    </div>
                                ) : reports.length === 0 ? (
                                    <div className='p-20 text-center'>
                                        <p className='text-gray-400'>No reports uploaded yet.</p>
                                    </div>
                                ) : (
                                    reports.map((report) => (
                                        <div
                                            key={(report as any).Id || (report as any).id}
                                            className='p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group'
                                        >
                                            <div className='flex items-center gap-4'>
                                                <div className='w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-red-500 shadow-sm'>
                                                    <FileBarChart size={24} />
                                                </div>
                                                <div>
                                                    <h5 className='font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                                                        {(report as any).FileName || (report as any).fileName}
                                                    </h5>
                                                    <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-1'>
                                                        <span className='flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded'>
                                                            <Building2 size={12} /> {(report as any).Ticker || (report as any).ticker}
                                                        </span>
                                                        <span className='flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded'>
                                                            <Calendar size={12} /> {(report as any).Year || (report as any).year} {(report as any).Period || (report as any).period}
                                                        </span>
                                                        <span className='text-[11px] text-gray-400 uppercase tracking-wider font-bold'>
                                                            {(report as any).CategoryName || (report as any).categoryName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <button
                                                    onClick={() => handleDownloadReport((report as any).Id || (report as any).id, (report as any).FileName || (report as any).fileName)}
                                                    className='px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors'
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReport((report as any).Id || (report as any).id)}
                                                    className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                                                    title='Delete Report'
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ReportPage
