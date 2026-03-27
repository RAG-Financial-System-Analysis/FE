/**
 * Admin management types
 */

/**
 * User entity with basic information
 */
export interface User {
  id: string
  email: string
  fullName: string
  role: string
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
}

/**
 * User with detailed statistics
 */
export interface UserDetail extends User {
  statistics: {
    reportsUploaded: number
    chatSessions: number
    analyticsGenerated: number
  }
}

/**
 * Request to get users with pagination and filtering
 */
export interface GetUsersRequest {
  page?: number
  pageSize?: number
  roleId?: string
}

/**
 * Response containing paginated users
 */
export interface GetUsersResponse {
  users: User[]
  totalCount: number
}

/**
 * Request to update user information
 */
export interface UpdateUserRequest {
  fullName: string
  role: string
  isActive: boolean
}

/**
 * System-wide statistics
 */
export interface SystemStatistics {
  users: {
    total: number
    active: number
    admins: number
    analysts: number
  }
  reports: {
    total: number
    thisMonth: number
    public: number
    private: number
  }
  chatSessions: {
    total: number
    thisMonth: number
    averageMessagesPerSession: number
  }
  analytics: {
    reportsGenerated: number
    thisMonth: number
  }
  storage: {
    totalSizeGB: number
    averageFileSizeMB: number
  }
}

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  details: string
  ipAddress: string
  userAgent: string
  timestamp: string
}

/**
 * Request to get audit logs with filtering
 */
export interface GetAuditLogsRequest {
  userId?: string
  action?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

/**
 * Response containing paginated audit logs
 */
export interface GetAuditLogsResponse {
  logs: AuditLog[]
  totalCount: number
}
