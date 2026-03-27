import { companiesApi } from './api'
import type {
  GetCompaniesRequest,
  GetCompaniesResponse,
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanyResponse
} from '@/types/companies.types'

/**
 * Companies Service - Business logic and data transformation
 *
 * Manages company information including retrieval, creation, updating, and deletion.
 * Admin-only operations for company management.
 *
 * @class CompaniesService
 * @example
 * ```typescript
 * import { companiesService } from '@/services'
 *
 * // Get companies list
 * const companies = await companiesService.getCompanies({ page: 1, pageSize: 20 })
 *
 * // Get company details
 * const company = await companiesService.getCompanyDetail('company-123')
 * ```
 */
class CompaniesService {
  /**
   * Get companies list with pagination and filtering
   *
   * @param {GetCompaniesRequest} [params={}] - Pagination and filter parameters
   * @param {number} [params.page] - Page number (1-indexed)
   * @param {number} [params.pageSize] - Number of items per page
   * @param {string} [params.industry] - Filter by industry
   * @returns {Promise<GetCompaniesResponse>} Paginated companies list
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await companiesService.getCompanies({
   *   page: 1,
   *   pageSize: 20,
   *   industry: 'Technology'
   * })
   * ```
   */
  async getCompanies(params: GetCompaniesRequest = {}): Promise<GetCompaniesResponse> {
    const response = await companiesApi.getCompanies(params)
    return response.data
  }

  /**
   * Get detailed company information by ID
   *
   * @param {string} companyId - The company ID to fetch
   * @returns {Promise<Company>} Detailed company information
   * @throws {Error} If company not found or API request fails
   *
   * @example
   * ```typescript
   * const company = await companiesService.getCompanyDetail('company-123')
   * console.log(company.name, company.ticker)
   * ```
   */
  async getCompanyDetail(companyId: string): Promise<Company> {
    const response = await companiesApi.getCompanyDetail(companyId)
    return response.data
  }

  /**
   * Create a new company (Admin only)
   *
   * @param {CreateCompanyRequest} data - Company data
   * @param {string} data.ticker - Stock ticker symbol
   * @param {string} data.name - Company name
   * @param {string} data.industry - Industry classification
   * @param {string} data.description - Company description
   * @param {string} data.website - Company website URL
   * @returns {Promise<CompanyResponse>} Created company ID and message
   * @throws {Error} If creation fails or user is not admin
   *
   * @example
   * ```typescript
   * const result = await companiesService.createCompany({
   *   ticker: 'ACME',
   *   name: 'ACME Corporation',
   *   industry: 'Technology',
   *   description: 'Leading tech company',
   *   website: 'https://acme.com'
   * })
   * ```
   */
  async createCompany(data: CreateCompanyRequest): Promise<CompanyResponse> {
    const response = await companiesApi.createCompany(data)
    return {
      id: response.data.id,
      message: response.data.message || 'Company created successfully'
    }
  }

  /**
   * Update company information (Admin only)
   *
   * @param {string} companyId - The company ID to update
   * @param {UpdateCompanyRequest} data - Updated company data
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If company not found, user is not admin, or API request fails
   *
   * @example
   * ```typescript
   * await companiesService.updateCompany('company-123', {
   *   ticker: 'ACME',
   *   name: 'ACME Corp',
   *   industry: 'Technology',
   *   description: 'Updated description',
   *   website: 'https://acme.com'
   * })
   * ```
   */
  async updateCompany(companyId: string, data: UpdateCompanyRequest): Promise<{ message: string }> {
    const response = await companiesApi.updateCompany(companyId, data)
    return {
      message: response.data.message || 'Company updated successfully'
    }
  }

  /**
   * Delete a company (Admin only)
   *
   * @param {string} companyId - The company ID to delete
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If company not found, user is not admin, or API request fails
   *
   * @example
   * ```typescript
   * await companiesService.deleteCompany('company-123')
   * ```
   */
  async deleteCompany(companyId: string): Promise<{ message: string }> {
    const response = await companiesApi.deleteCompany(companyId)
    return {
      message: response.data.message || 'Company deleted successfully'
    }
  }
}

export const companiesService = new CompaniesService()
