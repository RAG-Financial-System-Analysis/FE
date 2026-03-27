import { analyticsApi } from './api'
import type {
  GetAnalyticsTypesResponse,
  GenerateAnalyticsReportRequest,
  GenerateAnalyticsReportResponse,
  GetAnalyticsReportsRequest,
  GetAnalyticsReportsResponse,
  AnalyticsReportDetail
} from '@/types/analytics.types'

/**
 * Analytics Service - Business logic and data transformation
 *
 * Manages analytics operations including report generation and retrieval.
 * Supports both synchronous and asynchronous report generation.
 *
 * @class AnalyticsService
 * @example
 * ```typescript
 * import { analyticsService } from '@/services'
 *
 * // Get analytics types
 * const types = await analyticsService.getAnalyticsTypes()
 *
 * // Generate report asynchronously
 * const result = await analyticsService.generateReportAsync({
 *   sessionId: 'session-123',
 *   title: 'Q4 Analysis'
 * })
 * ```
 */
class AnalyticsService {
  /**
   * Get all available analytics types
   *
   * @returns {Promise<GetAnalyticsTypesResponse>} List of analytics types
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await analyticsService.getAnalyticsTypes()
   * console.log(response.analyticsTypes) // AnalyticsType[]
   * ```
   */
  async getAnalyticsTypes(): Promise<GetAnalyticsTypesResponse> {
    const response = await analyticsApi.getAnalyticsTypes()
    return response.data
  }

  /**
   * Generate analytics report (Asynchronous)
   *
   * ✅ **RECOMMENDED** - Returns immediately with a job ID for polling
   *
   * @param {GenerateAnalyticsReportRequest} data - Report generation parameters
   * @param {string} data.sessionId - Chat session ID
   * @param {string} data.title - Report title
   * @returns {Promise<{ jobId: string }>} Job ID for polling
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const result = await analyticsService.generateReportAsync({
   *   sessionId: 'session-123',
   *   title: 'Q4 Financial Analysis'
   * })
   *
   * // Poll for results
   * const report = await jobsService.pollJobStatus(result.jobId)
   * ```
   */
  async generateReportAsync(data: GenerateAnalyticsReportRequest): Promise<{ jobId: string }> {
    const response = await analyticsApi.generateReportAsync(data)
    return response.data
  }

  /**
   * Generate analytics report (Synchronous)
   *
   * ⚠️ **DEPRECATED** - Use generateReportAsync instead for better performance
   *
   * @param {GenerateAnalyticsReportRequest} data - Report generation parameters
   * @returns {Promise<GenerateAnalyticsReportResponse>} Generated report
   * @throws {Error} If API request fails or times out
   *
   * @deprecated Use generateReportAsync instead
   */
  async generateReport(data: GenerateAnalyticsReportRequest): Promise<GenerateAnalyticsReportResponse> {
    const response = await analyticsApi.generateReport(data)
    return response.data
  }

  /**
   * Get analytics reports with pagination
   *
   * @param {GetAnalyticsReportsRequest} [params={}] - Pagination and filter parameters
   * @param {string} [params.sessionId] - Filter by session ID
   * @param {number} [params.page] - Page number (1-indexed)
   * @param {number} [params.pageSize] - Number of items per page
   * @returns {Promise<GetAnalyticsReportsResponse>} Paginated analytics reports
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await analyticsService.getReports({
   *   sessionId: 'session-123',
   *   page: 1,
   *   pageSize: 10
   * })
   * ```
   */
  async getReports(params: GetAnalyticsReportsRequest = {}): Promise<GetAnalyticsReportsResponse> {
    const response = await analyticsApi.getReports(params)
    return response.data
  }

  /**
   * Get analytics report by ID
   *
   * @param {string} id - The analytics report ID
   * @returns {Promise<AnalyticsReportDetail>} Detailed analytics report
   * @throws {Error} If report not found or API request fails
   *
   * @example
   * ```typescript
   * const report = await analyticsService.getReportById('report-123')
   * console.log(report.generatedContent)
   * ```
   */
  async getReportById(id: string): Promise<AnalyticsReportDetail> {
    const response = await analyticsApi.getReportById(id)
    return response.data
  }
}

export const analyticsService = new AnalyticsService()
