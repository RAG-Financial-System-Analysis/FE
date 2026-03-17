import { useState } from 'react'
import { Settings, Zap, CheckCircle, XCircle, AlertCircle, RefreshCw, Upload, Database } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import adminService from '@/services/adminService'

interface TestResult {
  status: 'success' | 'error' | 'loading'
  message: string
  timestamp: string
  responseTime?: number
  data?: unknown
}

interface S3Info {
  bucketName?: string
  region?: string
  status?: string
  permissions?: string[]
}

const SystemConfigContent = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [s3TestResult, setS3TestResult] = useState<TestResult | null>(null)
  const [s3InfoResult, setS3InfoResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isS3Loading, setIsS3Loading] = useState(false)
  const [isS3InfoLoading, setIsS3InfoLoading] = useState(false)
  const [s3Info, setS3Info] = useState<S3Info | null>(null)

  const renderTestData = (data: unknown): string => {
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2)
    }
    return String(data)
  }

  const renderDataSection = (result: TestResult) => {
    if (result.status === 'success' && result.data != null) {
      return (
        <div className='mt-2 p-2 bg-slate-100 rounded text-xs'>
          <pre className='text-slate-700 whitespace-pre-wrap break-all'>{renderTestData(result.data)}</pre>
        </div>
      )
    }
    return null
  }

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

  const testS3Upload = async () => {
    setIsS3Loading(true)
    const startTime = Date.now()

    try {
      setS3TestResult({
        status: 'loading',
        message: 'Đang kiểm tra S3 upload...',
        timestamp: new Date().toLocaleString('vi-VN')
      })

      // Create a test file
      const testFile = new Blob(['Test S3 upload functionality'], { type: 'text/plain' })
      const file = new File([testFile], 'test-upload.txt', { type: 'text/plain' })

      const response = await adminService.testS3Upload(file)
      const responseTime = Date.now() - startTime

      if (response.success) {
        setS3TestResult({
          status: 'success',
          message: response.message || 'S3 upload test thành công!',
          timestamp: new Date().toLocaleString('vi-VN'),
          responseTime,
          data: response.data
        })
      } else {
        setS3TestResult({
          status: 'error',
          message: response.message || 'S3 upload test thất bại',
          timestamp: new Date().toLocaleString('vi-VN'),
          responseTime
        })
      }
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime
      let errorMessage = 'Không thể test S3 upload'

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const genericError = error as { message: string }
        errorMessage = genericError.message
      }

      setS3TestResult({
        status: 'error',
        message: errorMessage,
        timestamp: new Date().toLocaleString('vi-VN'),
        responseTime
      })
    } finally {
      setIsS3Loading(false)
    }
  }

  const getS3Info = async () => {
    setIsS3InfoLoading(true)
    const startTime = Date.now()

    try {
      setS3InfoResult({
        status: 'loading',
        message: 'Đang lấy thông tin S3...',
        timestamp: new Date().toLocaleString('vi-VN')
      })

      const response = await adminService.getS3Info()
      const responseTime = Date.now() - startTime

      if (response.success) {
        // Extract S3 info from the actual response data
        const s3Data = response.data || {}
        setS3Info({
          bucketName: s3Data.bucketName || 'N/A',
          region: s3Data.region || 'N/A',
          status: 'Available',
          permissions: s3Data.permissions || []
        })
        setS3InfoResult({
          status: 'success',
          message: response.message || 'Lấy thông tin S3 thành công!',
          timestamp: new Date().toLocaleString('vi-VN'),
          responseTime,
          data: response.data
        })
      } else {
        setS3InfoResult({
          status: 'error',
          message: response.message || 'Không thể lấy thông tin S3',
          timestamp: new Date().toLocaleString('vi-VN'),
          responseTime
        })
      }
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime
      let errorMessage = 'Không thể lấy thông tin S3'

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const genericError = error as { message: string }
        errorMessage = genericError.message
      }

      setS3InfoResult({
        status: 'error',
        message: errorMessage,
        timestamp: new Date().toLocaleString('vi-VN'),
        responseTime
      })
    } finally {
      setIsS3InfoLoading(false)
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

      {/* S3 Storage Configuration */}
      <div className='bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
            <Database className='w-5 h-5 text-orange-600' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-slate-900'>S3 Storage</h2>
            <p className='text-slate-600'>Kiểm tra kết nối và chức năng lưu trữ S3</p>
          </div>
        </div>

        <div className='space-y-4'>
          {/* Test Buttons */}
          <div className='flex items-center gap-4'>
            <button
              onClick={getS3Info}
              disabled={isS3InfoLoading}
              className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isS3InfoLoading ? <RefreshCw className='w-4 h-4 animate-spin' /> : <Database className='w-4 h-4' />}
              {isS3InfoLoading ? 'Đang lấy thông tin...' : 'Lấy Thông Tin S3'}
            </button>
            <button
              onClick={testS3Upload}
              disabled={isS3Loading}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isS3Loading ? <RefreshCw className='w-4 h-4 animate-spin' /> : <Upload className='w-4 h-4' />}
              {isS3Loading ? 'Đang test upload...' : 'Test S3 Upload'}
            </button>
          </div>

          {/* S3 Info Result */}
          {s3InfoResult && (
            <div className={`rounded-xl p-4 border ${getStatusColor(s3InfoResult.status)}`}>
              <div className='flex items-start gap-3'>
                {getStatusIcon(s3InfoResult.status)}
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className={`font-medium ${getStatusTextColor(s3InfoResult.status)}`}>Thông Tin S3</h3>
                    <span className='text-sm text-slate-500'>{s3InfoResult.timestamp}</span>
                  </div>
                  <p className={`text-sm ${getStatusTextColor(s3InfoResult.status)} mb-2`}>{s3InfoResult.message}</p>
                  {s3InfoResult.responseTime && (
                    <p className='text-xs text-slate-500'>Thời gian phản hồi: {s3InfoResult.responseTime}ms</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* S3 Upload Test Result */}
          {s3TestResult && (
            <div className={`rounded-xl p-4 border ${getStatusColor(s3TestResult.status)}`}>
              <div className='flex items-start gap-3'>
                {getStatusIcon(s3TestResult.status)}
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className={`font-medium ${getStatusTextColor(s3TestResult.status)}`}>Kết Quả Test Upload</h3>
                    <span className='text-sm text-slate-500'>{s3TestResult.timestamp}</span>
                  </div>
                  <p className={`text-sm ${getStatusTextColor(s3TestResult.status)} mb-2`}>{s3TestResult.message}</p>
                  {s3TestResult.responseTime && (
                    <p className='text-xs text-slate-500'>Thời gian phản hồi: {s3TestResult.responseTime}ms</p>
                  )}
                  {renderDataSection(s3TestResult)}
                </div>
              </div>
            </div>
          )}

          {/* S3 Service Info */}
          <div className='bg-slate-50 rounded-lg p-4'>
            <h4 className='font-medium text-slate-900 mb-2'>Thông Tin S3</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Bucket:</span>
                <span className='text-slate-900 font-medium'>{s3Info?.bucketName || 'Chưa có thông tin'}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Region:</span>
                <span className='text-slate-900 font-medium'>{s3Info?.region || 'Chưa có thông tin'}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Status:</span>
                <span className='text-slate-900 font-medium'>{s3Info?.status || 'Chưa kiểm tra'}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Upload Endpoint:</span>
                <span className='text-slate-900 font-medium'>/api/test/s3-upload</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Info Endpoint:</span>
                <span className='text-slate-900 font-medium'>/api/test/s3-info</span>
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
