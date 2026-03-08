import axiosInstance from '@/lib/axios'

// ─── Raw API response shapes ────────────────────────────────────────────────

interface AdminStatisticsRaw {
  reports?: { total?: number }
  users?: { total?: number }
}

interface CompanyListItemRaw {
  name?: string
  ticker?: string
}

interface PaginatedResponse<T> {
  total?: number
  page?: number
  pageSize?: number
  data?: T[]
}

// ─── Public types ────────────────────────────────────────────────────────────

export type StatIconType = 'reports' | 'companies' | 'analyses'

export interface DashboardStats {
  label: string
  value: string
  iconType: StatIconType
}

export type CompanyType = 'fpt' | 'vnm' | 'other'

export interface Company {
  name: string
  symbol: string
  reports: number
  revenue: string
  profit: string
  growth: string
  type: CompanyType
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveCompanyType(ticker: string): CompanyType {
  const t = ticker?.toLowerCase()
  if (t === 'fpt') return 'fpt'
  if (t === 'vnm') return 'vnm'
  return 'other'
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const dashboardService = {
  async getStats(): Promise<DashboardStats[]> {
    try {
      const userRole = localStorage.getItem('userRole')

      if (userRole === 'Admin' || userRole === 'Analyst') {
        try {
          const response = await axiosInstance.get<AdminStatisticsRaw>('/admin/statistics')
          const data = response.data
          return [
            { label: 'Total Reports', value: String(data.reports?.total ?? 0), iconType: 'reports' },
            { label: 'Companies Analyzed', value: '2', iconType: 'companies' },
            { label: 'Total Users', value: String(data.users?.total ?? 0), iconType: 'analyses' },
          ]
        } catch {
          // fall through to default stats
        }
      }

      return [
        { label: 'Total Reports', value: '22', iconType: 'reports' },
        { label: 'Companies Analyzed', value: '2', iconType: 'companies' },
        { label: 'Analyses This Month', value: '156', iconType: 'analyses' },
      ]
    } catch (error) {
      console.error('Dashboard stats error:', error)
      return [
        { label: 'Total Reports', value: '22', iconType: 'reports' },
        { label: 'Companies Analyzed', value: '2', iconType: 'companies' },
        { label: 'Analyses This Month', value: '156', iconType: 'analyses' },
      ]
    }
  },

  async getAnalyzedCompanies(): Promise<Company[]> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<CompanyListItemRaw> | CompanyListItemRaw[]>('/Companies')
      const body = response.data

      let items: CompanyListItemRaw[] = []
      if (body && !Array.isArray(body) && Array.isArray((body as PaginatedResponse<CompanyListItemRaw>).data)) {
        items = (body as PaginatedResponse<CompanyListItemRaw>).data ?? []
      } else if (Array.isArray(body)) {
        items = body as CompanyListItemRaw[]
      }

      return items.map((item) => ({
        name: item.name ?? '',
        symbol: item.ticker ?? '',
        reports: 0,
        revenue: 'See Detail',
        profit: 'See Detail',
        growth: '+0.0%',
        type: resolveCompanyType(item.ticker ?? ''),
      }))
    } catch (error) {
      console.error('Dashboard companies error:', error)
      return [
        {
          name: 'FPT Corporation',
          symbol: 'FPT',
          reports: 12,
          revenue: '42,817 billion VND',
          profit: '7,234 billion VND',
          growth: '+15.2%',
          type: 'fpt',
        },
        {
          name: 'Vinamilk',
          symbol: 'VNM',
          reports: 10,
          revenue: '63,558 billion VND',
          profit: '11,245 billion VND',
          growth: '+8.7%',
          type: 'vnm',
        },
      ]
    }
  },
}
