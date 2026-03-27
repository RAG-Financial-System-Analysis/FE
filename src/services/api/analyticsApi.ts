import axiosInstance from '@/lib/axios'
import type {
  GetAnalyticsTypesResponse,
  GenerateAnalyticsReportRequest,
  GenerateAnalyticsReportResponse,
  GetAnalyticsReportsRequest,
  GetAnalyticsReportsResponse,
  AnalyticsReportDetail
} from '@/types/analytics.types'

/**
 * Analytics API module - Pure API communication with no business logic
 */
export const analyticsApi = {
  getAnalyticsTypes: () => axiosInstance.get<GetAnalyticsTypesResponse>('/api/analytics/types'),

  generateReportAsync: (data: GenerateAnalyticsReportRequest) =>
    axiosInstance.post<{ jobId: string }>('/api/analytics/generate-async', data),

  generateReport: (data: GenerateAnalyticsReportRequest) =>
    axiosInstance.post<GenerateAnalyticsReportResponse>('/api/analytics/generate', data),

  getReports: (params: GetAnalyticsReportsRequest) => {
    const queryParams = new URLSearchParams()
    if (params.sessionId) queryParams.append('sessionId', params.sessionId)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    return axiosInstance.get<GetAnalyticsReportsResponse>(`/api/analytics/reports?${queryParams.toString()}`)
  },

  getReportById: (id: string) => axiosInstance.get<AnalyticsReportDetail>(`/api/analytics/reports/${id}`)
}
