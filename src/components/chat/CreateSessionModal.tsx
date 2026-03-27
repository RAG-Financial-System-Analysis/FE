import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { AnalyticsTypeSelector } from './AnalyticsTypeSelector'
import { useChat } from '@/hooks'
import type { AnalyticsType } from '@/types'

interface CreateSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSessionCreated: (sessionId: string) => void
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose, onSessionCreated }) => {
  const [selectedType, setSelectedType] = useState<AnalyticsType | null>(null)
  const [title, setTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { createSession } = useChat()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedType || !title.trim()) {
      setError('Vui lòng chọn loại phân tích và nhập tiêu đề')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const result = await createSession({
        analyticsTypeId: selectedType.id,
        title: title.trim()
      })

      if (result.success && result.sessionId) {
        onSessionCreated(result.sessionId)
        onClose()
        // Reset form
        setSelectedType(null)
        setTitle('')
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error('Error creating session:', err)
      setError('Có lỗi xảy ra khi tạo phiên chat')
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      onClose()
      setSelectedType(null)
      setTitle('')
      setError(null)
    }
  }

  if (!isOpen) return null

  console.log('CreateSessionModal: Modal is open, rendering content')

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden border border-slate-200'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
            </div>
            <h2 className='text-xl font-bold text-slate-900'>Tạo phiên chat mới</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className='text-slate-400 hover:text-slate-600 disabled:opacity-50 p-2 rounded-lg hover:bg-white/60 transition-all duration-200'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className='flex flex-col h-full'>
          <div className='flex-1 overflow-y-auto'>
            {/* Analytics Type Selection */}
            <AnalyticsTypeSelector selectedType={selectedType} onSelect={setSelectedType} className='border-b' />

            {/* Title Input */}
            <div className='p-6'>
              <label htmlFor='session-title' className='block text-sm font-semibold text-slate-700 mb-3'>
                Tiêu đề phiên chat
              </label>
              <Input
                id='session-title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Ví dụ: Phân tích báo cáo tài chính Q1 2024'
                className='w-full h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50 focus:bg-white transition-all duration-200'
                disabled={isCreating}
                maxLength={200}
              />
              <div className='flex items-center justify-between mt-2'>
                <p className='text-xs text-slate-500'>Nhập tiêu đề mô tả cho phiên chat của bạn</p>
                <p className='text-xs text-slate-400'>{title.length}/200</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <p className='text-sm text-red-700 font-medium'>{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50/50'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isCreating}
              className='px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={!selectedType || !title.trim() || isCreating}
              className='min-w-30 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isCreating ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  Đang tạo...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  Tạo phiên chat
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
