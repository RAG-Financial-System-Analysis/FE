import axiosInstance from '@/lib/axios'
import type {
  GetAnalyticsTypesResponse,
  GenerateAnalyticsReportRequest,
  GenerateAnalyticsReportResponse,
  GetAnalyticsReportsRequest,
  GetAnalyticsReportsResponse,
  AnalyticsReportDetail
} from '@/types/analytics.types'

class AnalyticsService {
  // Get all analytics types
  async getAnalyticsTypes(): Promise<GetAnalyticsTypesResponse> {
    const response = await axiosInstance.get('/api/analytics/types')
    return response.data
  }

  // Generate analytics report (async) - RECOMMENDED
  async generateReportAsync(data: GenerateAnalyticsReportRequest): Promise<{ jobId: string }> {
    const response = await axiosInstance.post('/api/analytics/generate-async', data)
    return response.data
  }

  // Generate analytics report (sync) - DEPRECATED
  async generateReport(data: GenerateAnalyticsReportRequest): Promise<GenerateAnalyticsReportResponse> {
    const response = await axiosInstance.post('/api/analytics/generate', data)
    return response.data
  }

  // Get analytics reports
  async getReports(params: GetAnalyticsReportsRequest = {}): Promise<GetAnalyticsReportsResponse> {
    const queryParams = new URLSearchParams()

    if (params.sessionId) queryParams.append('sessionId', params.sessionId)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const response = await axiosInstance.get(`/api/analytics/reports?${queryParams.toString()}`)
    return response.data
  }

  // Get analytics report by ID
  async getReportById(id: string): Promise<AnalyticsReportDetail> {
    const response = await axiosInstance.get(`/api/analytics/reports/${id}`)
    return response.data
  }
}

export default new AnalyticsService()
