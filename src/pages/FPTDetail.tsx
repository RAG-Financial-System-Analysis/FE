import { useEffect, useState } from 'react'
import { Loader2, Download, TrendingUp, ChevronDown, FileBarChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/layout/Sidebar'
import { companyService, type CompanyDetail as CompanyDataType } from '@/services/companyService'

const FPTDetail = () => {
  const [data, setData] = useState<CompanyDataType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const result = await companyService.getCompanyDetail('FPT')
        setData(result)
      } catch (err) {
        console.error('Failed to fetch FPT details:', err)
        setError('Failed to load company details.')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [])

  if (loading) {
    return (
      <div className='flex min-h-screen'>
        <Sidebar />
        <main className='flex-1 ml-64 flex flex-col items-center justify-center bg-gray-50'>
          <Loader2 className='w-12 h-12 text-primary animate-spin mb-4' />
          <p className='text-gray-400 font-medium'>Loading FPT details...</p>
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='flex min-h-screen'>
        <Sidebar />
        <main className='flex-1 ml-64 flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <p className='text-red-500 font-bold mb-4'>{error || 'Something went wrong'}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-gray-50/50 font-outfit'>
      <Sidebar />

      <main className='flex-1 ml-64 p-8 md:p-12 pb-24'>
        {/* Header Section */}
        <div className='flex justify-between items-start mb-10'>
          <div className='animate-fade-in-up'>
            <div className='flex items-center gap-3 mb-2'>
              <h2 className='text-4xl font-bold text-gray-900'>{data.name}</h2>
              <span className='px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-600 uppercase'>
                {data.symbol}
              </span>
            </div>
            <p className='text-gray-500 font-light flex items-center gap-2'>
              Industry: {data.industry} <span className='text-gray-300'>•</span> Established: {data.established}
            </p>
          </div>

          <div className='flex items-center gap-3 animate-fade-in-up delay-100'>
            <div className='bg-white border border-gray-100 rounded-xl px-4 h-11 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 shadow-sm'>
              Year 2023 <ChevronDown size={16} />
            </div>
            <Button className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-blue-200 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95'>
              <Download size={18} />
              Download Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-10'>
          {/* Revenue Card */}
          <div className='bg-white p-6 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-in-up delay-100'>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Total Revenue</span>
              <span className='flex items-center gap-1 text-green-500 text-xs font-bold'>
                <TrendingUp size={14} /> {data.summaryStats?.revenue?.growth}
              </span>
            </div>
            <div className='flex items-baseline gap-2'>
              <span className='text-2xl font-bold text-gray-900'>{data.summaryStats?.revenue?.value}</span>
              <span className='text-sm font-medium text-gray-400'>billion</span>
            </div>
            <div className='text-xs font-medium text-gray-400 mt-1 uppercase'>VND</div>
          </div>

          {/* Net Profit Card */}
          <div className='bg-white p-6 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-in-up delay-200'>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Net Profit</span>
              <span className='flex items-center gap-1 text-green-500 text-xs font-bold'>
                <TrendingUp size={14} /> {data.summaryStats?.netProfit?.growth}
              </span>
            </div>
            <div className='flex items-baseline gap-2'>
              <span className='text-2xl font-bold text-gray-900'>{data.summaryStats?.netProfit?.value}</span>
              <span className='text-sm font-medium text-gray-400'>billion VND</span>
            </div>
          </div>

          {/* ROE Card */}
          <div className='bg-white p-6 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-in-up delay-300'>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>ROE</span>
              <span className='flex items-center gap-1 text-green-500 text-xs font-bold'>
                <TrendingUp size={14} /> {data.summaryStats?.roe?.growth}
              </span>
            </div>
            <div className='text-2xl font-bold text-gray-900'>{data.summaryStats?.roe?.value}</div>
          </div>

          {/* Profit Margin Card */}
          <div className='bg-white p-6 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-in-up delay-400'>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Profit Margin</span>
              <span className='flex items-center gap-1 text-green-500 text-xs font-bold'>
                <TrendingUp size={14} /> {data.summaryStats?.profitMargin?.growth}
              </span>
            </div>
            <div className='text-2xl font-bold text-gray-900'>{data.summaryStats?.profitMargin?.value}</div>
          </div>
        </div>

        {/* Second Row: Stock Trend & Revenue Structure */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10'>
          <div className='lg:col-span-2 bg-white p-10 rounded-[40px] shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-50 animate-fade-in-up delay-500'>
            <div className='flex justify-between items-center mb-10'>
              <div>
                <h4 className='text-lg font-bold text-gray-800'>Stock Price Trend</h4>
                <p className='text-xs text-gray-400 font-light mt-1'>Price fluctuation in 2023</p>
              </div>
              <div className='flex gap-1 p-1 bg-gray-100 rounded-lg'>
                {['1W', '1M', '3M', '6M', '1Y'].map((t: string) => (
                  <button
                    key={t}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${t === '1Y' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className='h-[300px] w-full relative'>
              <svg className='w-full h-full overflow-visible' preserveAspectRatio='none'>
                <defs>
                  <linearGradient id='lineGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#3B82F6' stopOpacity='0.2' />
                    <stop offset='100%' stopColor='#3B82F6' stopOpacity='0' />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1='0' y1={i * 75} x2='100%' y2={i * 75} stroke='#F1F5F9' strokeWidth='1' />
                ))}
                <path
                  d='M0,230 L50,210 L100,200 L150,195 L200,185 L250,180 L300,170 L350,185 L400,175 L450,165 L500,155 L550,145 V300 H0 Z'
                  fill='url(#lineGrad)'
                  className='transition-all duration-1000'
                />
                <polyline
                  fill='none'
                  stroke='#3B82F6'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  points='0,230 50,210 100,200 150,195 200,185 250,180 300,170 350,185 400,175 450,165 500,155 550,145'
                  className='transition-all duration-1000'
                />
                {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={[230, 210, 200, 195, 185, 180, 170, 185, 175, 165, 155, 145][i]}
                    r='4'
                    fill='white'
                    stroke='#3B82F6'
                    strokeWidth='2'
                  />
                ))}
              </svg>
              <div className='flex justify-between mt-4 text-[10px] font-bold text-gray-300'>
                {data.stockTrend?.map((t: { label: string; price: number }) => (
                  <span key={t.label}>{t.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className='bg-white p-10 rounded-[40px] shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-50 animate-fade-in-up delay-600'>
            <h4 className='text-lg font-bold text-gray-800 mb-8'>Revenue Structure</h4>
            <div className='flex flex-col items-center'>
              <div className='relative w-48 h-48 mb-8'>
                <svg viewBox='0 0 100 100' className='w-full h-full -rotate-90'>
                  <circle cx='50' cy='50' r='40' fill='transparent' stroke='#F1F5F9' strokeWidth='15' />
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'
                    stroke='#3B82F6'
                    strokeWidth='15'
                    strokeDasharray='113.1 251.3'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'
                    stroke='#8B5CF6'
                    strokeWidth='15'
                    strokeDasharray='70.3 251.3'
                    strokeDashoffset='-113.1'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'
                    stroke='#F59E0B'
                    strokeWidth='15'
                    strokeDasharray='37.7 251.3'
                    strokeDashoffset='-183.4'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'
                    stroke='#10B981'
                    strokeWidth='15'
                    strokeDasharray='30.2 251.3'
                    strokeDashoffset='-221.1'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-gray-900'>100%</div>
                    <div className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>Total</div>
                  </div>
                </div>
              </div>
              <div className='w-full space-y-3'>
                {data.revenueStructure?.map((item, i: number) => (
                  <div key={i} className='flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: item.color }}></div>
                      <span className='font-medium text-gray-500'>{item.category}</span>
                    </div>
                    <span className='font-bold text-gray-900'>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Performance Chart */}
        <div className='bg-white p-10 rounded-[40px] shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-50 mb-10 animate-fade-in-up delay-700'>
          <h4 className='text-lg font-bold text-gray-800 mb-12 text-center'>Quarterly Performance</h4>
          <div className='h-[300px] w-full flex items-end justify-between px-10 gap-20'>
            {data.quarterlyPerformance?.map((q, i: number) => (
              <div key={i} className='flex-1 max-w-[120px] flex flex-col items-center gap-4 group'>
                <div className='w-full flex items-end gap-2 h-[240px]'>
                  <div
                    className='flex-1 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-all flex flex-col justify-end items-center text-[10px] text-white font-bold p-2 overflow-hidden'
                    style={{ height: `${(q.revenue / 18000) * 100}%` }}
                  >
                    <span className='rotate-[-90deg] whitespace-nowrap mb-4'>{q.revenue}</span>
                  </div>
                  <div
                    className='flex-1 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-all flex flex-col justify-end items-center text-[10px] text-white font-bold p-2 overflow-hidden'
                    style={{ height: `${(q.profit / 4000) * 100}%` }}
                  >
                    <span className='rotate-[-90deg] whitespace-nowrap mb-4'>{q.profit}</span>
                  </div>
                </div>
                <span className='text-xs font-bold text-gray-400'>{q.quarter}</span>
              </div>
            ))}
          </div>
          <div className='flex justify-center gap-6 mt-10'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-purple-500 rounded-sm'></div>
              <span className='text-xs font-bold text-purple-600'>Profit (billion)</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-blue-500 rounded-sm'></div>
              <span className='text-xs font-bold text-blue-600'>Revenue (billion)</span>
            </div>
          </div>
        </div>

        {/* Financial Ratios Grid */}
        <div className='bg-white p-10 rounded-[40px] shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-50 mb-10 animate-fade-in-up delay-800'>
          <h4 className='text-lg font-bold text-gray-800 mb-10'>Financial Ratios</h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {(Object.entries(data.financialRatios || {}) as [string, { value: string; change: string }][]).map(
              ([key, ratio]) => (
                <div
                  key={key}
                  className='p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50 flex flex-col justify-between h-32'
                >
                  <div className='flex justify-between items-start'>
                    <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${ratio.change.startsWith('+') ? 'text-blue-500' : 'text-blue-400'}`}
                    >
                      {ratio.change}
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-gray-900'>
                    {ratio.value}
                    {key === 'assetTurnover' ? ' times' : ''}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom Row SWOT */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-1000'>
          <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center'>
                <TrendingUp size={20} />
              </div>
              <h5 className='font-bold text-gray-800'>Strengths</h5>
            </div>
            <p className='text-sm text-gray-500 leading-relaxed font-light'>{data.analysis?.strengths}</p>
          </div>

          <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center'>
                <FileBarChart size={20} />
              </div>
              <h5 className='font-bold text-gray-800'>Opportunities</h5>
            </div>
            <p className='text-sm text-gray-500 leading-relaxed font-light'>{data.analysis?.opportunities}</p>
          </div>

          <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center'>
                <Loader2 size={20} />
              </div>
              <h5 className='font-bold text-gray-800'>Risks</h5>
            </div>
            <p className='text-sm text-gray-500 leading-relaxed font-light'>{data.analysis?.risks}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FPTDetail
