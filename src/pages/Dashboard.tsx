import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FileText, TrendingUp, FileBarChart, Loader2, Building2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dashboardService, type DashboardStats, type Company } from '@/services/dashboardService'
import Sidebar from '@/components/layout/Sidebar'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, companiesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAnalyzedCompanies()
        ])
        setStats(statsData)
        setCompanies(companiesData)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'reports':
        return <FileText className='w-6 h-6 text-blue-500' />
      case 'companies':
        return <Building2 className='w-6 h-6 text-purple-500' />
      case 'analyses':
        return <TrendingUp className='w-6 h-6 text-green-500' />
      default:
        return <FileText className='w-6 h-6 text-gray-500' />
    }
  }

  const getStatBg = (type: string) => {
    switch (type) {
      case 'reports':
        return 'bg-blue-50'
      case 'companies':
        return 'bg-purple-50'
      case 'analyses':
        return 'bg-green-50'
      default:
        return 'bg-gray-50'
    }
  }

  const getCompanyStyles = (type: string) => {
    switch (type) {
      case 'fpt':
        return { symbol: 'bg-blue-100 text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' }
      case 'vnm':
        return { symbol: 'bg-green-100 text-green-600', button: 'bg-green-600 hover:bg-green-700' }
      default:
        return { symbol: 'bg-gray-100 text-gray-600', button: 'bg-primary hover:bg-primary-dark' }
    }
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 font-outfit p-4'>
        <div className='bg-white p-8 rounded-[32px] shadow-xl text-center max-w-md'>
          <div className='w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6'>
            <FileBarChart size={32} />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Oops!</h2>
          <p className='text-gray-500 mb-8'>{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className='w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12 font-bold'
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-gray-50/50 font-outfit'>
      <Sidebar />

      {/* Main Content */}
      <main className='flex-1 ml-64 p-8 md:p-12 max-w-7xl'>
        <div className='mb-10'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Welcome to Financial Statement Analyzer</h2>
          <p className='text-gray-500 font-light'>Intelligent financial statement analysis powered by AI</p>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center h-64'>
            <Loader2 className='w-12 h-12 text-primary animate-spin mb-4' />
            <p className='text-gray-400 font-medium'>Fetching latest data...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col animate-fade-in-up'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-12 h-12 ${getStatBg(stat.iconType)} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    {getStatIcon(stat.iconType)}
                  </div>
                  <div className='text-4xl font-bold text-gray-900 mb-1'>{stat.value}</div>
                  <div className='text-sm font-medium text-gray-400 uppercase tracking-wider'>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Analyzed Companies Section */}
            <div className='mb-12'>
              <h3 className='text-xl font-bold text-gray-800 mb-6 font-outfit'>Analyzed Companies</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {companies.map((company, index) => {
                  const styles = getCompanyStyles(company.type)
                  return (
                    <div
                      key={index}
                      className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-in-up'
                      style={{ animationDelay: `${(stats.length + index) * 100}ms` }}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <h4 className='text-lg font-bold text-gray-900'>{company.name}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${styles.symbol}`}>
                          {company.symbol}
                        </span>
                      </div>
                      <p className='text-sm text-gray-400 mb-6 font-light'>{company.reports} financial reports</p>

                      <div className='space-y-4 mb-8'>
                        <div className='flex justify-between items-center text-sm font-medium'>
                          <span className='text-gray-400'>Revenue</span>
                          <span className='text-gray-900'>{company.revenue}</span>
                        </div>
                        <div className='flex justify-between items-center text-sm font-medium'>
                          <span className='text-gray-400'>Profit</span>
                          <span className='text-gray-900'>{company.profit}</span>
                        </div>
                        <div className='flex justify-between items-center text-sm font-medium'>
                          <span className='text-gray-400'>Growth</span>
                          <span className='text-green-500 flex items-center gap-1'>
                            <TrendingUp size={14} />
                            {company.growth}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate(company.type === 'fpt' ? '/fpt' : '/vinamilk')}
                        className={`w-full ${styles.button} text-white rounded-xl h-12 flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]`}
                      >
                        View Details
                        <ChevronRight size={18} />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* AI Assistant Banner */}
        <div
          className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 rounded-[32px] p-10 text-white shadow-xl shadow-blue-200 animate-fade-in-up'
          style={{ animationDelay: '600ms' }}
        >
          {/* Decorative accents */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl'></div>

          <div className='relative z-10'>
            <h3 className='text-2xl font-bold mb-3'>Need quick analysis?</h3>
            <p className='text-blue-50/80 mb-8 max-w-xl font-light'>
              Use AI Assistant to ask questions about financial reports and get instant answers
            </p>
            <Button className='bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 h-12 font-bold shadow-lg transition-all hover:scale-105 active:scale-95'>
              Open AI Assistant
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
