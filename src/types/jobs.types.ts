// Jobs Module Types

export interface JobStatus {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  errorMessage: string | null
  createdAt: string
  updatedAt: string
  result: unknown | null
}

export interface JobResult {
  jobId: string
  status: 'completed' | 'failed'
  result: unknown | null
}

// Job result types for different job types
export interface UploadJobResult {
  reportId: string
  message: string
  metricsExtracted: number
  pageCount: number
  pdfType: string
  metrics: Array<{
    code: string
    name: string
    value: number
    unit: string
  }>
}

export interface ChatJobResult {
  promptId: string
  responseText: string
  citations: unknown[]
  retrievalCount: number
}

export interface AnalyticsJobResult {
  reportId: string
  message: string
  fileUrl: string
}
