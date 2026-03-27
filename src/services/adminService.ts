import { adminApi } from './api'
import type {
  GetUsersRequest,
  GetUsersResponse,
  UserDetail,
  UpdateUserRequest,
  SystemStatistics,
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
 * Admin Service - Business logic and data transformation
 *
 * Handles all admin-related operations including user management, system statistics,
 * report categories, analytics types, and S3 configuration testing.
 *
 * @class AdminService
 * @example
 * ```typescript
 * import { adminService } from '@/services'
 *
 * // Get users with pagination
 * const users = await adminService.getUsers({ page: 1, pageSize: 10 })
 *
 * // Get system statistics
 * const stats = await adminService.getSystemStatistics()
 * ```
 */
class AdminService {
  /**
   * Get users with pagination and optional filtering
   *
   * @param {GetUsersRequest} [params={}] - Pagination and filter parameters
   * @param {number} [params.page] - Page number (1-indexed)
   * @param {number} [params.pageSize] - Number of items per page
   * @param {string} [params.roleId] - Filter by role ID
   * @returns {Promise<GetUsersResponse>} Paginated list of users
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await adminService.getUsers({ page: 1, pageSize: 20 })
   * console.log(response.users) // User[]
   * console.log(response.totalCount) // number
   * ```
   */
  async getUsers(params: GetUsersRequest = {}): Promise<GetUsersResponse> {
    const response = await adminApi.getUsers(params)
    return {
      users: response.data.users || [],
      totalCount: response.data.totalCount || 0
    }
  }

  /**
   * Get detailed user information by ID
   *
   * @param {string} userId - The user ID to fetch
   * @returns {Promise<UserDetail>} User details including statistics
   * @throws {Error} If user not found or API request fails
   *
   * @example
   * ```typescript
   * const user = await adminService.getUserDetail('user-123')
   * console.log(user.statistics.reportsUploaded)
   * ```
   */
  async getUserDetail(userId: string): Promise<UserDetail> {
    const response = await adminApi.getUserDetail(userId)
    return response.data
  }

  /**
   * Update user information
   *
   * @param {string} userId - The user ID to update
   * @param {UpdateUserRequest} data - User data to update
   * @param {string} data.fullName - User's full name
   * @param {string} data.role - User's role
   * @param {boolean} data.isActive - Whether user is active
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If user not found or API request fails
   *
   * @example
   * ```typescript
   * await adminService.updateUser('user-123', {
   *   fullName: 'John Doe',
   *   role: 'Analyst',
   *   isActive: true
   * })
   * ```
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<{ message: string }> {
    const response = await adminApi.updateUser(userId, data)
    return {
      message: response.data.message || 'User updated successfully'
    }
  }

  /**
   * Delete a user by ID
   *
   * @param {string} userId - The user ID to delete
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If user not found or API request fails
   *
   * @example
   * ```typescript
   * await adminService.deleteUser('user-123')
   * ```
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await adminApi.deleteUser(userId)
    return {
      message: response.data.message || 'User deleted successfully'
    }
  }

  /**
   * Get system-wide statistics
   *
   * Retrieves aggregated statistics about users, reports, chat sessions,
   * analytics, and storage usage across the entire system.
   *
   * @returns {Promise<SystemStatistics>} System statistics object
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const stats = await adminService.getSystemStatistics()
   * console.log(stats.users.total) // Total users
   * console.log(stats.reports.thisMonth) // Reports this month
   * console.log(stats.storage.totalSizeGB) // Total storage used
   * ```
   */
  async getSystemStatistics(): Promise<SystemStatistics> {
    const response = await adminApi.getSystemStatistics()

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

  /**
   * Get audit logs with filtering
   *
   * ⚠️ **Not yet implemented** - This feature is under development
   *
   * @param {GetAuditLogsRequest} [params={}] - Filter and pagination parameters
   * @returns {Promise<GetAuditLogsResponse>} Paginated audit logs
   * @throws {Error} Always throws - feature not yet implemented
   *
   * @deprecated This feature is not yet available
   */
  async getAuditLogs(params: GetAuditLogsRequest = {}): Promise<GetAuditLogsResponse> {
    // API 5 - Not development
    console.log('Get audit logs called with params:', params)
    throw new Error('Tính năng chưa được phát triển')
  }

  /**
   * Get report categories with pagination
   *
   * @param {number} [page=1] - Page number (1-indexed)
   * @param {number} [pageSize=10] - Number of items per page
   * @returns {Promise<GetReportCategoriesResponse>} Paginated report categories
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const categories = await adminService.getReportCategories(1, 20)
   * ```
   */
  async getReportCategories(page = 1, pageSize = 10): Promise<GetReportCategoriesResponse> {
    const response = await adminApi.getReportCategories(page, pageSize)
    return {
      categories: response.data.categories || [],
      totalCount: response.data.totalCount || 0
    }
  }

  /**
   * Create a new report category
   *
   * @param {CreateReportCategoryRequest} data - Category data
   * @param {string} data.name - Category name
   * @param {string} data.description - Category description
   * @returns {Promise<{ id: string; message: string }>} Created category ID and message
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const result = await adminService.createReportCategory({
   *   name: 'Financial Reports',
   *   description: 'Annual financial reports'
   * })
   * ```
   */
  async createReportCategory(data: CreateReportCategoryRequest): Promise<{ id: string; message: string }> {
    const response = await adminApi.createReportCategory(data)
    return {
      id: response.data.id,
      message: response.data.message || 'Report category created successfully'
    }
  }

  /**
   * Update an existing report category
   *
   * @param {string} categoryId - The category ID to update
   * @param {UpdateReportCategoryRequest} data - Updated category data
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If category not found or API request fails
   *
   * @example
   * ```typescript
   * await adminService.updateReportCategory('cat-123', {
   *   name: 'Updated Name',
   *   description: 'Updated description'
   * })
   * ```
   */
  async updateReportCategory(categoryId: string, data: UpdateReportCategoryRequest): Promise<{ message: string }> {
    const response = await adminApi.updateReportCategory(categoryId, data)
    return {
      message: response.data.message || 'Report category updated successfully'
    }
  }

  /**
   * Delete a report category
   *
   * @param {string} categoryId - The category ID to delete
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If category not found or API request fails
   *
   * @example
   * ```typescript
   * await adminService.deleteReportCategory('cat-123')
   * ```
   */
  async deleteReportCategory(categoryId: string): Promise<{ message: string }> {
    const response = await adminApi.deleteReportCategory(categoryId)
    return {
      message: response.data.message || 'Report category deleted successfully'
    }
  }

  /**
   * Get all analytics types
   *
   * @returns {Promise<GetAnalyticsTypesResponse>} List of analytics types
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const types = await adminService.getAnalyticsTypes()
   * ```
   */
  async getAnalyticsTypes(): Promise<GetAnalyticsTypesResponse> {
    const response = await adminApi.getAnalyticsTypes()
    return {
      analyticsTypes: response.data.analyticsTypes || [],
      totalCount: response.data.totalCount || 0
    }
  }

  /**
   * Create a new analytics type
   *
   * @param {CreateAnalyticsTypeRequest} data - Analytics type data
   * @param {string} data.code - Unique code for the analytics type
   * @param {string} data.name - Display name
   * @param {string} [data.description] - Optional description
   * @returns {Promise<{ id: string; message: string }>} Created type ID and message
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const result = await adminService.createAnalyticsType({
   *   code: 'FINANCIAL_ANALYSIS',
   *   name: 'Financial Analysis',
   *   description: 'Analyze financial metrics'
   * })
   * ```
   */
  async createAnalyticsType(data: CreateAnalyticsTypeRequest): Promise<{ id: string; message: string }> {
    const response = await adminApi.createAnalyticsType(data)
    return {
      id: response.data.id,
      message: response.data.message || 'Analytics type created successfully'
    }
  }

  /**
   * Update an existing analytics type
   *
   * @param {string} typeId - The analytics type ID to update
   * @param {UpdateAnalyticsTypeRequest} data - Updated type data
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If type not found or API request fails
   *
   * @example
   * ```typescript
   * await adminService.updateAnalyticsType('type-123', {
   *   code: 'UPDATED_CODE',
   *   name: 'Updated Name'
   * })
   * ```
   */
  async updateAnalyticsType(typeId: string, data: UpdateAnalyticsTypeRequest): Promise<{ message: string }> {
    const response = await adminApi.updateAnalyticsType(typeId, data)
    return {
      message: response.data.message || 'Analytics type updated successfully'
    }
  }

  /**
   * Delete an analytics type
   *
   * @param {string} typeId - The analytics type ID to delete
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If type not found or API request fails
   *
   * @example
   * ```typescript
   * await adminService.deleteAnalyticsType('type-123')
   * ```
   */
  async deleteAnalyticsType(typeId: string): Promise<{ message: string }> {
    const response = await adminApi.deleteAnalyticsType(typeId)
    return {
      message: response.data.message || 'Analytics type deleted successfully'
    }
  }

  /**
   * Test S3 upload functionality
   *
   * Uploads a test file to S3 to verify configuration and connectivity.
   *
   * @param {File} file - The file to upload for testing
   * @returns {Promise<{ success: boolean; message: string; data?: Record<string, unknown> }>} Test result
   * @throws {Error} If S3 connection fails
   *
   * @example
   * ```typescript
   * const file = new File(['test'], 'test.txt')
   * const result = await adminService.testS3Upload(file)
   * if (result.success) console.log('S3 is configured correctly')
   * ```
   */
  async testS3Upload(file: File): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
    const response = await adminApi.testS3Upload(file)

    return {
      success: response.data.success || false,
      message: response.data.message || 'S3 upload test completed',
      data: response.data
    }
  }

  /**
   * Get S3 configuration information
   *
   * Retrieves current S3 configuration details for debugging and verification.
   *
   * @returns {Promise<{ success: boolean; message: string; data?: Record<string, unknown> }>} S3 info
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const info = await adminService.getS3Info()
   * console.log(info.data) // S3 configuration details
   * ```
   */
  async getS3Info(): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
    const response = await adminApi.getS3Info()

    return {
      success: true, // Assume success if no error thrown
      message: response.data.message || 'S3 info retrieved',
      data: response.data
    }
  }
}

export const adminService = new AdminService()
