import { reportsApi } from './api'
import type {
  GetReportsRequest,
  GetReportsResponse,
  ReportDetail,
  UploadReportRequest,
  UploadReportResponse,
  UploadReportAsyncResponse,
  UpdateVisibilityRequest,
  GetReportCategoriesResponse,
  SearchReportsRequest,
  SearchReportsResponse
} from '@/types/reports.types'

/**
 * Reports Service - Business logic and data transformation
 *
 * Manages report operations including upload, retrieval, visibility management,
 * and search functionality. Supports both synchronous and asynchronous uploads.
 *
 * @class ReportsService
 * @example
 * ```typescript
 * import { reportsService } from '@/services'
 *
 * // Get user's reports
 * const myReports = await reportsService.getMyReports({ page: 1, pageSize: 10 })
 *
 * // Upload report asynchronously
 * const result = await reportsService.uploadReportAsync({
 *   file: reportFile,
 *   companyId: 'company-123',
 *   categoryId: 'category-456',
 *   year: 2024,
 *   period: 'Q4',
 *   visibility: 'private'
 * })
 * ```
 */
class ReportsService {
  /**
   * Get user's own reports with pagination
   *
   * @param {GetReportsRequest} [params={}] - Pagination parameters
   * @param {number} [params.page] - Page number (1-indexed)
   * @param {number} [params.pageSize] - Number of items per page
   * @returns {Promise<GetReportsResponse>} Paginated user reports
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await reportsService.getMyReports({ page: 1, pageSize: 20 })
   * console.log(response.data) // Report[]
   * console.log(response.total) // Total count
   * ```
   */
  async getMyReports(params: GetReportsRequest = {}): Promise<GetReportsResponse> {
    const response = await reportsApi.getMyReports(params)
    return response.data
  }

  /**
   * Get publicly available reports with pagination
   *
   * @param {GetReportsRequest} [params={}] - Pagination parameters
   * @returns {Promise<GetReportsResponse>} Paginated public reports
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await reportsService.getPublicReports({ page: 1, pageSize: 20 })
   * ```
   */
  async getPublicReports(params: GetReportsRequest = {}): Promise<GetReportsResponse> {
    const response = await reportsApi.getPublicReports(params)
    return response.data
  }

  /**
   * Get detailed report information by ID
   *
   * @param {string} reportId - The report ID to fetch
   * @returns {Promise<ReportDetail>} Detailed report information including metrics
   * @throws {Error} If report not found or API request fails
   *
   * @example
   * ```typescript
   * const report = await reportsService.getReportDetail('report-123')
   * console.log(report.metrics) // ReportMetric[]
   * ```
   */
  async getReportDetail(reportId: string): Promise<ReportDetail> {
    const response = await reportsApi.getReportDetail(reportId)
    return response.data
  }

  /**
   * Upload Report (Synchronous)
   *
   * ⚠️ **DEPRECATED** - DO NOT USE IN PRODUCTION
   *
   * **WARNING**: API Gateway has 30-second timeout limit, but this method requires 10+ minutes.
   * This will fail on production deployments. Use uploadReportAsync instead.
   *
   * @param {UploadReportRequest} data - Report upload data
   * @returns {Promise<UploadReportResponse>} Upload result with metrics
   * @throws {Error} If upload fails or times out
   *
   * @deprecated Use uploadReportAsync instead
   */
  async uploadReport(data: UploadReportRequest): Promise<UploadReportResponse> {
    const response = await reportsApi.uploadReport(data)
    return response.data
  }

  /**
   * Upload Report (Asynchronous)
   *
   * ✅ **RECOMMENDED** - Returns immediately with a job ID for polling
   *
   * Use this method for all production deployments. Poll the job status to get results.
   *
   * @param {UploadReportRequest} data - Report upload data
   * @param {File} data.file - The report file to upload
   * @param {string} data.companyId - Company ID
   * @param {string} data.categoryId - Report category ID
   * @param {number} data.year - Report year
   * @param {string} data.period - Report period (e.g., 'Q4', 'Annual')
   * @param {'private' | 'public'} data.visibility - Report visibility
   * @returns {Promise<UploadReportAsyncResponse>} Job ID for polling
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const result = await reportsService.uploadReportAsync({
   *   file: reportFile,
   *   companyId: 'company-123',
   *   categoryId: 'category-456',
   *   year: 2024,
   *   period: 'Q4',
   *   visibility: 'private'
   * })
   *
   * // Poll for results
   * const uploadResult = await jobsService.pollJobStatus(result.jobId)
   * ```
   */
  async uploadReportAsync(data: UploadReportRequest): Promise<UploadReportAsyncResponse> {
    const response = await reportsApi.uploadReportAsync(data)
    return response.data
  }

  /**
   * Update report visibility (private/public)
   *
   * @param {string} reportId - The report ID to update
   * @param {UpdateVisibilityRequest} data - Visibility update data
   * @param {'private' | 'public'} data.visibility - New visibility setting
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If report not found or API request fails
   *
   * @example
   * ```typescript
   * await reportsService.updateVisibility('report-123', { visibility: 'public' })
   * ```
   */
  async updateVisibility(reportId: string, data: UpdateVisibilityRequest): Promise<{ message: string }> {
    const response = await reportsApi.updateVisibility(reportId, data)
    return {
      message: response.data.message || 'Visibility updated successfully'
    }
  }

  /**
   * Delete a report by ID
   *
   * @param {string} reportId - The report ID to delete
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If report not found or API request fails
   *
   * @example
   * ```typescript
   * await reportsService.deleteReport('report-123')
   * ```
   */
  async deleteReport(reportId: string): Promise<{ message: string }> {
    const response = await reportsApi.deleteReport(reportId)
    return {
      message: response.data.message || 'Report deleted successfully'
    }
  }

  /**
   * Download a report file
   *
   * @param {string} reportId - The report ID to download
   * @returns {Promise<Blob>} Report file as Blob
   * @throws {Error} If report not found or API request fails
   *
   * @example
   * ```typescript
   * const blob = await reportsService.downloadReport('report-123')
   * const url = URL.createObjectURL(blob)
   * // Use url to download or display the file
   * ```
   */
  async downloadReport(reportId: string): Promise<Blob> {
    const response = await reportsApi.downloadReport(reportId)
    return response.data
  }

  /**
   * Search reports by query and filters
   *
   * @param {SearchReportsRequest} [params={}] - Search parameters
   * @param {string} [params.query] - Search query text
   * @param {string} [params.companyId] - Filter by company ID
   * @param {number} [params.year] - Filter by year
   * @param {string} [params.period] - Filter by period
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @returns {Promise<SearchReportsResponse>} Search results with relevance scores
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const results = await reportsService.searchReports({
   *   query: 'revenue',
   *   year: 2024,
   *   page: 1,
   *   pageSize: 10
   * })
   * ```
   */
  async searchReports(params: SearchReportsRequest = {}): Promise<SearchReportsResponse> {
    const response = await reportsApi.searchReports(params)
    return response.data
  }

  /**
   * Get report metrics
   *
   * ⚠️ **Not yet implemented** - This feature is under development
   *
   * @param {string} reportId - The report ID
   * @returns {Promise<unknown>} Report metrics
   * @throws {Error} Always throws - feature not yet implemented
   *
   * @deprecated This feature is not yet available
   */
  async getReportMetrics(reportId: string): Promise<unknown> {
    console.log('Get report metrics called for:', reportId)
    throw new Error('Tính năng chưa được phát triển')
  }

  /**
   * Get public report categories
   *
   * @returns {Promise<GetReportCategoriesResponse>} List of report categories
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const categories = await reportsService.getReportCategories()
   * ```
   */
  async getReportCategories(): Promise<GetReportCategoriesResponse> {
    const response = await reportsApi.getReportCategories()
    return response.data
  }
}

export const reportsService = new ReportsService()
