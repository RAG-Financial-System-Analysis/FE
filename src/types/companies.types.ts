// Companies related types

export interface Company {
  id: string
  ticker: string
  name: string
  industry: string
  description: string
  website: string
  createdAt: string
}

export interface GetCompaniesRequest {
  page?: number
  pageSize?: number
  industry?: string
}

export interface GetCompaniesResponse {
  data: Company[]
  total: number
  page: number
  pageSize: number
}

export interface CreateCompanyRequest {
  ticker: string
  name: string
  industry: string
  description: string
  website: string
}

export interface UpdateCompanyRequest {
  ticker: string
  name: string
  industry: string
  description: string
  website: string
}

export interface CompanyResponse {
  id: string
  message: string
}
