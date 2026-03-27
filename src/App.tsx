import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { AuthProvider } from '@/context'
import { ProtectedRoute, PublicRoute } from '@/components/auth'
import { Loader2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { backgroundJobService } from '@/services'
import './index.css'
import './App.css'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LogInPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const VerifyAccount = lazy(() => import('./pages/VerifyAccount'))
const Admin = lazy(() => import('./pages/Admin'))
const Report = lazy(() => import('./pages/Report'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AnalystPage = lazy(() => import('./pages/AnalystPage'))

// Loading component
const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-gray-50'>
    <Loader2 className='w-10 h-10 text-primary animate-spin' />
  </div>
)

function App() {
  // Initialize background job recovery on app startup
  useEffect(() => {
    backgroundJobService.recoverJobs()

    // Cleanup on app close
    return () => {
      backgroundJobService.cleanup()
    }
  }, [])

  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path='/register'
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route path='/verify-account' element={<VerifyAccount />} />

            {/* Protected Routes - All authenticated users */}
            <Route
              path='/report'
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
            <Route
              path='/chat'
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Analyst']}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path='/admin'
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Analyst Routes */}
            <Route
              path='/analyst'
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Analyst']}>
                  <AnalystPage />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized Page */}
            <Route
              path='/unauthorized'
              element={
                <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                  <div className='text-center'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>403 - Unauthorized</h1>
                    <p className='text-gray-600 mb-8'>You don't have permission to access this page.</p>
                    <a href='/chat' className='text-primary hover:underline'>
                      Go to Chat
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff'
            },
            success: {
              duration: 3000,
              style: {
                background: '#10b981'
              }
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444'
              }
            }
          }}
        />
      </AuthProvider>
    </Router>
  )
}

export default App
