// Reports related types

export interface Report {
  id: string
  companyName: string
  ticker: string
  categoryName: string
  year: number
  period: string
  visibility: 'private' | 'public'
  fileName: string
  fileSizeKb: number
  createdAt: string
}

export interface ReportDetail {
  id: string
  company: {
    id: string
    ticker: string
    name: string
  }
  categoryName: string
  year: number
  period: string
  fileUrl: string
  fileName: string
  fileSizeKb: number
  visibility: 'private' | 'public'
  uploadedBy: {
    id: string
    fullName: string
  }
  createdAt: string
  metrics: ReportMetric[]
}

export interface ReportMetric {
  code: string
  name: string
  value: number
  unit: string
  group?: string
}

export interface GetReportsRequest {
  page?: number
  pageSize?: number
}

export interface GetReportsResponse {
  data: Report[]
  total: number
  page: number
  pageSize: number
}

export interface UploadReportRequest {
  file: File
  companyId: string
  categoryId: string
  year: number
  period: string
  visibility: 'private' | 'public'
}

export interface UploadReportResponse {
  reportId: string
  message: string
  metricsExtracted: number
  pageCount: number
  pdfType: string
  metrics: ReportMetric[]
}

export interface UpdateVisibilityRequest {
  visibility: 'private' | 'public'
}

// Report Categories (Public)
export interface ReportCategory {
  id: string
  name: string
  description: string
}

export interface GetReportCategoriesResponse {
  categories: ReportCategory[]
}
