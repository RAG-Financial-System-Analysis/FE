import { useState, useCallback } from 'react'
import { reportsService } from '@/services/reportsService'
import { backgroundJobService } from '@/services/backgroundJobService'
import type {
  Report,
  ReportDetail,
  GetReportsRequest,
  UploadReportRequest,
  UpdateVisibilityRequest,
  ReportCategory,
  SearchReportsRequest,
  SearchReportsResponse
} from '@/types/reports.types'

interface UseReportsReturn {
  // State
  reports: Report[] // Alias for myReports for backward compatibility
  myReports: Report[]
  publicReports: Report[]
  currentReport: ReportDetail | null
  reportCategories: ReportCategory[]
  isLoading: boolean
  error: string | null
  totalMyReports: number
  totalPublicReports: number
  uploadProgress: number

  // Actions
  loadMyReports: (params?: GetReportsRequest) => Promise<{ success: boolean; message: string }>
  loadPublicReports: (params?: GetReportsRequest) => Promise<{ success: boolean; message: string }>
  loadReportDetail: (reportId: string) => Promise<{ success: boolean; message: string }>
  uploadReport: (data: UploadReportRequest) => Promise<{ success: boolean; message: string; reportId?: string }>
  uploadReportAsync: (
    data: UploadReportRequest,
    onProgress?: (progress: number) => void
  ) => Promise<{ success: boolean; message: string; reportId?: string; backgroundJobId?: string }>
  searchReports: (
    params?: SearchReportsRequest
  ) => Promise<{ success: boolean; message: string; data?: SearchReportsResponse }>
  updateVisibility: (reportId: string, data: UpdateVisibilityRequest) => Promise<{ success: boolean; message: string }>
  deleteReport: (reportId: string) => Promise<{ success: boolean; message: string }>
  downloadReport: (reportId: string, fileName: string) => Promise<{ success: boolean; message: string }>
  loadReportCategories: () => Promise<{ success: boolean; message: string }>
  clearError: () => void
  setError: (message: string) => void
}

export const useReports = (): UseReportsReturn => {
  const [myReports, setMyReports] = useState<Report[]>([])
  const [publicReports, setPublicReports] = useState<Report[]>([])
  const [currentReport, setCurrentReport] = useState<ReportDetail | null>(null)
  const [reportCategories, setReportCategories] = useState<ReportCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalMyReports, setTotalMyReports] = useState(0)
  const [totalPublicReports, setTotalPublicReports] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)

  const clearError = useCallback(() => setError(null), [])
  const setErrorMessage = useCallback((message: string) => setError(message), [])

  const loadMyReports = useCallback(async (params: GetReportsRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reportsService.getMyReports(params)
      setMyReports(response.data)
      setTotalMyReports(response.total)

      return {
        success: true,
        message: `Loaded ${response.data.length} reports successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load my reports'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadPublicReports = useCallback(async (params: GetReportsRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reportsService.getPublicReports(params)
      setPublicReports(response.data)
      setTotalPublicReports(response.total)

      return {
        success: true,
        message: `Loaded ${response.data.length} public reports successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load public reports'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadReportDetail = useCallback(async (reportId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const reportDetail = await reportsService.getReportDetail(reportId)
      setCurrentReport(reportDetail)

      return {
        success: true,
        message: 'Report detail loaded successfully'
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load report detail'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Legacy upload method (synchronous) - DEPRECATED
  const uploadReport = useCallback(async (data: UploadReportRequest) => {
    setIsLoading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const response = await reportsService.uploadReport(data)

      return {
        success: true,
        message: response.message,
        reportId: response.reportId
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload report'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }, [])

  // New async upload method with background processing - RECOMMENDED
  const uploadReportAsync = useCallback(
    async (data: UploadReportRequest) => {
      setIsLoading(true)
      setError(null)
      setUploadProgress(0)

      try {
        // Step 1: Start async upload
        const asyncResponse = await reportsService.uploadReportAsync(data)

        // Step 2: Start background job (non-blocking)
        const backgroundJobId = backgroundJobService.startJob({
          type: 'upload',
          jobId: asyncResponse.jobId,
          fileName: data.file.name,
          onComplete: () => {
            // Refresh reports list when upload completes
            loadMyReports()
            loadPublicReports()
          },
          onError: (error) => {
            console.error('Background upload failed:', error)
          }
        })

        setIsLoading(false)
        setUploadProgress(0)

        return {
          success: true,
          message: `Upload started in background. You'll be notified when it's complete.`,
          reportId: undefined, // Will be available when job completes
          backgroundJobId
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Failed to start upload'
        setError(errorMessage)
        setIsLoading(false)
        setUploadProgress(0)
        return {
          success: false,
          message: errorMessage
        }
      }
    },
    [loadMyReports, loadPublicReports]
  )

  const updateVisibility = useCallback(
    async (reportId: string, data: UpdateVisibilityRequest) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await reportsService.updateVisibility(reportId, data)

        // Update report in both lists
        const updateReport = (report: Report) =>
          report.id === reportId ? { ...report, visibility: data.visibility } : report

        setMyReports((prev) => prev.map(updateReport))
        setPublicReports((prev) => prev.map(updateReport))

        if (currentReport && currentReport.id === reportId) {
          setCurrentReport((prev) => (prev ? { ...prev, visibility: data.visibility } : null))
        }

        return {
          success: true,
          message: response.message
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to update visibility'
        setError(errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    [currentReport]
  )

  const deleteReport = useCallback(
    async (reportId: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await reportsService.deleteReport(reportId)

        // Remove report from both lists
        setMyReports((prev) => prev.filter((report) => report.id !== reportId))
        setPublicReports((prev) => prev.filter((report) => report.id !== reportId))
        setTotalMyReports((prev) => prev - 1)

        if (currentReport && currentReport.id === reportId) {
          setCurrentReport(null)
        }

        return {
          success: true,
          message: response.message
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete report'
        setError(errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    [currentReport]
  )

  const downloadReport = useCallback(async (reportId: string, fileName: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const blob = await reportsService.downloadReport(reportId)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return {
        success: true,
        message: 'Report downloaded successfully'
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to download report'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchReports = useCallback(async (params: SearchReportsRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reportsService.searchReports(params)

      return {
        success: true,
        message: `Found ${response.total} reports`,
        data: response
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to search reports'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadReportCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reportsService.getReportCategories()
      setReportCategories(response.categories)

      return {
        success: true,
        message: `Loaded ${response.categories.length} categories successfully`
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

  return {
    // State
    reports: myReports, // Alias for backward compatibility
    myReports,
    publicReports,
    currentReport,
    reportCategories,
    isLoading,
    error,
    totalMyReports,
    totalPublicReports,
    uploadProgress,

    // Actions
    loadMyReports,
    loadPublicReports,
    loadReportDetail,
    uploadReport, // Legacy method
    uploadReportAsync, // New recommended method
    searchReports, // New search method
    updateVisibility,
    deleteReport,
    downloadReport,
    loadReportCategories,
    clearError,
    setError: setErrorMessage
  }
}
