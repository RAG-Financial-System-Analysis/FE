import { useState } from 'react';
import { Edit, Lock, Trash2, UserPlus } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastActive: string;
}

const AccessControlContent = () => {
  const [activeTab, setActiveTab] = useState('Users');

  const tabs = ['Users', 'Roles & Permissions'];

  const [users] = useState<User[]>([
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Administrator',
      status: 'Active',
      lastActive: '2 minutes ago',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Developer',
      status: 'Active',
      lastActive: '15 minutes ago',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Viewer',
      status: 'Active',
      lastActive: '1 hour ago',
    },
    {
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'Developer',
      status: 'Inactive',
      lastActive: '3 days ago',
    },
    {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Viewer',
      status: 'Suspended',
      lastActive: '1 week ago',
    },
  ]);

  const permissions = [
    {
      category: 'API Management',
      items: ['api:read', 'api:write', 'api:delete'],
    },
    {
      category: 'Configuration',
      items: ['config:read', 'config:write'],
    },
    {
      category: 'User Management',
      items: ['users:read', 'users:write', 'users:delete'],
    },
    {
      category: 'Logs & Monitoring',
      items: ['logs:read', 'monitoring:read'],
    },
    {
      category: 'Access Control',
      items: ['roles:read', 'roles:write', 'permissions:manage'],
    },
    {
      category: 'System Settings',
      items: ['system:read', 'system:write', 'system:admin'],
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'bg-purple-100 text-purple-700';
      case 'Developer':
        return 'bg-blue-100 text-blue-700';
      case 'Viewer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      case 'Suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'Users' && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                User Management
              </h1>
              <p className="text-sm text-gray-500">5 total users</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Lock className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'Roles & Permissions' && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Role Management
              </h1>
              <p className="text-sm text-gray-500">3 roles configured</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <span className="text-lg">+</span>
              Create Role
            </button>
          </div>

          {/* Roles Cards */}
          <div className="space-y-4 mb-8">
            {/* Administrator Role */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Administrator
                    </h3>
                    <span className="text-sm text-gray-500">1 user</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Full system access with all permissions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Permissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'api:read',
                    'api:write',
                    'api:delete',
                    'config:read',
                    'config:write',
                    'users:read',
                    'users:write',
                    'logs:read',
                    'monitoring:read',
                  ].map((perm, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Developer Role */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Developer
                    </h3>
                    <span className="text-sm text-gray-500">2 users</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Can manage API endpoints and view logs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Permissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'api:read',
                    'api:write',
                    'config:read',
                    'logs:read',
                    'monitoring:read',
                  ].map((perm, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Viewer Role */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Viewer</h3>
                    <span className="text-sm text-gray-500">2 users</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Read-only access to API and logs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Permissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {['api:read', 'logs:read', 'monitoring:read'].map(
                    (perm, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {perm}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Available Permissions Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Available Permissions
            </h2>
            <p className="text-sm text-gray-500">
              System-wide permission categories
            </p>
          </div>

          {/* Permissions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {permissions.map((permission, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {permission.category}
                </h3>
                <ul className="space-y-2">
                  {permission.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControlContent;
