import { useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import DashboardContent from '../components/admin/DashboardContent'
import UserManagementContent from '../components/admin/UserManagementContent'
import AuditLogsContent from '../components/admin/AuditLogsContent'
import SystemConfigContent from '../components/admin/SystemConfigContent'

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard')

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardContent />
      case 'User Management':
        return <UserManagementContent />
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
