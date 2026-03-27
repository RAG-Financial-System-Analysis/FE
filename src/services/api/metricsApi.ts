import axiosInstance from '@/lib/axios'
import type {
  GetMetricsGroupsResponse,
  GetMetricDefinitionsRequest,
  GetMetricDefinitionsResponse,
  GetMetricValuesResponse,
  CalculateMetricsRequest,
  CalculateMetricsResponse
} from '@/types/metrics.types'

/**
 * Metrics API module - Pure API communication with no business logic
 */
export const metricsApi = {
  getMetricsGroups: () => axiosInstance.get<GetMetricsGroupsResponse>('/api/metrics/groups'),

  getMetricDefinitions: (params: GetMetricDefinitionsRequest) => {
    const queryParams = new URLSearchParams()
    if (params.groupId) queryParams.append('groupId', params.groupId)
    return axiosInstance.get<GetMetricDefinitionsResponse>(`/api/metrics/definitions?${queryParams.toString()}`)
  },

  getMetricValues: (reportId: string) => axiosInstance.get<GetMetricValuesResponse>(`/api/metrics/values/${reportId}`),

  calculateMetrics: (data: CalculateMetricsRequest) =>
    axiosInstance.post<CalculateMetricsResponse>('/api/metrics/calculate', data)
}
