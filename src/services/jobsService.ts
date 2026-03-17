import axiosInstance from '@/lib/axios'
import type { JobStatus, JobResult } from '@/types/jobs.types'

class JobsService {
  // Get job status
  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await axiosInstance.get(`/api/jobs/${jobId}/status`, {
      timeout: 15000 // 15 seconds - safe for polling requests
    })
    return response.data
  }

  // Get job result (only when completed)
  async getJobResult(jobId: string): Promise<JobResult> {
    const response = await axiosInstance.get(`/api/jobs/${jobId}/result`, {
      timeout: 15000 // 15 seconds - safe for result requests
    })
    return response.data
  }

  // Polling utility for job completion
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

export default new JobsService()
