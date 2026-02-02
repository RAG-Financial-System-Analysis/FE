// import { api } from "./api";

export interface DashboardStats {
  label: string
  value: string
  iconType: string // 'reports' | 'companies' | 'analyses'
}

export interface Company {
  name: string
  symbol: string
  reports: number
  revenue: string
  profit: string
  growth: string
  type: 'fpt' | 'vnm' | 'other'
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats[]> {
    try {
      /**
       * TODO: Uncomment the lines below to fetch data from your real backend.
       * Ensure your BE returns data matching the DashboardStats interface.
       */
      // const response = await api.get('/dashboard/stats');
      // return response;

      // Fallback Mock Data
      return [
        { label: 'Total Reports', value: '22', iconType: 'reports' },
        { label: 'Companies Analyzed', value: '2', iconType: 'companies' },
        { label: 'Analyses This Month', value: '156', iconType: 'analyses' }
      ]
    } catch (error) {
      console.error('Dashboard Service Stats Error:', error)
      throw error
    }
  },

  async getAnalyzedCompanies(): Promise<Company[]> {
    try {
      /**
       * TODO: Uncomment the lines below to fetch data from your real backend.
       * Ensure your BE returns data matching the Company interface.
       */
      // const response = await api.get('/dashboard/companies');
      // return response;

      // Fallback Mock Data
      return [
        {
          name: 'FPT Corporation',
          symbol: 'FPT',
          reports: 12,
          revenue: '42,817 billion VND',
          profit: '7,234 billion VND',
          growth: '+15.2%',
          type: 'fpt'
        },
        {
          name: 'Vinamilk',
          symbol: 'VNM',
          reports: 10,
          revenue: '63,558 billion VND',
          profit: '11,245 billion VND',
          growth: '+8.7%',
          type: 'vnm'
        }
      ]
    } catch (error) {
      console.error('Dashboard Service Companies Error:', error)
      throw error
    }
  }
}
