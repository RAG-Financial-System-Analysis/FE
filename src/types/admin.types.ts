// Admin related types

export interface User {
  id: string
  email: string
  fullName: string
  role: string
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
}

export interface UserDetail extends User {
  statistics: {
    reportsUploaded: number
    chatSessions: number
    analyticsGenerated: number
  }
}

export interface GetUsersRequest {
  page?: number
  pageSize?: number
  roleId?: string
}

export interface GetUsersResponse {
  users: User[]
  totalCount: number
}

export interface UpdateUserRequest {
  fullName: string
  role: string
  isActive: boolean
}

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

export interface GetAuditLogsRequest {
  userId?: string
  action?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export interface GetAuditLogsResponse {
  logs: AuditLog[]
  totalCount: number
}

export interface ReportCategory {
  id: string
  name: string
  description: string
  createdAt: string
  associatedReportsCount?: number
  associatedReports?: AssociatedReport[]
}

export interface AssociatedReport {
  id: string
  title: string
  companyName: string
  createdAt: string
}

export interface CreateReportCategoryRequest {
  name: string
  description: string
}

export interface UpdateReportCategoryRequest {
  name: string
  description: string
}

export interface GetReportCategoriesResponse {
  categories: ReportCategory[]
  totalCount: number
}

// Analytics Types interfaces
export interface AnalyticsType {
  id: string
  code: string
  name: string
  description?: string
  createdAt: string
}

export interface CreateAnalyticsTypeRequest {
  code: string
  name: string
  description?: string
}

export interface UpdateAnalyticsTypeRequest {
  code: string
  name: string
  description?: string
}

export interface GetAnalyticsTypesResponse {
  analyticsTypes: AnalyticsType[]
  totalCount: number
}
