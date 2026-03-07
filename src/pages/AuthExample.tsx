import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useAuthActions } from '@/hooks/useAuthActions'

export const AuthExample: React.FC = () => {
  const { isAuthenticated, user, role, fullName, accessToken } = useAuth()

  const {
    isAdmin,
    isAnalyst,
    canAccessAdminRoutes,
    canAccessAnalystRoutes,
    shouldShowAdminFeatures,
    shouldShowAnalystFeatures
  } = useRoleGuard()

  const { logout, isLoggingOut } = useAuthActions()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      console.log('Logged out successfully')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className='max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Authentication Example</h1>
        <p className='text-gray-600'>
          You are not authenticated. Please{' '}
          <a href='/login' className='text-blue-600 hover:text-blue-800'>
            login
          </a>{' '}
          or{' '}
          <a href='/register' className='text-blue-600 hover:text-blue-800'>
            register
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Authentication Example</h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50'
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      <div className='space-y-4'>
        <div className='bg-green-100 p-4 rounded'>
          <h2 className='font-semibold text-green-800 mb-2'>✅ Authentication Status</h2>
          <p className='text-green-700'>You are successfully authenticated!</p>
        </div>

        <div className='bg-blue-100 p-4 rounded'>
          <h2 className='font-semibold text-blue-800 mb-2'>👤 User Information</h2>
          <div className='text-blue-700 space-y-1'>
            <p>
              <strong>Full Name:</strong> {fullName}
            </p>
            <p>
              <strong>Role:</strong> {role}
            </p>
            <p>
              <strong>User ID:</strong> {user?.Id || 'Not stored locally'}
            </p>
            <p>
              <strong>Email:</strong> {user?.Email || 'Not stored locally'}
            </p>
          </div>
        </div>

        <div className='bg-purple-100 p-4 rounded'>
          <h2 className='font-semibold text-purple-800 mb-2'>🔐 Role Information</h2>
          <div className='text-purple-700 space-y-1'>
            <p>
              <strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}
            </p>
            <p>
              <strong>Is Analyst:</strong> {isAnalyst ? '✅ Yes' : '❌ No'}
            </p>
          </div>
        </div>

        <div className='bg-yellow-100 p-4 rounded'>
          <h2 className='font-semibold text-yellow-800 mb-2'>🚪 Route Access</h2>
          <div className='text-yellow-700 space-y-1'>
            <p>
              <strong>Can Access Admin Routes:</strong> {canAccessAdminRoutes ? '✅ Yes' : '❌ No'}
            </p>
            <p>
              <strong>Can Access Analyst Routes:</strong> {canAccessAnalystRoutes ? '✅ Yes' : '❌ No'}
            </p>
          </div>
        </div>

        <div className='bg-gray-100 p-4 rounded'>
          <h2 className='font-semibold text-gray-800 mb-2'>🎨 UI Features</h2>
          <div className='text-gray-700 space-y-1'>
            <p>
              <strong>Show Admin Features:</strong> {shouldShowAdminFeatures ? '✅ Yes' : '❌ No'}
            </p>
            <p>
              <strong>Show Analyst Features:</strong> {shouldShowAnalystFeatures ? '✅ Yes' : '❌ No'}
            </p>
          </div>
        </div>

        <div className='bg-indigo-100 p-4 rounded'>
          <h2 className='font-semibold text-indigo-800 mb-2'>🔑 Token Information</h2>
          <div className='text-indigo-700 space-y-1'>
            <p>
              <strong>Has Access Token:</strong> {accessToken ? '✅ Yes' : '❌ No'}
            </p>
            <p>
              <strong>Token Preview:</strong> {accessToken ? `${accessToken.substring(0, 20)}...` : 'None'}
            </p>
          </div>
        </div>

        <div className='bg-orange-100 p-4 rounded'>
          <h2 className='font-semibold text-orange-800 mb-2'>📋 API Usage Examples</h2>
          <div className='text-orange-700 space-y-2'>
            <p>Based on your role ({role}), you can access:</p>
            <ul className='list-disc list-inside space-y-1'>
              {isAdmin && (
                <>
                  <li>All Admin endpoints (/api/admin/*)</li>
                  <li>All Analyst endpoints</li>
                  <li>User management features</li>
                  <li>System statistics</li>
                </>
              )}
              {isAnalyst && (
                <>
                  <li>RAG Chat sessions</li>
                  <li>Report upload and management</li>
                  <li>Analytics generation</li>
                  <li>Company information (read-only)</li>
                </>
              )}
              <li>Authentication endpoints</li>
              <li>Test endpoints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
