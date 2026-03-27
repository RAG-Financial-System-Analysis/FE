import axiosInstance from '@/lib/axios'
import type { JobStatus, JobResult } from '@/types/jobs.types'

/**
 * Jobs API module - Pure API communication with no business logic
 */
export const jobsApi = {
  getJobStatus: (jobId: string) =>
    axiosInstance.get<JobStatus>(`/api/jobs/${jobId}/status`, {
      timeout: 15000 // 15 seconds - safe for polling requests
    }),

  getJobResult: (jobId: string) =>
    axiosInstance.get<JobResult>(`/api/jobs/${jobId}/result`, {
      timeout: 15000 // 15 seconds - safe for result requests
    })
}
