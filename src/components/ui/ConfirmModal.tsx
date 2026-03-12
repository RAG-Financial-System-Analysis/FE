import { AlertTriangle, X } from 'lucide-react'
import { Button } from './button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger',
  isLoading = false
}: ConfirmModalProps) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          confirmText: 'text-white'
        }
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          confirmText: 'text-white'
        }
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          confirmText: 'text-white'
        }
      default:
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          confirmText: 'text-white'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className='fixed inset-0 bg-slate-900 bg-opacity-20 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl max-w-md w-full shadow-lg'>
        {/* Header */}
        <div className='p-6 border-b border-slate-200'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className={`w-10 h-10 ${styles.iconBg} rounded-lg flex items-center justify-center`}>
                <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />
              </div>
              <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
            </div>
            <button
              onClick={onClose}
              className='text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1'
              disabled={isLoading}
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className='p-6'>
          <p className='text-slate-600 leading-relaxed'>{message}</p>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl'>
          <div className='flex items-center gap-3 justify-end'>
            <Button variant='outline' onClick={onClose} disabled={isLoading} className='px-4 py-2'>
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 ${styles.confirmBg} ${styles.confirmText} disabled:opacity-50`}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
