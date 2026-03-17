// Analytics related types
export interface AnalyticsType {
  id: string
  name: string
  code: string
  description: string
}

export interface GetAnalyticsTypesResponse {
  analyticTypes: AnalyticsType[] // Note: "analyticTypes" to match backend
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
