import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DashboardContent from '@/components/admin/DashboardContent'
import UserManagementContent from '@/components/admin/UserManagementContent'
import ReportCategoriesContent from '@/components/admin/ReportCategoriesContent'
import AnalyticsTypesContent from '@/components/admin/AnalyticsTypesContent'
import AuditLogsContent from '@/components/admin/AuditLogsContent'
import CompaniesContent from '@/components/admin/CompaniesContent'
import SystemConfigContent from '@/components/admin/SystemConfigContent'
import ReportsManagementContent from '@/components/admin/ReportsManagementContent'

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
