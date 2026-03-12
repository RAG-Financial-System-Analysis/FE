import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { AnalyticsType } from '@/types/analytics.types'

interface AnalyticsTypeSelectorProps {
  selectedType: AnalyticsType | null
  onSelect: (type: AnalyticsType) => void
  className?: string
}

export const AnalyticsTypeSelector: React.FC<AnalyticsTypeSelectorProps> = ({
  selectedType,
  onSelect,
  className = ''
}) => {
  console.log('AnalyticsTypeSelector: Component rendered')
  const { analyticsTypes, isLoading, error, loadAnalyticsTypes, clearError } = useAnalytics()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    console.log('AnalyticsTypeSelector: useEffect triggered, calling loadAnalyticsTypes')
    loadAnalyticsTypes()
  }, [loadAnalyticsTypes])

  const handleSelect = (type: AnalyticsType) => {
    onSelect(type)
    setIsDropdownOpen(false)
  }

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className='animate-pulse'>
          <div className='h-5 bg-slate-200 rounded w-32 mb-3'></div>
          <div className='h-12 bg-slate-200 rounded-xl'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-red-800'>Lỗi tải dữ liệu</h3>
                <p className='text-xs text-red-600'>{error}</p>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                clearError()
                loadAnalyticsTypes()
              }}
              className='bg-white border-red-300 text-red-700 hover:bg-red-50 rounded-lg px-3 py-1 text-xs'
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 ${className}`}>
      <label className='text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2'>
        <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
        Chọn loại phân tích
      </label>

      <div className='relative'>
        {/* Dropdown Button */}
        <button
          type='button'
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            w-full px-4 py-3 bg-white border-2 rounded-xl text-left flex items-center justify-between
            transition-all duration-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            ${selectedType ? 'border-blue-300 shadow-sm' : 'border-slate-300'}
            ${isDropdownOpen ? 'border-blue-500 shadow-md' : ''}
          `}
        >
          <div className='flex-1 min-w-0'>
            {selectedType ? (
              <div>
                <div className='font-medium text-slate-900 text-sm'>{selectedType.name}</div>
                <div className='text-xs text-slate-500 mt-0.5 truncate'>{selectedType.description}</div>
              </div>
            ) : (
              <div className='text-slate-500 text-sm'>Chọn loại phân tích...</div>
            )}
          </div>

          <div className='ml-3 shrink-0'>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div className='fixed inset-0 z-40' onClick={() => setIsDropdownOpen(false)} />

            {/* Menu */}
            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto'>
              {analyticsTypes.length === 0 ? (
                <div className='p-4 text-center text-slate-500 text-sm'>Không có loại phân tích nào khả dụng</div>
              ) : (
                <div className='py-1'>
                  {analyticsTypes.map((type, index) => (
                    <button
                      key={type.id}
                      type='button'
                      onClick={() => handleSelect(type)}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150
                        ${selectedType?.id === type.id ? 'bg-blue-50 text-blue-900' : 'text-slate-900'}
                        ${index === 0 ? 'rounded-t-xl' : ''}
                        ${index === analyticsTypes.length - 1 ? 'rounded-b-xl' : ''}
                      `}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-sm'>{type.name}</div>
                          <div className='text-xs text-slate-600 mt-0.5'>{type.description}</div>
                        </div>
                        {selectedType?.id === type.id && (
                          <div className='ml-3 shrink-0'>
                            <svg className='w-4 h-4 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
