import axiosInstance from '@/lib/axios'
import type {
  GetCompaniesRequest,
  GetCompaniesResponse,
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanyResponse
} from '@/types/companies.types'

class CompaniesService {
  // Get Companies List
  async getCompanies(params: GetCompaniesRequest = {}): Promise<GetCompaniesResponse> {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.industry) queryParams.append('industry', params.industry)

    const response = await axiosInstance.get(`/api/Companies?${queryParams.toString()}`)
    return response.data
  }

  // Get Company Detail
  async getCompanyDetail(companyId: string): Promise<Company> {
    const response = await axiosInstance.get(`/api/Companies/${companyId}`)
    return response.data
  }

  // Create Company (Admin only)
  async createCompany(data: CreateCompanyRequest): Promise<CompanyResponse> {
    const response = await axiosInstance.post('/api/Companies', data)
    return {
      id: response.data.id,
      message: response.data.message || 'Company created successfully'
    }
  }

  // Update Company (Admin only)
  async updateCompany(companyId: string, data: UpdateCompanyRequest): Promise<{ message: string }> {
    const response = await axiosInstance.put(`/api/Companies/${companyId}`, data)
    return {
      message: response.data.message || 'Company updated successfully'
    }
  }

  // Delete Company (Admin only)
  async deleteCompany(companyId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/Companies/${companyId}`)
    return {
      message: response.data.message || 'Company deleted successfully'
    }
  }
}

export default new CompaniesService()
