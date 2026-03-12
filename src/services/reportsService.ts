import axiosInstance from '@/lib/axios'
import type {
  GetReportsRequest,
  GetReportsResponse,
  ReportDetail,
  UploadReportRequest,
  UploadReportResponse,
  UpdateVisibilityRequest,
  GetReportCategoriesResponse
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

  // Upload Report
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
      timeout: 600000 // 10 minutes for file upload
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

  // Search Reports (Not developed)
  async searchReports(query: string, companyId?: string, year?: number, period?: string): Promise<unknown> {
    console.log('Search reports called with:', { query, companyId, year, period })
    throw new Error('Tính năng chưa được phát triển')
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
