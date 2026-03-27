import { useState, useCallback } from 'react'
import { companiesService } from '@/services/companiesService'
import type { Company, GetCompaniesRequest, CreateCompanyRequest, UpdateCompanyRequest } from '@/types/companies.types'

interface UseCompaniesReturn {
  // State
  companies: Company[]
  currentCompany: Company | null
  isLoading: boolean
  error: string | null
  totalCompanies: number

  // Actions
  loadCompanies: (params?: GetCompaniesRequest) => Promise<{ success: boolean; message: string }>
  loadCompanyDetail: (companyId: string) => Promise<{ success: boolean; message: string }>
  createCompany: (data: CreateCompanyRequest) => Promise<{ success: boolean; message: string; companyId?: string }>
  updateCompany: (companyId: string, data: UpdateCompanyRequest) => Promise<{ success: boolean; message: string }>
  deleteCompany: (companyId: string) => Promise<{ success: boolean; message: string }>
  clearError: () => void
  setError: (message: string) => void
}

export const useCompanies = (): UseCompaniesReturn => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCompanies, setTotalCompanies] = useState(0)

  const clearError = useCallback(() => setError(null), [])
  const setErrorMessage = useCallback((message: string) => setError(message), [])

  const loadCompanies = useCallback(async (params: GetCompaniesRequest = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await companiesService.getCompanies(params)
      setCompanies(response.data)
      setTotalCompanies(response.total)

      return {
        success: true,
        message: `Loaded ${response.data.length} companies successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load companies'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadCompanyDetail = useCallback(async (companyId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const company = await companiesService.getCompanyDetail(companyId)
      setCurrentCompany(company)

      return {
        success: true,
        message: 'Company detail loaded successfully'
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load company detail'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createCompany = useCallback(
    async (data: CreateCompanyRequest) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesService.createCompany(data)

        // Reload companies to get the new one
        await loadCompanies()

        return {
          success: true,
          message: response.message,
          companyId: response.id
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create company'
        setError(errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    [loadCompanies]
  )

  const updateCompany = useCallback(
    async (companyId: string, data: UpdateCompanyRequest) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesService.updateCompany(companyId, data)

        // Update company in the list
        setCompanies((prev) => prev.map((company) => (company.id === companyId ? { ...company, ...data } : company)))

        if (currentCompany && currentCompany.id === companyId) {
          setCurrentCompany((prev) => (prev ? { ...prev, ...data } : null))
        }

        return {
          success: true,
          message: response.message
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update company'
        setError(errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    [currentCompany]
  )

  const deleteCompany = useCallback(
    async (companyId: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesService.deleteCompany(companyId)

        // Remove company from the list
        setCompanies((prev) => prev.filter((company) => company.id !== companyId))
        setTotalCompanies((prev) => prev - 1)

        if (currentCompany && currentCompany.id === companyId) {
          setCurrentCompany(null)
        }

        return {
          success: true,
          message: response.message
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete company'
        setError(errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    [currentCompany]
  )

  return {
    // State
    companies,
    currentCompany,
    isLoading,
    error,
    totalCompanies,

    // Actions
    loadCompanies,
    loadCompanyDetail,
    createCompany,
    updateCompany,
    deleteCompany,
    clearError,
    setError: setErrorMessage
  }
}
