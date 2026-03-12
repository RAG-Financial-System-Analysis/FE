// Metrics related types

export interface MetricsGroup {
  id: string
  name: string
  description: string
  order: number
}

export interface GetMetricsGroupsResponse {
  groups: MetricsGroup[]
}

export interface MetricDefinition {
  id: string
  code: string
  name: string
  description: string
  unit: string
  groupId: string
  formula: string
}

export interface GetMetricDefinitionsRequest {
  groupId?: string
}

export interface GetMetricDefinitionsResponse {
  definitions: MetricDefinition[]
}

export interface MetricValue {
  metricId: string
  code: string
  name: string
  value: number
  unit: string
  extractedAt: string
}

export interface GetMetricValuesResponse {
  reportId: string
  values: MetricValue[]
}

export interface CalculateMetricsRequest {
  reportId: string
  metricIds: string[]
  parameters: {
    recalculate: boolean
    useAI: boolean
  }
}

export interface CalculatedMetric {
  metricId: string
  code: string
  value: number
  confidence: number
  source: string
}

export interface CalculateMetricsResponse {
  reportId: string
  calculatedMetrics: CalculatedMetric[]
  status: string
}
