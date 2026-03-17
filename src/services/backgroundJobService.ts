import jobsService from './jobsService'
import toast from 'react-hot-toast'

interface BackgroundJob {
  id: string
  type: 'upload' | 'analytics' | 'chat'
  jobId: string
  fileName?: string
  title?: string
  startTime: number
  showToast?: boolean // Option to show/hide toast notifications
  onComplete?: (result: unknown) => void
  onError?: (error: string) => void
}

class BackgroundJobService {
  private jobs: Map<string, BackgroundJob> = new Map()
  private pollingIntervals: Map<string, number> = new Map()

  // Start a background job
  startJob(job: Omit<BackgroundJob, 'id' | 'startTime'>): string {
    const id = `${job.type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

    const backgroundJob: BackgroundJob = {
      ...job,
      id,
      startTime: Date.now(),
      showToast: job.showToast !== false // Default to true unless explicitly set to false
    }

    this.jobs.set(id, backgroundJob)
    this.startPolling(id)

    // Save to localStorage for recovery
    this.saveToStorage()

    // Show initial toast only if showToast is true
    if (backgroundJob.showToast) {
      toast.loading(this.getLoadingMessage(backgroundJob), {
        id: `job_${id}`,
        duration: Infinity
      })
    }

    return id
  }

  // Start polling for a job with exponential backoff
  private startPolling(jobId: string) {
    const job = this.jobs.get(jobId)
    if (!job) return

    let pollInterval = 15000 // Start with 15 seconds
    const maxInterval = 30000 // Max 30 seconds
    const backoffMultiplier = 1.2 // Increase by 20% each time
    const maxDuration = 30 * 60 * 1000 // Max 30 minutes timeout

    const poll = async () => {
      try {
        // Check if exceeded max duration (30 minutes)
        const elapsed = Date.now() - job.startTime
        if (elapsed > maxDuration) {
          this.handleJobError(jobId, 'Job timeout - exceeded 30 minutes maximum duration')
          return
        }

        const status = await jobsService.getJobStatus(job.jobId)

        if (status.status === 'completed') {
          this.handleJobComplete(jobId, status.result)
        } else if (status.status === 'failed') {
          this.handleJobError(jobId, status.errorMessage || 'Job failed')
        } else {
          // Still processing - increase interval with exponential backoff
          pollInterval = Math.min(pollInterval * backoffMultiplier, maxInterval)

          // Schedule next poll
          const timeout = window.setTimeout(poll, pollInterval)
          this.pollingIntervals.set(jobId, timeout)
        }
      } catch (error: any) {
        console.error(`Polling error for job ${jobId}:`, error)

        // Handle rate limiting (429 Too Many Requests)
        if (error.response?.status === 429) {
          pollInterval = Math.min(pollInterval * 2, maxInterval)
          console.warn(`Rate limited for job ${jobId}, backing off to ${pollInterval}ms`)
        }

        // Continue polling with current interval (don't give up on network errors)
        const timeout = window.setTimeout(poll, pollInterval)
        this.pollingIntervals.set(jobId, timeout)
      }
    }

    // Initial poll
    poll()
  }

  // Handle job completion
  private handleJobComplete(jobId: string, result: unknown) {
    const job = this.jobs.get(jobId)
    if (!job) return

    // Clear polling
    this.clearPolling(jobId)

    // Show success toast only if showToast is true
    if (job.showToast) {
      toast.success(this.getSuccessMessage(job), {
        id: `job_${jobId}`,
        duration: 5000
      })
    }

    // Call completion callback
    if (job.onComplete) {
      job.onComplete(result)
    }

    // Cleanup
    this.jobs.delete(jobId)
    this.saveToStorage()
  }

  // Handle job error
  private handleJobError(jobId: string, error: string) {
    const job = this.jobs.get(jobId)
    if (!job) return

    // Clear polling
    this.clearPolling(jobId)

    // Show error toast only if showToast is true
    if (job.showToast) {
      toast.error(`${this.getJobTypeLabel(job.type)} failed: ${error}`, {
        id: `job_${jobId}`,
        duration: 8000
      })
    }

    // Call error callback
    if (job.onError) {
      job.onError(error)
    }

    // Cleanup
    this.jobs.delete(jobId)
    this.saveToStorage()
  }

  // Clear polling for a job
  private clearPolling(jobId: string) {
    const timeout = this.pollingIntervals.get(jobId)
    if (timeout) {
      clearTimeout(timeout)
      this.pollingIntervals.delete(jobId)
    }
  }

  // Cancel a job
  cancelJob(jobId: string) {
    const job = this.jobs.get(jobId)
    if (!job) return

    this.clearPolling(jobId)

    toast.dismiss(`job_${jobId}`)
    toast(`${this.getJobTypeLabel(job.type)} cancelled`, {
      icon: '⏹️',
      duration: 3000
    })

    this.jobs.delete(jobId)
    this.saveToStorage()
  }

  // Get all active jobs
  getActiveJobs(): BackgroundJob[] {
    return Array.from(this.jobs.values())
  }

  // Recovery from localStorage on app start
  recoverJobs() {
    try {
      const stored = localStorage.getItem('backgroundJobs')
      if (!stored) return

      const jobs: BackgroundJob[] = JSON.parse(stored)

      jobs.forEach((job) => {
        // Only recover jobs that are less than 1 hour old
        const ageMinutes = (Date.now() - job.startTime) / (1000 * 60)
        if (ageMinutes < 60) {
          this.jobs.set(job.id, job)
          this.startPolling(job.id)

          // Show recovery toast
          toast.loading(`Resuming ${this.getJobTypeLabel(job.type)}...`, {
            id: `job_${job.id}`,
            duration: Infinity
          })
        }
      })
    } catch (error) {
      console.error('Failed to recover background jobs:', error)
      localStorage.removeItem('backgroundJobs')
    }
  }

  // Save jobs to localStorage
  private saveToStorage() {
    try {
      const jobs = Array.from(this.jobs.values())
      localStorage.setItem('backgroundJobs', JSON.stringify(jobs))
    } catch (error) {
      console.error('Failed to save background jobs:', error)
    }
  }

  // Helper methods for messages
  private getJobTypeLabel(type: string): string {
    switch (type) {
      case 'upload':
        return 'Report Upload'
      case 'analytics':
        return 'Analytics Generation'
      case 'chat':
        return 'Chat Processing'
      default:
        return 'Job'
    }
  }

  private getLoadingMessage(job: BackgroundJob): string {
    switch (job.type) {
      case 'upload':
        return `Uploading ${job.fileName || 'report'}...`
      case 'analytics':
        return `Generating ${job.title || 'analytics'}...`
      case 'chat':
        return 'Processing chat message...'
      default:
        return 'Processing...'
    }
  }

  private getSuccessMessage(job: BackgroundJob): string {
    switch (job.type) {
      case 'upload':
        return `${job.fileName || 'Report'} uploaded successfully!`
      case 'analytics':
        return `${job.title || 'Analytics'} generated successfully!`
      case 'chat':
        return 'Chat response ready!'
      default:
        return 'Job completed successfully!'
    }
  }

  // Cleanup on app close
  cleanup() {
    this.pollingIntervals.forEach((timeout) => clearTimeout(timeout))
    this.pollingIntervals.clear()
  }
}

export default new BackgroundJobService()
