import { useState, useCallback } from 'react'
import metricsService from '@/services/metricsService'
import type {
  MetricsGroup,
  MetricDefinition,
  MetricValue,
  GetMetricDefinitionsRequest,
  CalculateMetricsRequest,
  CalculatedMetric
} from '@/types/metrics.types'

interface UseMetricsReturn {
  // State
  metricsGroups: MetricsGroup[]
  metricDefinitions: MetricDefinition[]
  metricValues: MetricValue[]
  calculatedMetrics: CalculatedMetric[]
  isLoading: boolean
  error: string | null

  // Actions
  loadMetricsGroups: () => Promise<{ success: boolean; message: string }>
  loadMetricDefinitions: (params?: GetMetricDefinitionsRequest) => Promise<{ success: boolean; message: string }>
  loadMetricValues: (reportId: string) => Promise<{ success: boolean; message: string }>
  calculateMetrics: (data: CalculateMetricsRequest) => Promise<{ success: boolean; message: string }>
  clearError: () => void
  setError: (message: string) => void
}

export const useMetrics = (): UseMetricsReturn => {
  const [metricsGroups, setMetricsGroups] = useState<MetricsGroup[]>([])
  const [metricDefinitions, setMetricDefinitions] = useState<MetricDefinition[]>([])
  const [metricValues, setMetricValues] = useState<MetricValue[]>([])
  const [calculatedMetrics, setCalculatedMetrics] = useState<CalculatedMetric[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])
  const setErrorMessage = useCallback((message: string) => setError(message), [])

  const loadMetricsGroups = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await metricsService.getMetricsGroups()
      setMetricsGroups(response.groups)

      return {
        success: true,
        message: `Loaded ${response.groups.length} metrics groups successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load metrics groups'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMetricDefinitions = useCallback(async (params: GetMetricDefinitionsRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await metricsService.getMetricDefinitions(params)
      setMetricDefinitions(response.definitions)

      return {
        success: true,
        message: `Loaded ${response.definitions.length} metric definitions successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load metric definitions'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMetricValues = useCallback(async (reportId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await metricsService.getMetricValues(reportId)
      setMetricValues(response.values)

      return {
        success: true,
        message: `Loaded ${response.values.length} metric values successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load metric values'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const calculateMetrics = useCallback(async (data: CalculateMetricsRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await metricsService.calculateMetrics(data)
      setCalculatedMetrics(response.calculatedMetrics)

      return {
        success: true,
        message: `Calculated ${response.calculatedMetrics.length} metrics successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to calculate metrics'
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
    metricsGroups,
    metricDefinitions,
    metricValues,
    calculatedMetrics,
    isLoading,
    error,

    // Actions
    loadMetricsGroups,
    loadMetricDefinitions,
    loadMetricValues,
    calculateMetrics,
    clearError,
    setError: setErrorMessage
  }
}
