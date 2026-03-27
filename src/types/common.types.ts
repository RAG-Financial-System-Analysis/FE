/**
 * Common types shared across the application
 *
 * This module contains generic types and interfaces used throughout the application
 * for API responses, pagination, and error handling.
 */

/**
 * Generic paginated response wrapper
 *
 * Used for API endpoints that return paginated data.
 *
 * @template T - The type of items in the paginated response
 *
 * @example
 * ```typescript
 * interface User { id: string; name: string }
 * const response: PaginatedResponse<User> = {
 *   data: [{ id: '1', name: 'John' }],
 *   total: 100,
 *   page: 1,
 *   pageSize: 10
 * }
 * ```
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[]
  /** Total number of items across all pages */
  total: number
  /** Current page number (1-indexed) */
  page: number
  /** Number of items per page */
  pageSize: number
}

/**
 * Generic API response wrapper
 *
 * Standard wrapper for all API responses.
 *
 * @template T - The type of data in the response
 *
 * @example
 * ```typescript
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: '1', name: 'John' },
 *   message: 'User retrieved successfully'
 * }
 * ```
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean
  /** The response data */
  data: T
  /** Optional message describing the response */
  message?: string
}

/**
 * Generic API error response
 *
 * Returned when an API request fails.
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   code: 'VALIDATION_ERROR',
 *   message: 'Invalid email format',
 *   details: { field: 'email', value: 'invalid' }
 * }
 * ```
 */
export interface ApiError {
  /** Error code for programmatic handling */
  code: string
  /** Human-readable error message */
  message: string
  /** Additional error details */
  details?: Record<string, unknown>
}

/**
 * Generic request parameters for pagination
 *
 * Used in API requests to specify pagination parameters.
 *
 * @example
 * ```typescript
 * const params: PaginationParams = {
 *   page: 2,
 *   pageSize: 20
 * }
 * ```
 */
export interface PaginationParams {
  /** Page number (1-indexed), defaults to 1 */
  page?: number
  /** Number of items per page, defaults to 10 */
  pageSize?: number
}
