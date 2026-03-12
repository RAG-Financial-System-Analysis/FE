import { useState, useCallback } from 'react'
import analyticsService from '@/services/analyticsService'
import type {
  AnalyticsType,
  GenerateAnalyticsReportRequest,
  AnalyticsReport,
  AnalyticsReportDetail,
  GetAnalyticsReportsRequest
} from '@/types/analytics.types'

interface UseAnalyticsReturn {
  // State
  analyticsTypes: AnalyticsType[]
  analyticsReports: AnalyticsReport[]
  currentReport: AnalyticsReportDetail | null
  isLoading: boolean
  error: string | null
  totalReports: number

  // Actions
  loadAnalyticsTypes: () => Promise<{ success: boolean; message: string }>
  generateReport: (
    data: GenerateAnalyticsReportRequest
  ) => Promise<{ success: boolean; message: string; reportId?: string }>
  loadAnalyticsReports: (params?: GetAnalyticsReportsRequest) => Promise<{ success: boolean; message: string }>
  loadReportDetail: (reportId: string) => Promise<{ success: boolean; message: string }>
  clearError: () => void
  setError: (message: string) => void
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [analyticsTypes, setAnalyticsTypes] = useState<AnalyticsType[]>([])
  const [analyticsReports, setAnalyticsReports] = useState<AnalyticsReport[]>([])
  const [currentReport, setCurrentReport] = useState<AnalyticsReportDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalReports, setTotalReports] = useState(0)

  const clearError = useCallback(() => setError(null), [])
  const setErrorMessage = useCallback((message: string) => setError(message), [])

  const loadAnalyticsTypes = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await analyticsService.getAnalyticsTypes()
      setAnalyticsTypes(response.analyticTypes)

      return {
        success: true,
        message: `Loaded ${response.analyticTypes.length} analytics types successfully`
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

  const generateReport = useCallback(async (data: GenerateAnalyticsReportRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await analyticsService.generateReport(data)

      return {
        success: true,
        message: response.message,
        reportId: response.reportId
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to generate analytics report'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadAnalyticsReports = useCallback(async (params: GetAnalyticsReportsRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await analyticsService.getReports(params)
      setAnalyticsReports(response.data)
      setTotalReports(response.total)

      return {
        success: true,
        message: `Loaded ${response.data.length} analytics reports successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load analytics reports'
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
      const reportDetail = await analyticsService.getReportById(reportId)
      setCurrentReport(reportDetail)

      return {
        success: true,
        message: 'Analytics report detail loaded successfully'
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load analytics report detail'
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
    analyticsTypes,
    analyticsReports,
    currentReport,
    isLoading,
    error,
    totalReports,

    // Actions
    loadAnalyticsTypes,
    generateReport,
    loadAnalyticsReports,
    loadReportDetail,
    clearError,
    setError: setErrorMessage
  }
}
