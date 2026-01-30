import { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardContent from '../components/admin/DashboardContent';
import AccessControlContent from '../components/admin/AccessControlContent';
import SystemConfigContent from '../components/admin/SystemConfigContent';
import SystemLogsContent from '../components/admin/SystemLogsContent';

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'Access control':
        return <AccessControlContent />;
      case 'System Config':
        return <SystemConfigContent />;
      case 'System Logs':
        return <SystemLogsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <AdminLayout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
