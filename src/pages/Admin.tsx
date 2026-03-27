import { useState } from 'react'
import {
  AdminLayout,
  DashboardContent,
  UserManagementContent,
  ReportCategoriesContent,
  AnalyticsTypesContent,
  AuditLogsContent,
  CompaniesContent,
  SystemConfigContent,
  ReportsManagementContent
} from '@/components/admin'

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard')

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardContent />
      case 'Analyst Management':
        return <UserManagementContent />
      case 'Companies':
        return <CompaniesContent />
      case 'Reports Management':
        return <ReportsManagementContent />
      case 'Report Categories':
        return <ReportCategoriesContent />
      case 'Analytics Types':
        return <AnalyticsTypesContent />
      case 'Audit Logs':
        return <AuditLogsContent />
      case 'System Config':
        return <SystemConfigContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <AdminLayout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      {renderContent()}
    </AdminLayout>
  )
}

export default Admin
