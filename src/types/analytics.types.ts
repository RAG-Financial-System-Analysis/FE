// Analytics related types

/**
 * Analytics type definition
 */
export interface AnalyticsType {
  id: string
  code: string
  name: string
  description?: string
  createdAt: string
}

/**
 * Request to create an analytics type
 */
export interface CreateAnalyticsTypeRequest {
  code: string
  name: string
  description?: string
}

/**
 * Request to update an analytics type
 */
export interface UpdateAnalyticsTypeRequest {
  code: string
  name: string
  description?: string
}

/**
 * Response containing analytics types
 */
export interface GetAnalyticsTypesResponse {
  analyticsTypes: AnalyticsType[]
  totalCount: number
}

export interface GenerateAnalyticsReportRequest {
  sessionId: string
  title: string
}

export interface GenerateAnalyticsReportResponse {
  reportId: string
  message: string
  fileUrl: string
}

export interface GetAnalyticsReportsRequest {
  sessionId?: string
  page?: number
  pageSize?: number
}

export interface AnalyticsReport {
  id: string
  title: string
  sessionId: string
  fileUrl: string
  generationType: string
  createdAt: string
}

export interface GetAnalyticsReportsResponse {
  total: number
  page: number
  pageSize: number
  data: AnalyticsReport[]
}

export interface AnalyticsReportDetail {
  id: string
  title: string
  sessionId: string
  generatedContent: string
  fileUrl: string
  generationType: string
  generatedBy: {
    id: string
    fullName: string
  }
  createdAt: string
}
