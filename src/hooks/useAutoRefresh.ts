import { useEffect, useRef, useCallback, useState } from 'react'

interface UseAutoRefreshOptions {
  interval?: number // milliseconds
  enabled?: boolean
  onRefresh: () => Promise<void> | void
  dependencies?: unknown[]
}

interface UseAutoRefreshReturn {
  isRefreshing: boolean
  lastRefresh: Date | null
  forceRefresh: () => void
  toggleAutoRefresh: () => void
  isAutoRefreshEnabled: boolean
}

export const useAutoRefresh = ({
  interval = 30000, // 30 seconds default
  enabled = true,
  onRefresh,
  dependencies = []
}: UseAutoRefreshOptions): UseAutoRefreshReturn => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(enabled)
  const intervalRef = useRef<number | null>(null)
  const isActiveRef = useRef(true)

  // Handle visibility change to pause/resume when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const executeRefresh = useCallback(async () => {
    if (!isActiveRef.current || isRefreshing) return

    setIsRefreshing(true)
    try {
      await onRefresh()
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Auto refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh, isRefreshing])

  const forceRefresh = useCallback(() => {
    executeRefresh()
  }, [executeRefresh])

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled((prev) => !prev)
  }, [])

  // Setup interval
  useEffect(() => {
    if (isAutoRefreshEnabled && interval > 0) {
      intervalRef.current = setInterval(() => {
        if (isActiveRef.current) {
          executeRefresh()
        }
      }, interval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isAutoRefreshEnabled, interval, executeRefresh, ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    isRefreshing,
    lastRefresh,
    forceRefresh,
    toggleAutoRefresh,
    isAutoRefreshEnabled
  }
}
