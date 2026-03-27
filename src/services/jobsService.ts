import { jobsApi } from './api'
import type { JobStatus, JobResult } from '@/types/jobs.types'

/**
 * Jobs Service - Business logic and data transformation
 *
 * Manages background job operations including status polling and result retrieval.
 * Used for long-running operations like report uploads and analytics generation.
 *
 * @class JobsService
 * @example
 * ```typescript
 * import { jobsService } from '@/services'
 *
 * // Get job status
 * const status = await jobsService.getJobStatus('job-123')
 *
 * // Poll for job completion
 * const result = await jobsService.pollJobStatus('job-123', (progress) => {
 *   console.log(`Progress: ${progress}%`)
 * })
 * ```
 */
class JobsService {
  /**
   * Get the current status of a background job
   *
   * @param {string} jobId - The job ID to check
   * @returns {Promise<JobStatus>} Current job status
   * @throws {Error} If job not found or API request fails
   *
   * @example
   * ```typescript
   * const status = await jobsService.getJobStatus('job-123')
   * console.log(status.status) // 'pending', 'processing', 'completed', or 'failed'
   * console.log(status.progress) // 0-100
   * ```
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await jobsApi.getJobStatus(jobId)
    return response.data
  }

  /**
   * Get the result of a completed job
   *
   * Only call this after the job status is 'completed'.
   *
   * @param {string} jobId - The job ID to get results for
   * @returns {Promise<JobResult>} Job result with status and data
   * @throws {Error} If job not found, not completed, or API request fails
   *
   * @example
   * ```typescript
   * const result = await jobsService.getJobResult('job-123')
   * if (result.status === 'completed') {
   *   console.log(result.result) // Job-specific result data
   * }
   * ```
   */
  async getJobResult(jobId: string): Promise<JobResult> {
    const response = await jobsApi.getJobResult(jobId)
    return response.data
  }

  /**
   * Poll a job until completion with optional progress callback
   *
   * Automatically polls the job status at 5-second intervals until the job
   * completes or fails. Throws an error if the job times out.
   *
   * @param {string} jobId - The job ID to poll
   * @param {Function} [onProgress] - Optional callback for progress updates
   * @param {number} [onProgress.progress] - Progress percentage (0-100)
   * @param {number} [timeoutMinutes=30] - Timeout in minutes
   * @returns {Promise<unknown>} Job result when completed
   * @throws {Error} If job fails or times out
   *
   * @example
   * ```typescript
   * try {
   *   const result = await jobsService.pollJobStatus(
   *     'job-123',
   *     (progress) => {
   *       console.log(`Job progress: ${progress}%`)
   *       updateProgressBar(progress)
   *     },
   *     60 // 60 minute timeout
   *   )
   *   console.log('Job completed:', result)
   * } catch (error) {
   *   console.error('Job failed:', error.message)
   * }
   * ```
   */
  async pollJobStatus(
    jobId: string,
    onProgress?: (progress: number) => void,
    timeoutMinutes: number = 30
  ): Promise<unknown> {
    const startTime = Date.now()
    const timeout = timeoutMinutes * 60 * 1000

    while (true) {
      // Check timeout
      if (Date.now() - startTime > timeout) {
        throw new Error(`Job ${jobId} timed out after ${timeoutMinutes} minutes`)
      }

      const jobStatus = await this.getJobStatus(jobId)

      // Update progress if callback provided
      if (onProgress) {
        onProgress(jobStatus.progress)
      }

      if (jobStatus.status === 'completed') {
        return jobStatus.result
      }

      if (jobStatus.status === 'failed') {
        throw new Error(jobStatus.errorMessage || 'Job failed')
      }

      // Wait 5 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
}

export const jobsService = new JobsService()
