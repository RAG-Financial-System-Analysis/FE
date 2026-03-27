/**
 * Companies and company details types
 */

/**
 * Basic company information
 */
export interface Company {
  id: string
  ticker: string
  name: string
  industry: string
  description: string
  website: string
  createdAt: string
}

/**
 * Request to get companies with pagination and filtering
 */
export interface GetCompaniesRequest {
  page?: number
  pageSize?: number
  industry?: string
}

/**
 * Response containing paginated companies
 */
export interface GetCompaniesResponse {
  data: Company[]
  total: number
  page: number
  pageSize: number
}

/**
 * Request to create a new company
 */
export interface CreateCompanyRequest {
  ticker: string
  name: string
  industry: string
  description: string
  website: string
}

/**
 * Request to update company information
 */
export interface UpdateCompanyRequest {
  ticker: string
  name: string
  industry: string
  description: string
  website: string
}

/**
 * Response from company creation/update
 */
export interface CompanyResponse {
  id: string
  message: string
}

/**
 * Company list item from API
 */
export interface CompanyListItem {
  id?: string
  Id?: string
  name?: string
  Name?: string
  ticker?: string
  Ticker?: string
  industry?: string
  Industry?: string
}

/**
 * Company list response from API
 */
export interface CompanyListResponse {
  total?: number
  page?: number
  pageSize?: number
  data?: CompanyListItem[]
}

/**
 * Raw company detail response from API
 */
export interface CompanyDetailRaw {
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

/**
 * Normalized company detail with financial data
 */
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

/**
 * Normalized company for list display
 */
export interface NormalizedCompany {
  id: string
  name: string
  ticker: string
  industry: string
  reports: number
}
