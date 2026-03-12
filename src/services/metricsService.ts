import axiosInstance from '@/lib/axios'
import type {
  GetMetricsGroupsResponse,
  GetMetricDefinitionsRequest,
  GetMetricDefinitionsResponse,
  GetMetricValuesResponse,
  CalculateMetricsRequest,
  CalculateMetricsResponse
} from '@/types/metrics.types'

class MetricsService {
  // Get Metrics Groups
  async getMetricsGroups(): Promise<GetMetricsGroupsResponse> {
    const response = await axiosInstance.get('/api/metrics/groups')
    return response.data
  }

  // Get Metric Definitions
  async getMetricDefinitions(params: GetMetricDefinitionsRequest = {}): Promise<GetMetricDefinitionsResponse> {
    const queryParams = new URLSearchParams()

    if (params.groupId) {
      queryParams.append('groupId', params.groupId)
    }

    const response = await axiosInstance.get(`/api/metrics/definitions?${queryParams.toString()}`)
    return response.data
  }

  // Get Metric Values by Report ID
  async getMetricValues(reportId: string): Promise<GetMetricValuesResponse> {
    const response = await axiosInstance.get(`/api/metrics/values/${reportId}`)
    return response.data
  }

  // Calculate Metrics
  async calculateMetrics(data: CalculateMetricsRequest): Promise<CalculateMetricsResponse> {
    const response = await axiosInstance.post('/api/metrics/calculate', data)
    return response.data
  }
}

export default new MetricsService()
