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

/**
 * Reports API module - Pure API communication with no business logic
 */
export const reportsApi = {
  getMyReports: (params: GetReportsRequest) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    return axiosInstance.get<GetReportsResponse>(`/api/reports/my-reports?${queryParams.toString()}`)
  },

  getPublicReports: (params: GetReportsRequest) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    return axiosInstance.get<GetReportsResponse>(`/api/reports/public-reports?${queryParams.toString()}`)
  },

  getReportDetail: (reportId: string) => axiosInstance.get<ReportDetail>(`/api/reports/${reportId}`),

  uploadReport: (data: UploadReportRequest) => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('companyId', data.companyId)
    formData.append('categoryId', data.categoryId)
    formData.append('year', data.year.toString())
    formData.append('period', data.period)
    formData.append('visibility', data.visibility)
    return axiosInstance.post<UploadReportResponse>('/api/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 25000
    })
  },

  uploadReportAsync: (data: UploadReportRequest) => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('companyId', data.companyId)
    formData.append('categoryId', data.categoryId)
    formData.append('year', data.year.toString())
    formData.append('period', data.period)
    formData.append('visibility', data.visibility)
    return axiosInstance.post<UploadReportAsyncResponse>('/api/reports/upload-async', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 25000
    })
  },

  updateVisibility: (reportId: string, data: UpdateVisibilityRequest) =>
    axiosInstance.patch<{ message: string }>(`/api/reports/${reportId}/visibility`, data),

  deleteReport: (reportId: string) => axiosInstance.delete<{ message: string }>(`/api/reports/${reportId}`),

  downloadReport: (reportId: string) =>
    axiosInstance.get<Blob>(`/api/reports/${reportId}/download`, {
      responseType: 'blob'
    }),

  searchReports: (params: SearchReportsRequest) => {
    const queryParams = new URLSearchParams()
    if (params.query) queryParams.append('query', params.query)
    if (params.companyId) queryParams.append('companyId', params.companyId)
    if (params.year) queryParams.append('year', params.year.toString())
    if (params.period) queryParams.append('period', params.period)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    return axiosInstance.get<SearchReportsResponse>(`/api/reports/search?${queryParams.toString()}`)
  },

  getReportCategories: () => axiosInstance.get<GetReportCategoriesResponse>('/api/report-categories')
}
