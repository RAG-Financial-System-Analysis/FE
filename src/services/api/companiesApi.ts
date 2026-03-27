import axiosInstance from '@/lib/axios'
import type {
  GetCompaniesRequest,
  GetCompaniesResponse,
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanyResponse
} from '@/types/companies.types'

/**
 * Companies API module - Pure API communication with no business logic
 */
export const companiesApi = {
  getCompanies: (params: GetCompaniesRequest) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.industry) queryParams.append('industry', params.industry)
    return axiosInstance.get<GetCompaniesResponse>(`/api/Companies?${queryParams.toString()}`)
  },

  getCompanyDetail: (companyId: string) => axiosInstance.get<Company>(`/api/Companies/${companyId}`),

  createCompany: (data: CreateCompanyRequest) => axiosInstance.post<CompanyResponse>('/api/Companies', data),

  updateCompany: (companyId: string, data: UpdateCompanyRequest) =>
    axiosInstance.put<{ message: string }>(`/api/Companies/${companyId}`, data),

  deleteCompany: (companyId: string) => axiosInstance.delete<{ message: string }>(`/api/Companies/${companyId}`)
}
