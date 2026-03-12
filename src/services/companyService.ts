import axiosInstance from '@/lib/axios'

// ─── Raw API response shapes ────────────────────────────────────────────────

interface CompanyListItem {
  id?: string
  Id?: string
  name?: string
  Name?: string
  ticker?: string
  Ticker?: string
  industry?: string
  Industry?: string
}

interface CompanyListResponse {
  total?: number
  page?: number
  pageSize?: number
  data?: CompanyListItem[]
}

interface CompanyDetailRaw {
  id?: string
  Id?: string
  name?: string
  Name?: string
  ticker?: string
  Ticker?: string
  industry?: string
  Industry?: string
  description?: string
  Description?: string
  website?: string
  Website?: string
}

// ─── Public types ───────────────────────────────────────────────────────────

export interface CompanyDetail {
  id: string
  name: string
  symbol: string
  industry: string
  ticker: string
  description?: string
  website?: string
  established?: number
  summaryStats?: {
    revenue: { value: string; unit: string; growth: string }
    netProfit: { value: string; unit: string; growth: string }
    roe: { value: string; growth: string }
    profitMargin: { value: string; growth: string }
  }
  stockTrend?: { label: string; price: number }[]
  revenueStructure?: { category: string; percentage: number; color: string }[]
  quarterlyPerformance?: { quarter: string; revenue: number; profit: number }[]
  financialRatios?: {
    roa: { value: string; change: string }
    debtToAssets: { value: string; change: string }
    currentRatio: { value: string; change: string }
    assetTurnover: { value: string; change: string }
    eps: { value: string; change: string }
    pe: { value: string; change: string }
  }
  analysis?: {
    strengths: string
    opportunities: string
    risks: string
  }
}

interface NormalizedCompany {
  id: string
  name: string
  ticker: string
  industry: string
  reports: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeCompany(raw: CompanyListItem): NormalizedCompany {
  return {
    id: raw.id ?? raw.Id ?? '',
    name: raw.name ?? raw.Name ?? '',
    ticker: raw.ticker ?? raw.Ticker ?? '',
    industry: raw.industry ?? raw.Industry ?? '',
    reports: 0
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const companyService = {
  async getCompanies(page = 1, pageSize = 10, industry?: string): Promise<NormalizedCompany[]> {
    const response = await axiosInstance.get<CompanyListResponse | CompanyListItem[]>('/api/Companies', {
      params: { page, pageSize, industry }
    })

    const body = response.data

    // Paginated wrapper: { data: [...] }
    if (body && !Array.isArray(body) && Array.isArray((body as CompanyListResponse).data)) {
      return ((body as CompanyListResponse).data ?? []).map(normalizeCompany)
    }

    // Plain array fallback
    if (Array.isArray(body)) {
      return (body as CompanyListItem[]).map(normalizeCompany)
    }

    return []
  },

  async getCompanyIdByTicker(ticker: string): Promise<string | null> {
    try {
      const companies = await this.getCompanies(1, 100)
      const match = companies.find((c) => c.ticker.toLowerCase() === ticker.toLowerCase())
      return match?.id ?? null
    } catch {
      return null
    }
  },

  async getCompanyDetail(id: string): Promise<CompanyDetail> {
    // If the caller passed a non-UUID ticker, resolve it to a real UUID first.
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)

    let companyId = id
    if (!isUUID) {
      const foundId = await this.getCompanyIdByTicker(id)
      if (foundId) {
        companyId = foundId
      } else {
        throw new Error(`Company with ticker '${id}' not found.`)
      }
    }

    const response = await axiosInstance.get<CompanyDetailRaw>(`/Companies/${companyId}`)
    const raw = response.data

    const symbol = raw.ticker ?? raw.Ticker ?? ''
    const mockData = this.getMockData(symbol)

    return {
      ...mockData,
      id: raw.id ?? raw.Id ?? '',
      name: raw.name ?? raw.Name ?? '',
      symbol,
      ticker: symbol,
      industry: raw.industry ?? raw.Industry ?? '',
      description: raw.description ?? raw.Description,
      website: raw.website ?? raw.Website
    }
  },

  getMockData(symbol: string): Partial<CompanyDetail> {
    if (symbol.toUpperCase() === 'FPT') {
      return {
        established: 1988,
        summaryStats: {
          revenue: { value: '42,817', unit: 'billion VND', growth: '+15.2%' },
          netProfit: { value: '7,234', unit: 'billion VND', growth: '+12.8%' },
          roe: { value: '23.5%', growth: '+2.3%' },
          profitMargin: { value: '16.9%', growth: '+0.8%' }
        },
        stockTrend: [
          { label: 'Jan', price: 62000 },
          { label: 'Feb', price: 65000 },
          { label: 'Mar', price: 68000 },
          { label: 'Apr', price: 70000 },
          { label: 'May', price: 73000 },
          { label: 'Jun', price: 75000 },
          { label: 'Jul', price: 78000 },
          { label: 'Aug', price: 72000 },
          { label: 'Sep', price: 76000 },
          { label: 'Oct', price: 80000 },
          { label: 'Nov', price: 83000 },
          { label: 'Dec', price: 86000 }
        ],
        revenueStructure: [
          { category: 'Technology', percentage: 45, color: '#3B82F6' },
          { category: 'Telecommunications', percentage: 28, color: '#8B5CF6' },
          { category: 'Education', percentage: 15, color: '#10B981' },
          { category: 'Others', percentage: 12, color: '#F59E0B' }
        ],
        quarterlyPerformance: [
          { quarter: 'Q1 2023', revenue: 9800, profit: 1600 },
          { quarter: 'Q2 2023', revenue: 10500, profit: 1800 },
          { quarter: 'Q3 2023', revenue: 11200, profit: 1950 },
          { quarter: 'Q4 2023', revenue: 11400, profit: 1750 }
        ],
        financialRatios: {
          roa: { value: '12.8%', change: '+1.5%' },
          debtToAssets: { value: '45.2%', change: '-3.2%' },
          currentRatio: { value: '1.85', change: '+0.15' },
          assetTurnover: { value: '0.92', change: '+0.08' },
          eps: { value: '4250', change: '+12.3%' },
          pe: { value: '18.5', change: '+2.1' }
        },
        analysis: {
          strengths:
            'FPT maintains high growth in the IT sector with 15.2% revenue growth in 2023. The company is expanding strongly into international markets with major projects in Japan and Europe.',
          opportunities:
            'Global digital transformation trend creates many opportunities for FPT to expand market share, especially in AI, Cloud Computing, and enterprise technology solutions.',
          risks:
            'Fierce competition in the technology industry and global market volatility may affect business performance. Rising labor costs also pose management challenges.'
        }
      }
    }

    if (symbol.toUpperCase() === 'VNM') {
      return {
        established: 1976,
        summaryStats: {
          revenue: { value: '63,558', unit: 'billion VND', growth: '+3.7%' },
          netProfit: { value: '11,245', unit: 'billion VND', growth: '+7.5%' },
          roe: { value: '28.3%', growth: '+1.8%' },
          profitMargin: { value: '17.7%', growth: '-0.5%' }
        },
        stockTrend: [
          { label: 'Jan', price: 78000 },
          { label: 'Feb', price: 76000 },
          { label: 'Mar', price: 80000 },
          { label: 'Apr', price: 77000 },
          { label: 'May', price: 81000 },
          { label: 'Jun', price: 79000 },
          { label: 'Jul', price: 83000 },
          { label: 'Aug', price: 81000 },
          { label: 'Sep', price: 84000 },
          { label: 'Oct', price: 82000 },
          { label: 'Nov', price: 85000 },
          { label: 'Dec', price: 87000 }
        ],
        revenueStructure: [
          { category: 'Liquid Milk', percentage: 42, color: '#10B981' },
          { category: 'Milk Powder', percentage: 26, color: '#F59E0B' },
          { category: 'Yogurt', percentage: 18, color: '#8B5CF6' },
          { category: 'Other Products', percentage: 14, color: '#EF4444' }
        ],
        quarterlyPerformance: [
          { quarter: 'Q1 2023', revenue: 15200, profit: 2700 },
          { quarter: 'Q2 2023', revenue: 15800, profit: 2850 },
          { quarter: 'Q3 2023', revenue: 16100, profit: 2900 },
          { quarter: 'Q4 2023', revenue: 16458, profit: 2795 }
        ],
        financialRatios: {
          roa: { value: '15.6%', change: '+1.2%' },
          debtToAssets: { value: '38.7%', change: '-2.8%' },
          currentRatio: { value: '2.15', change: '+0.22' },
          assetTurnover: { value: '1.05', change: '+0.05' },
          eps: { value: '5480', change: '+8.7%' },
          pe: { value: '15.2', change: '-1.3' }
        },
        analysis: {
          strengths:
            'Vinamilk is the leading company in food & beverage with high ROE of 28.3%. The company has an extensive distribution system and a trusted brand recognized by Vietnamese consumers.',
          opportunities:
            "Vietnam's dairy market continues to grow well with a young population and trend toward nutritional products. Vinamilk has opportunities to expand into Southeast Asian export markets.",
          risks:
            'Competition from foreign brands and changing consumer habits may affect market share. Raw material price fluctuations also impact profit margins.'
        }
      }
    }

    return {}
  }
}
