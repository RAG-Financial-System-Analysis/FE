import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Loader2 } from 'lucide-react'
import './index.css'
import './App.css'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LogInPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const VerifyAccount = lazy(() => import('./pages/VerifyAccount'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const FPTDetail = lazy(() => import('./pages/FPTDetail'))
const VinamilkDetail = lazy(() => import('./pages/VinamilkDetail'))
const Admin = lazy(() => import('./pages/Admin'))

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
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<SignUpPage />} />
            <Route path='/verify-account' element={<VerifyAccount />} />

            {/* Protected Routes - All authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/fpt' element={<FPTDetail />} />
              <Route path='/vinamilk' element={<VinamilkDetail />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path='/admin' element={<Admin />} />
            </Route>

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
