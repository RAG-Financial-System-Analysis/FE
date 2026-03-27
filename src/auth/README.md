# 🔐 Authentication System Implementation

This document describes the authentication system implementation for the React Frontend, based on the exact API specification from the backend.

## 📁 File Structure

```
src/
├── types/
│   └── auth.types.ts           # TypeScript interfaces for auth
├── services/
│   └── auth.service.ts         # API service for authentication
├── context/
│   └── AuthContext.tsx         # React context for auth state
├── hooks/
│   ├── useAuthActions.ts       # Hook for auth actions (login, register, etc.)
│   ├── useRoleGuard.ts         # Hook for role-based access control
│   └── index.ts                # Hooks exports
├── components/
│   └── auth/
│       ├── RegisterForm.tsx    # Registration form component
│       ├── VerifyAccountForm.tsx # Account verification form
│       ├── LoginForm.tsx       # Login form component
│       ├── ProtectedRoute.tsx  # Route protection component
│       └── index.ts            # Auth components exports
├── lib/
│   └── axios.ts                # Axios configuration with interceptors
└── pages/
    └── AuthExample.tsx         # Example usage page
```

## 🚀 Quick Start

### 1. Setup AuthProvider

Wrap your app with the AuthProvider:

```tsx
import { AuthProvider } from '@/context/AuthContext'

function App() {
  return <AuthProvider>{/* Your app components */}</AuthProvider>
}
```

### 2. Use Authentication in Components

```tsx
import { useAuth } from '@/context/AuthContext'
import { useAuthActions } from '@/hooks/useAuthActions'
import { useRoleGuard } from '@/hooks/useRoleGuard'

function MyComponent() {
  const { isAuthenticated, user, role } = useAuth()
  const { login, logout } = useAuthActions()
  const { isAdmin, canAccessAdminRoutes } = useRoleGuard()

  // Your component logic
}
```

### 3. Protect Routes

```tsx
import { ProtectedRoute, AdminRoute, AnalystRoute } from '@/components/auth'

// Protect any route
<ProtectedRoute allowedRoles={['Admin', 'Analyst']}>
  <Dashboard />
</ProtectedRoute>

// Admin only route
<AdminRoute>
  <AdminPanel />
</AdminRoute>

// Admin or Analyst route
<AnalystRoute>
  <ReportsPage />
</AnalystRoute>
```

## 🔧 API Integration

### Authentication Flow

The implementation follows the exact API specification:

1. **Register** → `POST /api/Auth/register`
2. **Verify Account** → `POST /api/Auth/verify-account`
3. **Login** → `POST /api/Auth/login`
4. **Logout** → `POST /api/Auth/logout`

### Request/Response Format

All requests and responses use **PascalCase** to match the C# backend:

```typescript
// Request
{
  "Email": "user@example.com",
  "Password": "Password123!",
  "FullName": "Nguyen Van A"
}

// Response
{
  "AccessToken": "jwt_token_here",
  "IdToken": "id_token_here",
  "RefreshToken": "refresh_token_here",
  "Role": "Analyst",
  "FullName": "Nguyen Van A"
}
```

### Role System

Two roles are supported:

- **Admin**: Full access to all features
- **Analyst**: Limited access, cannot access admin endpoints

## 🛡️ Security Features

### Token Management

- Access tokens stored in localStorage
- Automatic token inclusion in API requests
- Token cleanup on logout
- 401 response handling with automatic logout

### Route Protection

- Role-based route access control
- Automatic redirects for unauthorized access
- Loading states during authentication checks

### Error Handling

- Comprehensive error messages
- User-friendly Vietnamese error messages
- Automatic error clearing on user input

## 📝 Usage Examples

### Registration Flow

```tsx
import { RegisterForm } from '@/components/auth'

function RegisterPage() {
  return <RegisterForm />
}
```

### Login Flow

```tsx
import { LoginForm } from '@/components/auth'

function LoginPage() {
  return <LoginForm />
}
```

### Custom Authentication Logic

```tsx
import { useAuthActions } from '@/hooks/useAuthActions'

function CustomLogin() {
  const { login, isLoggingIn, error } = useAuthActions()

  const handleLogin = async () => {
    const result = await login({
      Email: 'user@example.com',
      Password: 'password123'
    })

    if (result.success) {
      // Redirect based on role
      if (result.role === 'Admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <button onClick={handleLogin} disabled={isLoggingIn}>
      {isLoggingIn ? 'Logging in...' : 'Login'}
    </button>
  )
}
```

### Role-Based UI

```tsx
import { useRoleGuard } from '@/hooks/useRoleGuard'

function Navigation() {
  const { shouldShowAdminFeatures, shouldShowAnalystFeatures } = useRoleGuard()

  return (
    <nav>
      {shouldShowAnalystFeatures && <Link to='/reports'>Reports</Link>}
      {shouldShowAdminFeatures && <Link to='/admin/users'>User Management</Link>}
    </nav>
  )
}
```

## 🔄 State Management

The authentication state is managed through React Context and includes:

```typescript
interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
}
```

## 🌐 Environment Configuration

Update your `.env.local` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_KEY=your_api_key_here
```

## 🚨 Error Handling

Common error scenarios and their handling:

- **401 Unauthorized**: Automatic logout and redirect to login
- **403 Forbidden**: Redirect to unauthorized page
- **Network errors**: User-friendly error messages
- **Validation errors**: Field-specific error display

## 🧪 Testing

To test the authentication system:

1. Start the backend server
2. Use the `AuthExample` page to verify all functionality
3. Test different user roles (Admin vs Analyst)
4. Verify route protection works correctly

## 📚 API Reference

For complete API documentation, see:

- `code/FE_WEB_API_INTEGRATION_GUIDE.md`

## 🔗 Related Files

- Backend API specification: `code/FE_WEB_API_INTEGRATION_GUIDE.md`
- Environment configuration: `code/FE/.env.local`
- Axios configuration: `code/FE/src/lib/axios.ts`
