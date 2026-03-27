import axiosInstance from '@/lib/axios'
import type {
  GetUsersRequest,
  GetUsersResponse,
  UserDetail,
  UpdateUserRequest,
  GetAuditLogsRequest,
  GetAuditLogsResponse
} from '@/types/admin.types'
import type {
  CreateReportCategoryRequest,
  UpdateReportCategoryRequest,
  GetReportCategoriesResponse
} from '@/types/reports.types'
import type {
  CreateAnalyticsTypeRequest,
  UpdateAnalyticsTypeRequest,
  GetAnalyticsTypesResponse
} from '@/types/analytics.types'

/**
 * Admin API module - Pure API communication with no business logic
 */
export const adminApi = {
  // User Management
  getUsers: (params: GetUsersRequest) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.roleId) queryParams.append('roleId', params.roleId)
    return axiosInstance.get<GetUsersResponse>(`/api/admin/users?${queryParams.toString()}`)
  },

  getUserDetail: (userId: string) => axiosInstance.get<UserDetail>(`/api/admin/users/${userId}`),

  updateUser: (userId: string, data: UpdateUserRequest) =>
    axiosInstance.put<{ message: string }>(`/api/admin/users/${userId}`, data),

  deleteUser: (userId: string) => axiosInstance.delete<{ message: string }>(`/api/admin/users/${userId}`),

  // System Statistics
  getSystemStatistics: () => axiosInstance.get('/api/admin/statistics'),

  // Audit Logs
  getAuditLogs: (params: GetAuditLogsRequest) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    return axiosInstance.get<GetAuditLogsResponse>(`/api/admin/audit-logs?${queryParams.toString()}`)
  },

  // Report Categories Management
  getReportCategories: (page: number, pageSize: number) =>
    axiosInstance.get<GetReportCategoriesResponse>(`/api/admin/report-categories?page=${page}&pageSize=${pageSize}`),

  createReportCategory: (data: CreateReportCategoryRequest) =>
    axiosInstance.post<{ id: string; message: string }>('/api/admin/report-categories', data),

  updateReportCategory: (categoryId: string, data: UpdateReportCategoryRequest) =>
    axiosInstance.put<{ message: string }>(`/api/admin/report-categories/${categoryId}`, data),

  deleteReportCategory: (categoryId: string) =>
    axiosInstance.delete<{ message: string }>(`/api/admin/report-categories/${categoryId}`),

  // Analytics Types Management
  getAnalyticsTypes: () => axiosInstance.get<GetAnalyticsTypesResponse>('/api/analytics/types'),

  createAnalyticsType: (data: CreateAnalyticsTypeRequest) =>
    axiosInstance.post<{ id: string; message: string }>('/api/admin/analytics-types', data),

  updateAnalyticsType: (typeId: string, data: UpdateAnalyticsTypeRequest) =>
    axiosInstance.put<{ message: string }>(`/api/admin/analytics-types/${typeId}`, data),

  deleteAnalyticsType: (typeId: string) =>
    axiosInstance.delete<{ message: string }>(`/api/admin/analytics-types/${typeId}`),

  // S3 Test Methods
  testS3Upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post<{ success: boolean; message: string; data?: Record<string, unknown> }>(
      '/api/test/s3-upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },

  getS3Info: () =>
    axiosInstance.get<{ success: boolean; message: string; data?: Record<string, unknown> }>('/api/test/s3-info')
}
