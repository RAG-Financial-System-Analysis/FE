import axiosInstance from '@/lib/axios'

export interface Report {
  Id: string
  CompanyName: string
  Ticker: string
  CategoryName: string
  Year: number
  Period: string
  Visibility: string
  FileName: string
  FileSizeKb: number
  CreatedAt: string
}

export interface UploadReportRequest {
  File: File
  CompanyId: string
  CategoryId: string
  Year: number
  Period: string
  Visibility?: string
}

export interface ReportMetric {
  Code: string
  Name: string
  Value: number
  Unit: string
}

export interface UploadReportResponse {
  ReportId: string
  Message: string
  MetricsExtracted: number
  PageCount: number
  Metrics: ReportMetric[]
}

class ReportService {
  async getMyReports(page = 1, pageSize = 10) {
    const response = await axiosInstance.get('/reports/my-reports', {
      params: { page, pageSize }
    })
    return response.data
  }

  async getPublicReports(page = 1, pageSize = 10) {
    const response = await axiosInstance.get('/reports/public-reports', {
      params: { page, pageSize }
    })
    return response.data
  }

  async uploadReport(data: UploadReportRequest): Promise<UploadReportResponse> {
    const formData = new FormData()
    formData.append('File', data.File)
    formData.append('CompanyId', data.CompanyId)
    formData.append('CategoryId', data.CategoryId)
    formData.append('Year', data.Year.toString())
    formData.append('Period', data.Period)
    if (data.Visibility) {
      formData.append('Visibility', data.Visibility)
    }

    const response = await axiosInstance.post('/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  async downloadReport(id: string) {
    const response = await axiosInstance.get(`/reports/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }

  async getReportById(id: string) {
    const response = await axiosInstance.get(`/reports/${id}`)
    return response.data
  }

  async deleteReport(id: string) {
    const response = await axiosInstance.delete(`/reports/${id}`)
    return response.data
  }
}

export default new ReportService()
