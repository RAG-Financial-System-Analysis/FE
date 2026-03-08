import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  TrendingUp, Loader2, Building2, ChevronRight,
  MessageSquare, Users, FileText, BarChart3, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dashboardService, type DashboardStats, type Company, type StatIconType } from '@/services/dashboardService'
import Sidebar from '@/components/layout/Sidebar'
import { useAuth } from '@/context/AuthContext'

// ── Sparkline trend data ──────────────────────────────────────────────────────
const SPARKLINES: Record<StatIconType, { month: string; value: number }[]> = {
  reports: [8, 10, 9, 12, 11, 15, 14, 17, 16, 20, 22, 24].map((v, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i], value: v })),
  companies: [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2].map((v, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i], value: v })),
  analyses: [80, 85, 90, 95, 100, 108, 115, 125, 135, 145, 150, 156].map((v, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i], value: v })),
}

const ACCENT_COLORS: Record<StatIconType, { stroke: string; fill: string }> = {
  reports: { stroke: '#3B82F6', fill: '#DBEAFE' },
  companies: { stroke: '#8B5CF6', fill: '#EDE9FE' },
  analyses: { stroke: '#10B981', fill: '#D1FAE5' },
}

// ── Quarterly comparison data ─────────────────────────────────────────────────
const QUARTERLY = [
  { quarter: 'Q1\n2023', fpt: 9800, vnm: 15200 },
  { quarter: 'Q2\n2023', fpt: 10500, vnm: 15800 },
  { quarter: 'Q3\n2023', fpt: 11200, vnm: 16100 },
  { quarter: 'Q4\n2023', fpt: 11400, vnm: 16458 },
]

// ── Donut data ────────────────────────────────────────────────────────────────
const DONUT = [
  { name: 'Technology', value: 45, color: '#3B82F6' },
  { name: 'Telecom', value: 28, color: '#8B5CF6' },
  { name: 'Education', value: 15, color: '#10B981' },
  { name: 'Other', value: 12, color: '#F59E0B' },
]

// ── Stat icon helper ──────────────────────────────────────────────────────────
const STAT_ICON_CFG: Record<StatIconType, { icon: React.ReactNode; bg: string; fg: string }> = {
  reports: { icon: <FileText size={20} />, bg: 'bg-blue-50', fg: 'text-blue-500' },
  companies: { icon: <Building2 size={20} />, bg: 'bg-violet-50', fg: 'text-violet-500' },
  analyses: { icon: <Users size={20} />, bg: 'bg-emerald-50', fg: 'text-emerald-500' },
}

const formatBillion = (val: number) => `${(val / 1000).toFixed(0)}B`

const typeBadge: Record<string, string> = {
  fpt: 'bg-blue-100 text-blue-700',
  vnm: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-700',
}
const typeBtn: Record<string, string> = {
  fpt: 'bg-blue-600 hover:bg-blue-700 text-white',
  vnm: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  other: 'bg-gray-700 hover:bg-gray-800 text-white',
}

// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAnalyzedCompanies(),
        ])
        setStats(s)
        setCompanies(c)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className='flex min-h-screen bg-slate-50 font-outfit'>
      <Sidebar />

      <main className='flex-1 ml-64 p-8 xl:p-12'>
        {/* ── Header ── */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10'>
          <div>
            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
              {greeting}, {user?.FullName?.split(' ')[0] ?? 'Analyst'} 👋
            </h1>
            <p className='text-gray-400 mt-1 text-sm font-light'>
              Financial analytics overview ·{' '}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className='flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-medium text-gray-500'>
            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            Live data
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center h-64 gap-4'>
            <Loader2 className='w-10 h-10 text-blue-500 animate-spin' />
            <p className='text-gray-400 text-sm'>Loading dashboard…</p>
          </div>
        ) : (
          <>
            {/* ── Stat Cards ── */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8'>
              {stats.map((stat, i) => {
                const type = stat.iconType as StatIconType
                const { icon, bg, fg } = STAT_ICON_CFG[type] ?? STAT_ICON_CFG.reports
                const sparkData = SPARKLINES[type] ?? SPARKLINES.reports
                const { stroke, fill } = ACCENT_COLORS[type] ?? ACCENT_COLORS.reports

                return (
                  <div key={i} className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200'>
                    <div className='flex items-center justify-between'>
                      <div className={`w-11 h-11 rounded-2xl ${bg} ${fg} flex items-center justify-center shrink-0`}>
                        {icon}
                      </div>
                      <span className='flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full'>
                        <ArrowUpRight size={12} /> Live
                      </span>
                    </div>
                    <div>
                      <p className='text-3xl font-extrabold text-gray-900'>{stat.value}</p>
                      <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5'>{stat.label}</p>
                    </div>
                    {/* Recharts Sparkline */}
                    <div className='h-12 -mx-1'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                          <defs>
                            <linearGradient id={`sg-${type}`} x1='0' y1='0' x2='0' y2='1'>
                              <stop offset='5%' stopColor={stroke} stopOpacity={0.25} />
                              <stop offset='95%' stopColor={stroke} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type='monotone' dataKey='value' stroke={stroke} strokeWidth={2.5} fill={`url(#sg-${type})`} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Charts Row ── */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8'>
              {/* Grouped Bar Chart */}
              <div className='lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6'>
                <div className='flex items-start justify-between mb-6'>
                  <div>
                    <h3 className='text-base font-bold text-gray-900'>Quarterly Revenue Comparison</h3>
                    <p className='text-xs text-gray-400 mt-0.5'>FPT vs Vinamilk · billion VND · 2023</p>
                  </div>
                </div>
                <ResponsiveContainer width='100%' height={240}>
                  <BarChart data={QUARTERLY} barGap={4} barCategoryGap='30%' margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#F1F5F9' vertical={false} />
                    <XAxis dataKey='quarter' tick={{ fontSize: 11, fontWeight: 600, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={formatBillion} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value.toLocaleString()} B`, name === 'fpt' ? 'FPT' : 'Vinamilk']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                      cursor={{ fill: '#F8FAFC' }}
                    />
                    <Bar dataKey='fpt' name='FPT' fill='#3B82F6' radius={[6, 6, 0, 0]} />
                    <Bar dataKey='vnm' name='Vinamilk' fill='#8B5CF6' radius={[6, 6, 0, 0]} />
                    <Legend iconType='circle' iconSize={8} wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 12 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Donut Chart */}
              <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6'>
                <h3 className='text-base font-bold text-gray-900'>Revenue Mix</h3>
                <p className='text-xs text-gray-400 mt-0.5 mb-4'>FPT Corporation 2023</p>
                <ResponsiveContainer width='100%' height={200}>
                  <PieChart>
                    <Pie data={DONUT} cx='50%' cy='50%' innerRadius={55} outerRadius={80} paddingAngle={3} dataKey='value'>
                      {DONUT.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`]}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className='space-y-2 mt-2'>
                  {DONUT.map((d) => (
                    <div key={d.name} className='flex items-center justify-between text-xs'>
                      <div className='flex items-center gap-2'>
                        <div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: d.color }} />
                        <span className='text-gray-500 font-medium'>{d.name}</span>
                      </div>
                      <span className='font-bold text-gray-800'>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Companies ── */}
            <div className='mb-8'>
              <div className='flex items-center gap-2 mb-5'>
                <BarChart3 size={20} className='text-blue-500' />
                <h3 className='text-base font-bold text-gray-900'>Analyzed Companies</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {companies.map((company, i) => (
                  <div key={i} className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200'>
                    <div className='flex items-center justify-between mb-5'>
                      <div className='flex items-center gap-3'>
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm ${typeBadge[company.type]}`}>
                          {company.symbol?.slice(0, 3)}
                        </div>
                        <div>
                          <p className='font-bold text-gray-900 text-sm'>{company.name}</p>
                          <span className='text-xs text-gray-400 font-medium'>{company.symbol}</span>
                        </div>
                      </div>
                      <span className='flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full'>
                        <TrendingUp size={12} /> {company.growth}
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-3 mb-5'>
                      <div className='bg-slate-50 rounded-2xl p-3.5'>
                        <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider'>Revenue</p>
                        <p className='text-sm font-bold text-gray-800 mt-1'>{company.revenue}</p>
                      </div>
                      <div className='bg-slate-50 rounded-2xl p-3.5'>
                        <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider'>Net Profit</p>
                        <p className='text-sm font-bold text-gray-800 mt-1'>{company.profit}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(company.type === 'fpt' ? '/fpt' : '/vinamilk')}
                      className={`w-full rounded-2xl h-10 font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 ${typeBtn[company.type]}`}
                    >
                      View Full Analysis <ChevronRight size={15} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── AI Banner ── */}
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-8 shadow-xl shadow-blue-100'>
              <div className='absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none' />
              <div className='absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-500/20 blur-2xl pointer-events-none' />
              <div className='relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center'>
                      <MessageSquare size={18} className='text-white' />
                    </div>
                    <h3 className='text-lg font-bold text-white'>AI Financial Assistant</h3>
                  </div>
                  <p className='text-blue-100/80 text-sm font-light max-w-sm'>
                    Ask questions about financial reports and ratios — get instant AI-powered answers.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/ai-assistant')}
                  className='shrink-0 bg-white text-blue-700 hover:bg-blue-50 rounded-2xl px-6 h-11 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap'
                >
                  Open AI Assistant
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
