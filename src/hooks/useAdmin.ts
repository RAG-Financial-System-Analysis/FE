import { useState, useCallback } from 'react'
import adminService from '@/services/adminService'
import type {
  User,
  UserDetail,
  GetUsersRequest,
  UpdateUserRequest,
  SystemStatistics,
  GetAuditLogsRequest,
  AuditLog,
  ReportCategory,
  CreateReportCategoryRequest,
  UpdateReportCategoryRequest,
  AnalyticsType,
  CreateAnalyticsTypeRequest,
  UpdateAnalyticsTypeRequest
} from '@/types/admin.types'

interface UseAdminReturn {
  // State
  users: User[]
  currentUser: UserDetail | null
  auditLogs: AuditLog[]
  reportCategories: ReportCategory[]
  analyticsTypes: AnalyticsType[]
  systemStats: SystemStatistics | null
  isLoading: boolean
  error: string | null
  totalUsers: number
  totalLogs: number
  totalCategories: number
  totalAnalyticsTypes: number

  // Actions
  loadUsers: (params?: GetUsersRequest) => Promise<{ success: boolean; message: string }>
  loadUserDetail: (userId: string) => Promise<{ success: boolean; message: string }>
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<{ success: boolean; message: string }>
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>
  loadSystemStats: () => Promise<{ success: boolean; message: string }>
  loadAuditLogs: (params?: GetAuditLogsRequest) => Promise<{ success: boolean; message: string }>
  loadReportCategories: (page?: number, pageSize?: number) => Promise<{ success: boolean; message: string }>
  createReportCategory: (data: CreateReportCategoryRequest) => Promise<{ success: boolean; message: string }>
  updateReportCategory: (
    categoryId: string,
    data: UpdateReportCategoryRequest
  ) => Promise<{ success: boolean; message: string }>
  deleteReportCategory: (categoryId: string) => Promise<{ success: boolean; message: string }>
  loadAnalyticsTypes: () => Promise<{ success: boolean; message: string }>
  createAnalyticsType: (data: CreateAnalyticsTypeRequest) => Promise<{ success: boolean; message: string }>
  updateAnalyticsType: (
    typeId: string,
    data: UpdateAnalyticsTypeRequest
  ) => Promise<{ success: boolean; message: string }>
  deleteAnalyticsType: (typeId: string) => Promise<{ success: boolean; message: string }>
  clearError: () => void
  setError: (message: string) => void
}

export const useAdmin = (): UseAdminReturn => {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [reportCategories, setReportCategories] = useState<ReportCategory[]>([])
  const [analyticsTypes, setAnalyticsTypes] = useState<AnalyticsType[]>([])
  const [systemStats, setSystemStats] = useState<SystemStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalLogs, setTotalLogs] = useState(0)
  const [totalCategories, setTotalCategories] = useState(0)
  const [totalAnalyticsTypes, setTotalAnalyticsTypes] = useState(0)

  const clearError = useCallback(() => setError(null), [])
  const setErrorMessage = useCallback((message: string) => setError(message), [])

  const loadUsers = useCallback(async (params: GetUsersRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.getUsers(params)
      setUsers(response.users)
      setTotalUsers(response.totalCount)

      return {
        success: true,
        message: `Loaded ${response.users.length} users successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load users'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadUserDetail = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const userDetail = await adminService.getUserDetail(userId)
      setCurrentUser(userDetail)

      return {
        success: true,
        message: 'User detail loaded successfully'
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load user detail'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (userId: string, data: UpdateUserRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.updateUser(userId, data)

      // Update user in the list
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, fullName: data.fullName, role: data.role, isActive: data.isActive } : user
        )
      )

      return {
        success: true,
        message: response.message
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update user'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.deleteUser(userId)

      // Remove user from the list
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      setTotalUsers((prev) => prev - 1)

      return {
        success: true,
        message: response.message
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete user'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadSystemStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const stats = await adminService.getSystemStatistics()
      setSystemStats(stats)

      return {
        success: true,
        message: 'System statistics loaded successfully'
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load system statistics'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadAuditLogs = useCallback(async (params: GetAuditLogsRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.getAuditLogs(params)
      setAuditLogs(response.logs)
      setTotalLogs(response.totalCount)

      return {
        success: true,
        message: `Loaded ${response.logs.length} audit logs successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load audit logs'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadReportCategories = useCallback(async (page = 1, pageSize = 10) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.getReportCategories(page, pageSize)
      setReportCategories(response.categories)
      setTotalCategories(response.totalCount)

      return {
        success: true,
        message: `Loaded ${response.categories.length} report categories successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load report categories'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createReportCategory = useCallback(
    async (data: CreateReportCategoryRequest) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await adminService.createReportCategory(data)

        // Reload categories to get the new one
        await loadReportCategories()

        return {
          success: true,
          message: response.message
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to create report category'
        setError(errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    [loadReportCategories]
  )

  const updateReportCategory = useCallback(async (categoryId: string, data: UpdateReportCategoryRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.updateReportCategory(categoryId, data)

      // Update category in the list
      setReportCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId ? { ...category, name: data.name, description: data.description } : category
        )
      )

      return {
        success: true,
        message: response.message
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update report category'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteReportCategory = useCallback(async (categoryId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.deleteReportCategory(categoryId)

      // Remove category from the list
      setReportCategories((prev) => prev.filter((category) => category.id !== categoryId))
      setTotalCategories((prev) => prev - 1)

      return {
        success: true,
        message: response.message
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to delete report category'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadAnalyticsTypes = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.getAnalyticsTypes()
      setAnalyticsTypes(response.analyticsTypes)
      setTotalAnalyticsTypes(response.totalCount)

      return {
        success: true,
        message: `Loaded ${response.analyticsTypes.length} analytics types successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load analytics types'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createAnalyticsType = useCallback(
    async (data: CreateAnalyticsTypeRequest) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await adminService.createAnalyticsType(data)

        // Reload analytics types to get the new one
        await loadAnalyticsTypes()

        return {
          success: true,
          message: response.message
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to create analytics type'
        setError(errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    [loadAnalyticsTypes]
  )

  const updateAnalyticsType = useCallback(async (typeId: string, data: UpdateAnalyticsTypeRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.updateAnalyticsType(typeId, data)

      // Update analytics type in the list
      setAnalyticsTypes((prev) =>
        prev.map((type) =>
          type.id === typeId ? { ...type, code: data.code, name: data.name, description: data.description } : type
        )
      )

      return {
        success: true,
        message: response.message
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update analytics type'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteAnalyticsType = useCallback(async (typeId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await adminService.deleteAnalyticsType(typeId)

      // Remove analytics type from the list
      setAnalyticsTypes((prev) => prev.filter((type) => type.id !== typeId))
      setTotalAnalyticsTypes((prev) => prev - 1)

      return {
        success: true,
        message: response.message
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to delete analytics type'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    // State
    users,
    currentUser,
    auditLogs,
    reportCategories,
    analyticsTypes,
    systemStats,
    isLoading,
    error,
    totalUsers,
    totalLogs,
    totalCategories,
    totalAnalyticsTypes,

    // Actions
    loadUsers,
    loadUserDetail,
    updateUser,
    deleteUser,
    loadSystemStats,
    loadAuditLogs,
    loadReportCategories,
    createReportCategory,
    updateReportCategory,
    deleteReportCategory,
    loadAnalyticsTypes,
    createAnalyticsType,
    updateAnalyticsType,
    deleteAnalyticsType,
    clearError,
    setError: setErrorMessage
  }
}
