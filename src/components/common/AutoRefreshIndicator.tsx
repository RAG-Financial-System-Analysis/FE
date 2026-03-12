import { RefreshCw, Pause, Play } from 'lucide-react'

interface AutoRefreshIndicatorProps {
  isRefreshing: boolean
  lastRefresh: Date | null
  isAutoRefreshEnabled: boolean
  onToggleAutoRefresh: () => void
  onForceRefresh: () => void
  interval?: number
}

const AutoRefreshIndicator: React.FC<AutoRefreshIndicatorProps> = ({
  isRefreshing,
  lastRefresh,
  isAutoRefreshEnabled,
  onToggleAutoRefresh,
  onForceRefresh,
  interval = 30000
}) => {
  const formatLastRefresh = (date: Date | null) => {
    if (!date) return 'Chưa cập nhật'

    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return `${diff} giây trước`
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
    return date.toLocaleTimeString('vi-VN')
  }

  return (
    <div className='flex items-center gap-3 text-sm text-slate-600'>
      {/* Auto Refresh Toggle */}
      <button
        onClick={onToggleAutoRefresh}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
          isAutoRefreshEnabled
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        title={isAutoRefreshEnabled ? 'Tắt tự động cập nhật' : 'Bật tự động cập nhật'}
      >
        {isAutoRefreshEnabled ? <Pause className='w-3 h-3' /> : <Play className='w-3 h-3' />}
        <span className='text-xs'>{isAutoRefreshEnabled ? `${interval / 1000}s` : 'Tắt'}</span>
      </button>

      {/* Manual Refresh */}
      <button
        onClick={onForceRefresh}
        disabled={isRefreshing}
        className='flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        title='Cập nhật ngay'
      >
        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className='text-xs'>Cập nhật</span>
      </button>

      {/* Last Refresh Time */}
      <div className='text-xs text-slate-500'>Cập nhật: {formatLastRefresh(lastRefresh)}</div>
    </div>
  )
}

export default AutoRefreshIndicator
