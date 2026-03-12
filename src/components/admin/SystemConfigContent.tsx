import { useState } from 'react'
import { Settings, Zap, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import axiosInstance from '@/lib/axios'

interface TestResult {
  status: 'success' | 'error' | 'loading'
  message: string
  timestamp: string
  responseTime?: number
}

const SystemConfigContent = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testGeminiConnection = async () => {
    setIsLoading(true)
    const startTime = Date.now()

    try {
      setTestResult({
        status: 'loading',
        message: 'Đang kiểm tra kết nối Gemini AI...',
        timestamp: new Date().toLocaleString('vi-VN')
      })

      const response = await axiosInstance.get('/api/TestAI/openai')
      const responseTime = Date.now() - startTime

      if (response.data.status === 'success') {
        setTestResult({
          status: 'success',
          message: response.data.message || 'Kết nối Gemini AI thành công!',
          timestamp: new Date().toLocaleString('vi-VN'),
          responseTime
        })
      } else {
        setTestResult({
          status: 'error',
          message: response.data.message || 'Có lỗi xảy ra khi kiểm tra kết nối',
          timestamp: new Date().toLocaleString('vi-VN'),
          responseTime
        })
      }
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime
      let errorMessage = 'Không thể kết nối đến Gemini AI'

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const genericError = error as { message: string }
        errorMessage = genericError.message
      }

      setTestResult({
        status: 'error',
        message: errorMessage,
        timestamp: new Date().toLocaleString('vi-VN'),
        responseTime
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-green-600' />
      case 'error':
        return <XCircle className='w-5 h-5 text-red-600' />
      case 'loading':
        return <RefreshCw className='w-5 h-5 text-blue-600 animate-spin' />
      default:
        return <AlertCircle className='w-5 h-5 text-slate-400' />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'loading':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'loading':
        return 'text-blue-800'
      default:
        return 'text-slate-800'
    }
  }

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-900 mb-2'>Cấu Hình Hệ Thống</h1>
        <p className='text-slate-600'>Kiểm tra và cấu hình các dịch vụ hệ thống</p>
      </div>

      {/* AI Service Configuration */}
      <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
            <Zap className='w-5 h-5 text-purple-600' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-slate-900'>Dịch Vụ AI</h2>
            <p className='text-slate-600'>Kiểm tra kết nối và trạng thái dịch vụ Gemini AI</p>
          </div>
        </div>

        <div className='space-y-4'>
          {/* Test Button */}
          <div className='flex items-center gap-4'>
            <button
              onClick={testGeminiConnection}
              disabled={isLoading}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? <RefreshCw className='w-4 h-4 animate-spin' /> : <Zap className='w-4 h-4' />}
              {isLoading ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối Gemini'}
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`rounded-xl p-4 border ${getStatusColor(testResult.status)}`}>
              <div className='flex items-start gap-3'>
                {getStatusIcon(testResult.status)}
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className={`font-medium ${getStatusTextColor(testResult.status)}`}>Kết Quả Kiểm Tra</h3>
                    <span className='text-sm text-slate-500'>{testResult.timestamp}</span>
                  </div>
                  <p className={`text-sm ${getStatusTextColor(testResult.status)} mb-2`}>{testResult.message}</p>
                  {testResult.responseTime && (
                    <p className='text-xs text-slate-500'>Thời gian phản hồi: {testResult.responseTime}ms</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Service Info */}
          <div className='bg-slate-50 rounded-lg p-4'>
            <h4 className='font-medium text-slate-900 mb-2'>Thông Tin Dịch Vụ</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Nhà cung cấp:</span>
                <span className='text-slate-900 font-medium'>Google Gemini AI</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Model:</span>
                <span className='text-slate-900 font-medium'>gemini-2.5-flash</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Endpoint:</span>
                <span className='text-slate-900 font-medium'>/api/TestAI/openai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other System Configurations */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Database Configuration */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
              <Settings className='w-4 h-4 text-green-600' />
            </div>
            <h3 className='text-lg font-semibold text-slate-900'>Cơ Sở Dữ Liệu</h3>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Trạng thái:</span>
              <span className='text-sm text-green-600 font-medium'>Hoạt động</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Loại:</span>
              <span className='text-sm text-slate-900'>SQL Server</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Kết nối:</span>
              <span className='text-sm text-slate-900'>Ổn định</span>
            </div>
          </div>
        </div>

        {/* Storage Configuration */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
              <Settings className='w-4 h-4 text-orange-600' />
            </div>
            <h3 className='text-lg font-semibold text-slate-900'>Lưu Trữ</h3>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Trạng thái:</span>
              <span className='text-sm text-green-600 font-medium'>Hoạt động</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Loại:</span>
              <span className='text-sm text-slate-900'>Local Storage</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Dung lượng:</span>
              <span className='text-sm text-slate-900'>Đủ</span>
            </div>
          </div>
        </div>

        {/* Authentication Configuration */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
              <Settings className='w-4 h-4 text-blue-600' />
            </div>
            <h3 className='text-lg font-semibold text-slate-900'>Xác Thực</h3>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Trạng thái:</span>
              <span className='text-sm text-green-600 font-medium'>Hoạt động</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Loại:</span>
              <span className='text-sm text-slate-900'>JWT Token</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Bảo mật:</span>
              <span className='text-sm text-slate-900'>Cao</span>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
              <Settings className='w-4 h-4 text-purple-600' />
            </div>
            <h3 className='text-lg font-semibold text-slate-900'>Email</h3>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Trạng thái:</span>
              <span className='text-sm text-yellow-600 font-medium'>Chưa cấu hình</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>SMTP:</span>
              <span className='text-sm text-slate-900'>Chưa thiết lập</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-600'>Gửi email:</span>
              <span className='text-sm text-slate-900'>Tạm dừng</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className='mt-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm'>
        <h3 className='text-lg font-semibold text-slate-900 mb-4'>Thông Tin Hệ Thống</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <h4 className='font-medium text-slate-900 mb-2'>Phiên Bản</h4>
            <p className='text-sm text-slate-600'>RAG System v1.0.0</p>
          </div>
          <div>
            <h4 className='font-medium text-slate-900 mb-2'>Môi Trường</h4>
            <p className='text-sm text-slate-600'>Production</p>
          </div>
          <div>
            <h4 className='font-medium text-slate-900 mb-2'>Cập Nhật Cuối</h4>
            <p className='text-sm text-slate-600'>{new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemConfigContent
