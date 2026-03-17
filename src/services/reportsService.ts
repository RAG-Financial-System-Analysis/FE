import axiosInstance from '@/lib/axios'
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

class ReportsService {
  // Get My Reports
  async getMyReports(params: GetReportsRequest = {}): Promise<GetReportsResponse> {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const response = await axiosInstance.get(`/api/reports/my-reports?${queryParams.toString()}`)
    return response.data
  }

  // Get Public Reports
  async getPublicReports(params: GetReportsRequest = {}): Promise<GetReportsResponse> {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const response = await axiosInstance.get(`/api/reports/public-reports?${queryParams.toString()}`)
    return response.data
  }

  // Get Report Detail
  async getReportDetail(reportId: string): Promise<ReportDetail> {
    const response = await axiosInstance.get(`/api/reports/${reportId}`)
    return response.data
  }

  // Upload Report (Synchronous) - DEPRECATED: WILL TIMEOUT ON API GATEWAY!
  // ⚠️  WARNING: API Gateway has 30s timeout limit, but this method needs 10+ minutes
  // ⚠️  USE uploadReportAsync instead for production deployment
  async uploadReport(data: UploadReportRequest): Promise<UploadReportResponse> {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('companyId', data.companyId)
    formData.append('categoryId', data.categoryId)
    formData.append('year', data.year.toString())
    formData.append('period', data.period)
    formData.append('visibility', data.visibility)

    const response = await axiosInstance.post('/api/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 25000 // Reduced to 25s to match API Gateway limit (will still timeout for large files)
    })
    return response.data
  }

  // Upload Report (Asynchronous) - NEW: Replaces uploadReport
  async uploadReportAsync(data: UploadReportRequest): Promise<UploadReportAsyncResponse> {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('companyId', data.companyId)
    formData.append('categoryId', data.categoryId)
    formData.append('year', data.year.toString())
    formData.append('period', data.period)
    formData.append('visibility', data.visibility)

    const response = await axiosInstance.post('/api/reports/upload-async', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 25000 // 25 seconds - safely under API Gateway 30s limit
    })
    return response.data
  }

  // Update Visibility
  async updateVisibility(reportId: string, data: UpdateVisibilityRequest): Promise<{ message: string }> {
    const response = await axiosInstance.patch(`/api/reports/${reportId}/visibility`, data)
    return {
      message: response.data.message || 'Visibility updated successfully'
    }
  }

  // Delete Report
  async deleteReport(reportId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/reports/${reportId}`)
    return {
      message: response.data.message || 'Report deleted successfully'
    }
  }

  // Download Report
  async downloadReport(reportId: string): Promise<Blob> {
    const response = await axiosInstance.get(`/api/reports/${reportId}/download`, {
      responseType: 'blob'
    })
    return response.data
  }

  // Search Reports - NEW: Implemented
  async searchReports(params: SearchReportsRequest = {}): Promise<SearchReportsResponse> {
    const queryParams = new URLSearchParams()

    if (params.query) queryParams.append('query', params.query)
    if (params.companyId) queryParams.append('companyId', params.companyId)
    if (params.year) queryParams.append('year', params.year.toString())
    if (params.period) queryParams.append('period', params.period)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const response = await axiosInstance.get(`/api/reports/search?${queryParams.toString()}`)
    return response.data
  }

  // Get Report Metrics (Not developed)
  async getReportMetrics(reportId: string): Promise<unknown> {
    console.log('Get report metrics called for:', reportId)
    throw new Error('Tính năng chưa được phát triển')
  }

  // Get Report Categories (Public)
  async getReportCategories(): Promise<GetReportCategoriesResponse> {
    const response = await axiosInstance.get('/api/report-categories')
    return response.data
  }
}

export default new ReportsService()
