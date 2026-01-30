import { useState } from 'react';
import { Filter, Download } from 'lucide-react';

interface Log {
  level: 'error' | 'success' | 'warning' | 'info';
  timestamp: string;
  category: string;
  message: string;
  description: string;
  userClient: string;
  ipAddress: string;
}

const SystemLogsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const logs: Log[] = [
    {
      level: 'error',
      timestamp: '2026-01-22 14:32:15',
      category: 'Authentication',
      message: 'Failed login attempt',
      description: 'Invalid password provided',
      userClient: 'john.doe@example.com',
      ipAddress: '192.168.1.100',
    },
    {
      level: 'success',
      timestamp: '2026-01-22 14:28:42',
      category: 'API',
      message: 'API endpoint updated successfully',
      description: 'Updated /v1/users endpoint configuration',
      userClient: 'admin@example.com',
      ipAddress: '10.0.0.5',
    },
    {
      level: 'warning',
      timestamp: '2026-01-22 14:15:33',
      category: 'Rate Limiting',
      message: 'Rate limit threshold reached',
      description: 'Exceeded 100 requests per minute limit',
      userClient: 'api-client-1234',
      ipAddress: '203.0.113.42',
    },
    {
      level: 'info',
      timestamp: '2026-01-22 13:58:21',
      category: 'System',
      message: 'System backup completed',
      description: 'Database backup completed successfully',
      userClient: '-',
      ipAddress: '127.0.0.1',
    },
    {
      level: 'success',
      timestamp: '2026-01-22 13:45:12',
      category: 'Access Control',
      message: 'User permissions updated',
      description: 'Updated permissions for role jane.doe@example.com',
      userClient: 'admin@example.com',
      ipAddress: '10.0.0.5',
    },
    {
      level: 'error',
      timestamp: '2026-01-22 13:32:06',
      category: 'API',
      message: 'API request timeout',
      description: 'Request to /v1/orders exceeded timeout threshold',
      userClient: 'api-client-5678',
      ipAddress: '198.51.100.23',
    },
    {
      level: 'warning',
      timestamp: '2026-01-22 11:18:45',
      category: 'System',
      message: 'High memory usage detected',
      description: 'Memory usage at 87%, approaching threshold',
      userClient: '-',
      ipAddress: '127.0.0.1',
    },
    {
      level: 'info',
      timestamp: '2026-01-22 12:55:33',
      category: 'Configuration',
      message: 'Configuration changes applied',
      description: 'Applied new rate limiting policies',
      userClient: 'admin@example.com',
      ipAddress: '10.0.0.5',
    },
  ];

  const getLevelBadge = (level: string) => {
    const badges = {
      error: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: '⊗',
        label: 'ERROR',
      },
      success: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: '✓',
        label: 'SUCCESS',
      },
      warning: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        icon: '⚠',
        label: 'WARNING',
      },
      info: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: 'ℹ',
        label: 'INFO',
      },
    };
    return badges[level as keyof typeof badges];
  };

  const stats = [
    { label: 'Info', count: 2, color: 'text-blue-600', icon: 'ℹ' },
    { label: 'Success', count: 2, color: 'text-green-600', icon: '✓' },
    { label: 'Warning', count: 2, color: 'text-yellow-600', icon: '⚠' },
    { label: 'Error', count: 2, color: 'text-red-600', icon: '⊗' },
  ];

  return (
    <div className="p-8">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Levels</option>
              <option>Error</option>
              <option>Warning</option>
              <option>Success</option>
              <option>Info</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Categories</option>
              <option>Authentication</option>
              <option>API</option>
              <option>System</option>
              <option>Access Control</option>
              <option>Configuration</option>
              <option>Rate Limiting</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        <div className="text-sm text-gray-500 mt-3">
          Showing 8 of 8 logs
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User/Client
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log, index) => {
                const badge = getLevelBadge(log.level);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                      >
                        <span>{badge.icon}</span>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {log.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.userClient}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Total</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
                <span className="text-sm font-medium text-gray-600">
                  {stat.label}
                </span>
              </div>
              <div className={`text-4xl font-bold ${stat.color}`}>
                {stat.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemLogsContent;
