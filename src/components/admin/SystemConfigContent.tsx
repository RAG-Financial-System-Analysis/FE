import { useState } from 'react'
import { Eye, EyeOff, Copy, RefreshCw, Trash2 } from 'lucide-react'

interface Integration {
  name: string
  successRate: string
  apiCalls: string
  rateLimit: string
  apiKey: string
  secretKey: string
  enabled: boolean
}

const SystemConfigContent = () => {
  const [activeTab, setActiveTab] = useState('API & Integration')
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})

  const tabs = [
    { name: 'General settings', icon: '⚙️' },
    { name: 'Notification', icon: '🔔' },
    { name: 'API & Integration', icon: '🔗' },
    { name: 'Webhook', icon: '🪝' }
  ]

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      name: 'Stripe',
      successRate: '18.36%',
      apiCalls: '3618',
      rateLimit: '3618',
      apiKey: '••••••••••',
      secretKey: '••••••••••',
      enabled: true
    },
    {
      name: 'Paypal',
      successRate: '18.36%',
      apiCalls: '3618',
      rateLimit: '3618',
      apiKey: '••••••••••',
      secretKey: '••••••••••',
      enabled: true
    },
    {
      name: 'Stonks',
      successRate: '18.36%',
      apiCalls: '3618',
      rateLimit: '3618',
      apiKey: '••••••••••',
      secretKey: '••••••••••',
      enabled: true
    }
  ])

  const toggleKeyVisibility = (integrationName: string, keyType: string) => {
    const key = `${integrationName}-${keyType}`
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleIntegration = (index: number) => {
    setIntegrations((prev) =>
      prev.map((integration, i) => (i === index ? { ...integration, enabled: !integration.enabled } : integration))
    )
  }

  const removeIntegration = (index: number) => {
    setIntegrations((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>System configuration</h1>
        <button className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'>
          Add new Integration
        </button>
      </div>

      {/* Tabs */}
      <div className='flex gap-8 mb-8 border-b border-gray-200'>
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-4 px-2 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.name ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className='mr-2'>{tab.icon}</span>
            {tab.name}
            {activeTab === tab.name && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600'></div>}
          </button>
        ))}
      </div>

      {/* Integration Cards */}
      <div className='space-y-6'>
        {integrations.map((integration, index) => (
          <div key={index} className='bg-white rounded-xl border border-gray-200 p-6'>
            {/* Integration Header */}
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>{integration.name}</h2>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={integration.enabled}
                  onChange={() => toggleIntegration(index)}
                  className='sr-only peer'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-6 mb-6'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
                  <span className='text-purple-500'>📊</span>
                  Success rate
                </div>
                <div className='text-2xl font-bold text-gray-900 mb-1'>{integration.successRate}</div>
                <div className='text-xs text-gray-500'>last 24hrs</div>
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
                  <span className='text-blue-500'>📞</span>
                  Api Call
                </div>
                <div className='text-2xl font-bold text-gray-900 mb-1'>{integration.apiCalls}</div>
                <div className='text-xs text-gray-500'>last 24hrs</div>
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
                  <span className='text-orange-500'>⚡</span>
                  Rate Limit
                </div>
                <div className='text-2xl font-bold text-gray-900 mb-1'>{integration.rateLimit}</div>
                <div className='text-xs text-gray-500'>request per day</div>
              </div>
            </div>

            {/* API Keys */}
            <div className='space-y-4 mb-6'>
              {/* API Key */}
              <div className='flex items-center gap-4'>
                <div className='w-24 text-sm font-medium text-gray-700'>API Key</div>
                <div className='flex-1 flex items-center gap-2'>
                  <div className='flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-sm'>
                    {showKeys[`${integration.name}-api`] ? 'sk_live_51234567890abcdef' : integration.apiKey}
                  </div>
                  <button
                    onClick={() => toggleKeyVisibility(integration.name, 'api')}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    {showKeys[`${integration.name}-api`] ? (
                      <EyeOff className='w-5 h-5 text-gray-600' />
                    ) : (
                      <Eye className='w-5 h-5 text-gray-600' />
                    )}
                  </button>
                  <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                    <Copy className='w-5 h-5 text-gray-600' />
                  </button>
                  <button className='px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2'>
                    <RefreshCw className='w-4 h-4' />
                    Generate
                  </button>
                </div>
              </div>

              {/* Secret Key */}
              <div className='flex items-center gap-4'>
                <div className='w-24 text-sm font-medium text-gray-700'>Secret Key</div>
                <div className='flex-1 flex items-center gap-2'>
                  <div className='flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-sm'>
                    {showKeys[`${integration.name}-secret`] ? 'sk_test_51234567890abcdef' : integration.secretKey}
                  </div>
                  <button
                    onClick={() => toggleKeyVisibility(integration.name, 'secret')}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    {showKeys[`${integration.name}-secret`] ? (
                      <EyeOff className='w-5 h-5 text-gray-600' />
                    ) : (
                      <Eye className='w-5 h-5 text-gray-600' />
                    )}
                  </button>
                  <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                    <Copy className='w-5 h-5 text-gray-600' />
                  </button>
                  <button className='px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2'>
                    <RefreshCw className='w-4 h-4' />
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <div className='flex justify-end'>
              <button
                onClick={() => removeIntegration(index)}
                className='px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2'
              >
                <Trash2 className='w-4 h-4' />
                Remove Integration
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemConfigContent
