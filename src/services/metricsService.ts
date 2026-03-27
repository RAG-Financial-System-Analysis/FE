import { metricsApi } from './api'
import type {
  GetMetricsGroupsResponse,
  GetMetricDefinitionsRequest,
  GetMetricDefinitionsResponse,
  GetMetricValuesResponse,
  CalculateMetricsRequest,
  CalculateMetricsResponse
} from '@/types/metrics.types'

/**
 * Metrics Service - Business logic and data transformation
 *
 * Manages metrics operations including retrieval of metric definitions,
 * values, and calculation of custom metrics.
 *
 * @class MetricsService
 * @example
 * ```typescript
 * import { metricsService } from '@/services'
 *
 * // Get metrics groups
 * const groups = await metricsService.getMetricsGroups()
 *
 * // Get metric values for a report
 * const values = await metricsService.getMetricValues('report-123')
 * ```
 */
class MetricsService {
  /**
   * Get all metrics groups
   *
   * @returns {Promise<GetMetricsGroupsResponse>} List of metrics groups
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await metricsService.getMetricsGroups()
   * console.log(response.groups) // MetricsGroup[]
   * ```
   */
  async getMetricsGroups(): Promise<GetMetricsGroupsResponse> {
    const response = await metricsApi.getMetricsGroups()
    return response.data
  }

  /**
   * Get metric definitions with optional filtering
   *
   * @param {GetMetricDefinitionsRequest} [params={}] - Filter parameters
   * @param {string} [params.groupId] - Filter by metrics group ID
   * @returns {Promise<GetMetricDefinitionsResponse>} List of metric definitions
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await metricsService.getMetricDefinitions({
   *   groupId: 'group-123'
   * })
   * ```
   */
  async getMetricDefinitions(params: GetMetricDefinitionsRequest = {}): Promise<GetMetricDefinitionsResponse> {
    const response = await metricsApi.getMetricDefinitions(params)
    return response.data
  }

  /**
   * Get metric values extracted from a report
   *
   * @param {string} reportId - The report ID to get metrics for
   * @returns {Promise<GetMetricValuesResponse>} Metric values from the report
   * @throws {Error} If report not found or API request fails
   *
   * @example
   * ```typescript
   * const response = await metricsService.getMetricValues('report-123')
   * console.log(response.values) // MetricValue[]
   * ```
   */
  async getMetricValues(reportId: string): Promise<GetMetricValuesResponse> {
    const response = await metricsApi.getMetricValues(reportId)
    return response.data
  }

  /**
   * Calculate custom metrics for a report
   *
   * @param {CalculateMetricsRequest} data - Calculation parameters
   * @param {string} data.reportId - Report ID to calculate metrics for
   * @param {string[]} data.metricIds - IDs of metrics to calculate
   * @param {Object} data.parameters - Calculation parameters
   * @param {boolean} data.parameters.recalculate - Force recalculation
   * @param {boolean} data.parameters.useAI - Use AI for calculation
   * @returns {Promise<CalculateMetricsResponse>} Calculated metrics
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await metricsService.calculateMetrics({
   *   reportId: 'report-123',
   *   metricIds: ['metric-1', 'metric-2'],
   *   parameters: {
   *     recalculate: true,
   *     useAI: true
   *   }
   * })
   * ```
   */
  async calculateMetrics(data: CalculateMetricsRequest): Promise<CalculateMetricsResponse> {
    const response = await metricsApi.calculateMetrics(data)
    return response.data
  }
}

export const metricsService = new MetricsService()
