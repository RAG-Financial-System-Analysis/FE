import axiosInstance from '@/lib/axios'
import type {
  GetUsersRequest,
  GetUsersResponse,
  UserDetail,
  UpdateUserRequest,
  SystemStatistics,
  GetAuditLogsRequest,
  GetAuditLogsResponse,
  CreateReportCategoryRequest,
  UpdateReportCategoryRequest,
  GetReportCategoriesResponse,
  CreateAnalyticsTypeRequest,
  UpdateAnalyticsTypeRequest,
  GetAnalyticsTypesResponse
} from '@/types/admin.types'

class AdminService {
  // User Management
  async getUsers(params: GetUsersRequest = {}): Promise<GetUsersResponse> {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.roleId) queryParams.append('roleId', params.roleId)

    const response = await axiosInstance.get(`/api/admin/users?${queryParams.toString()}`)
    return {
      users: response.data.data || [],
      totalCount: response.data.total || 0
    }
  }

  async getUserDetail(userId: string): Promise<UserDetail> {
    const response = await axiosInstance.get(`/api/admin/users/${userId}`)
    return response.data
  }

  async updateUser(userId: string, data: UpdateUserRequest): Promise<{ message: string }> {
    const response = await axiosInstance.put(`/api/admin/users/${userId}`, data)
    return {
      message: response.data.message || 'User updated successfully'
    }
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/admin/users/${userId}`)
    return {
      message: response.data.message || 'User deleted successfully'
    }
  }

  // System Statistics
  async getSystemStatistics(): Promise<SystemStatistics> {
    const response = await axiosInstance.get('/api/admin/statistics')

    // Transform API response to match SystemStatistics interface
    const apiData = response.data

    // Map user role data from byRole structure to direct fields
    const transformedStats: SystemStatistics = {
      users: {
        total: apiData.users?.total || 0,
        active: apiData.users?.active || 0,
        admins: apiData.users?.byRole?.Admin || 0,
        analysts: apiData.users?.byRole?.Analyst || 0
      },
      reports: {
        total: apiData.reports?.total || 0,
        thisMonth: 0, // Not available from API, using default
        public: apiData.reports?.public || 0,
        private: apiData.reports?.private || 0
      },
      chatSessions: {
        total: apiData.chatSessions?.total || 0,
        thisMonth: apiData.chatSessions?.activeToday || 0, // Use activeToday as approximation
        averageMessagesPerSession: 0 // Not available from API, using default
      },
      analytics: {
        reportsGenerated: 0, // Not available from API, using default
        thisMonth: 0 // Not available from API, using default
      },
      storage: {
        totalSizeGB: apiData.storage?.totalSizeGB || 0,
        averageFileSizeMB:
          apiData.storage?.filesCount > 0
            ? ((apiData.storage?.totalSizeGB || 0) * 1024) / apiData.storage.filesCount
            : 0 // Calculate from available data
      }
    }

    return transformedStats
  }

  // Audit Logs
  async getAuditLogs(params: GetAuditLogsRequest = {}): Promise<GetAuditLogsResponse> {
    // API 5 - Not development
    console.log('Get audit logs called with params:', params)
    throw new Error('Tính năng chưa được phát triển')
  }

  // Report Categories Management
  async getReportCategories(page = 1, pageSize = 10): Promise<GetReportCategoriesResponse> {
    const response = await axiosInstance.get(`/api/admin/report-categories?page=${page}&pageSize=${pageSize}`)
    return {
      categories: response.data.data || [],
      totalCount: response.data.total || 0
    }
  }

  async createReportCategory(data: CreateReportCategoryRequest): Promise<{ id: string; message: string }> {
    const response = await axiosInstance.post('/api/admin/report-categories', data)
    return {
      id: response.data.id,
      message: response.data.message || 'Report category created successfully'
    }
  }

  async updateReportCategory(categoryId: string, data: UpdateReportCategoryRequest): Promise<{ message: string }> {
    const response = await axiosInstance.put(`/api/admin/report-categories/${categoryId}`, data)
    return {
      message: response.data.message || 'Report category updated successfully'
    }
  }

  async deleteReportCategory(categoryId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/admin/report-categories/${categoryId}`)
    return {
      message: response.data.message || 'Report category deleted successfully'
    }
  }

  // Analytics Types Management
  async getAnalyticsTypes(): Promise<GetAnalyticsTypesResponse> {
    const response = await axiosInstance.get('/api/analytics/types')
    return {
      analyticsTypes: response.data.analyticTypes || [],
      totalCount: response.data.analyticTypes?.length || 0
    }
  }

  async createAnalyticsType(data: CreateAnalyticsTypeRequest): Promise<{ id: string; message: string }> {
    const response = await axiosInstance.post('/api/admin/analytics-types', data)
    return {
      id: response.data.id,
      message: response.data.message || 'Analytics type created successfully'
    }
  }

  async updateAnalyticsType(typeId: string, data: UpdateAnalyticsTypeRequest): Promise<{ message: string }> {
    const response = await axiosInstance.put(`/api/admin/analytics-types/${typeId}`, data)
    return {
      message: response.data.message || 'Analytics type updated successfully'
    }
  }

  async deleteAnalyticsType(typeId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/admin/analytics-types/${typeId}`)
    return {
      message: response.data.message || 'Analytics type deleted successfully'
    }
  }

  // S3 Test Methods
  async testS3Upload(file: File): Promise<{ success: boolean; message: string; data?: any }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post('/api/test/s3-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return {
      success: response.data.success || false,
      message: response.data.message || 'S3 upload test completed',
      data: response.data
    }
  }

  async getS3Info(): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await axiosInstance.get('/api/test/s3-info')

    return {
      success: true, // Assume success if no error thrown
      message: response.data.message || 'S3 info retrieved',
      data: response.data
    }
  }
}

export default new AdminService()
