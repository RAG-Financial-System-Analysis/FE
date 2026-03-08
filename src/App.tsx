import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import { Loader2 } from 'lucide-react'
import './index.css'
import './App.css'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LogInPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const VerifyAccount = lazy(() => import('./pages/VerifyAccount'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const FPTDetail = lazy(() => import('./pages/FPTDetail'))
const VinamilkDetail = lazy(() => import('./pages/VinamilkDetail'))
const Admin = lazy(() => import('./pages/Admin'))
const Report = lazy(() => import('./pages/Report'))
const AIAssistant = lazy(() => import('./pages/AIAssistant'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

// Loading component
const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-gray-50'>
    <Loader2 className='w-10 h-10 text-primary animate-spin' />
  </div>
)

function App() {
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
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/fpt'
              element={
                <ProtectedRoute>
                  <FPTDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/vinamilk'
              element={
                <ProtectedRoute>
                  <VinamilkDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/report'
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
            <Route
              path='/ai-assistant'
              element={
                <ProtectedRoute>
                  <AIAssistant />
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

            {/* Unauthorized Page */}
            <Route
              path='/unauthorized'
              element={
                <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                  <div className='text-center'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>403 - Unauthorized</h1>
                    <p className='text-gray-600 mb-8'>You don't have permission to access this page.</p>
                    <a href='/dashboard' className='text-primary hover:underline'>
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App
