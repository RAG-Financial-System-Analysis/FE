# FE-Web Architecture Documentation

## Overview

The FE-Web application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│              (UI Layer - Pages & Components)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Custom Hooks                              │
│         (useAdmin, useChat, useAnalytics, etc.)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
│    (Business Logic & Data Transformation)                    │
│  - adminService                                              │
│  - authService                                               │
│  - chatService                                               │
│  - companiesService                                          │
│  - reportsService                                            │
│  - analyticsService                                          │
│  - metricsService                                            │
│  - jobsService                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                 │
│         (HTTP Requests & Response Handling)                  │
│  - adminApi                                                  │
│  - authApi                                                   │
│  - chatApi                                                   │
│  - companiesApi                                              │
│  - reportsApi                                                │
│  - analyticsApi                                              │
│  - metricsApi                                                │
│  - jobsApi                                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Axios HTTP Client                           │
│         (Configured with interceptors & auth)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend API                                │
│              (REST Endpoints)                                │
└─────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### 1. UI Layer (Components & Pages)

**Location**: `src/components/`, `src/pages/`

**Responsibility**: 
- Render user interface
- Handle user interactions
- Display data from services
- Manage local component state

**Key Directories**:
- `src/components/admin/` - Admin dashboard components
- `src/components/analyst/` - Analyst-specific components
- `src/components/analytics/` - Analytics feature components
- `src/components/auth/` - Authentication components
- `src/components/chat/` - Chat interface components
- `src/components/reports/` - Report management components
- `src/components/layout/` - Layout components (Sidebar, Header)
- `src/components/ui/` - Shadcn/UI components

### 2. Custom Hooks Layer

**Location**: `src/hooks/`

**Responsibility**:
- Encapsulate service calls
- Manage loading and error states
- Provide data to components
- Handle side effects

**Available Hooks**:
- `useAdmin()` - Admin operations
- `useChat()` - Chat functionality
- `useAnalytics()` - Analytics operations
- `useReports()` - Report management
- `useCompanies()` - Company management
- `useMetrics()` - Metrics operations
- `useAuthActions()` - Authentication actions
- `useRoleGuard()` - Role-based access control

### 3. Service Layer

**Location**: `src/services/`

**Responsibility**:
- Business logic implementation
- Data transformation
- Service orchestration
- Error handling

**Services**:

#### adminService
- User management (get, update, delete)
- System statistics
- Report categories management
- Analytics types management
- S3 configuration testing

#### authService
- User registration
- Account verification
- User login/logout
- Token management
- Role checking utilities

#### chatService
- Chat session creation
- Question asking (sync & async)
- Chat history retrieval
- Session management

#### companiesService
- Company list retrieval
- Company details
- Company CRUD operations (admin only)

#### reportsService
- Report retrieval (personal & public)
- Report upload (sync & async)
- Report visibility management
- Report search
- Report download

#### analyticsService
- Analytics types retrieval
- Report generation (sync & async)
- Analytics reports retrieval

#### metricsService
- Metrics groups retrieval
- Metric definitions
- Metric values extraction
- Custom metrics calculation

#### jobsService
- Job status polling
- Job result retrieval
- Long-running operation management

### 4. API Layer

**Location**: `src/services/api/`

**Responsibility**:
- HTTP request construction
- Response parsing
- Error handling
- Request/response transformation

**API Modules**:
- `adminApi.ts` - Admin endpoints
- `authApi.ts` - Authentication endpoints
- `chatApi.ts` - Chat endpoints
- `companiesApi.ts` - Company endpoints
- `reportsApi.ts` - Report endpoints
- `analyticsApi.ts` - Analytics endpoints
- `metricsApi.ts` - Metrics endpoints
- `jobsApi.ts` - Job endpoints

### 5. HTTP Client

**Location**: `src/lib/axios.ts`

**Responsibility**:
- Axios instance configuration
- Request/response interceptors
- Authentication token injection
- Error handling

## Data Flow

### Typical Request Flow

```
Component
    ↓
Custom Hook (useAdmin, useChat, etc.)
    ↓
Service (adminService, chatService, etc.)
    ↓
API Layer (adminApi, chatApi, etc.)
    ↓
Axios HTTP Client
    ↓
Backend API
    ↓
Response → API Layer → Service → Hook → Component
```

### Example: Fetching Users

```typescript
// 1. Component calls hook
const { users, loading } = useAdmin()

// 2. Hook calls service
const response = await adminService.getUsers({ page: 1, pageSize: 10 })

// 3. Service calls API
const response = await adminApi.getUsers(params)

// 4. API makes HTTP request
const response = await axiosInstance.get('/admin/users', { params })

// 5. Response flows back through layers
// API Layer → Service → Hook → Component
```

## Type System

**Location**: `src/types/`

**Type Files**:
- `common.types.ts` - Shared types (ApiResponse, PaginatedResponse, etc.)
- `auth.types.ts` - Authentication types
- `admin.types.ts` - Admin types
- `chat.types.ts` - Chat types
- `companies.types.ts` - Company types
- `reports.types.ts` - Report types
- `analytics.types.ts` - Analytics types
- `metrics.types.ts` - Metrics types
- `jobs.types.ts` - Job types
- `user.types.ts` - User profile types

**Import Pattern**:
```typescript
import type { User, GetUsersRequest } from '@/types'
```

## Context & State Management

**Location**: `src/context/`

**Available Contexts**:
- `AuthContext` - Authentication state
- `AuthProvider` - Authentication provider component

**Usage**:
```typescript
import { useContext } from 'react'
import { AuthContext } from '@/context'

function MyComponent() {
  const { user, isAuthenticated } = useContext(AuthContext)
  // ...
}
```

## Import Patterns

### Barrel Exports

All modules use barrel exports for clean imports:

```typescript
// ✅ Good - Using barrel exports
import { adminService, authService } from '@/services'
import { Button, Card } from '@/components/ui'
import { useAdmin, useChat } from '@/hooks'
import type { User, Report } from '@/types'

// ❌ Avoid - Deep imports
import { adminService } from '@/services/adminService'
import { Button } from '@/components/ui/button'
```

### Import Paths

- `@/services` - Service layer
- `@/services/api` - API layer
- `@/components` - UI components
- `@/hooks` - Custom hooks
- `@/context` - Context providers
- `@/types` - Type definitions
- `@/lib` - Utility functions
- `@/pages` - Page components

## Async Operations

### Long-Running Operations

For operations that take longer than 30 seconds (API Gateway timeout):

1. **Use Async Methods**: Always use async variants
   ```typescript
   // ✅ Good
   const result = await reportsService.uploadReportAsync(data)
   
   // ❌ Avoid
   const result = await reportsService.uploadReport(data)
   ```

2. **Poll for Results**: Use jobsService to poll
   ```typescript
   const result = await jobsService.pollJobStatus(jobId, (progress) => {
     console.log(`Progress: ${progress}%`)
   })
   ```

3. **Handle Timeouts**: Set appropriate timeout values
   ```typescript
   const result = await jobsService.pollJobStatus(jobId, undefined, 60) // 60 minutes
   ```

## Error Handling

### Service Layer Error Handling

Services throw errors that should be caught by hooks or components:

```typescript
try {
  const users = await adminService.getUsers()
} catch (error) {
  console.error('Failed to fetch users:', error.message)
}
```

### Hook Error Handling

Hooks should manage error state:

```typescript
const useAdmin = () => {
  const [error, setError] = useState<string | null>(null)
  
  const getUsers = async () => {
    try {
      return await adminService.getUsers()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }
  
  return { getUsers, error }
}
```

## Authentication Flow

1. **Registration**: User registers with email, password, and name
2. **Verification**: User verifies email with confirmation code
3. **Login**: User logs in with email and password
4. **Token Storage**: Tokens stored in localStorage
5. **API Requests**: Tokens automatically injected via axios interceptor
6. **Logout**: Tokens cleared from localStorage

## Role-Based Access Control

Two roles available:
- **Admin**: Full system access
- **Analyst**: Limited access to analytics and reports

Check roles using authService:
```typescript
if (authService.isAdmin()) {
  // Show admin features
}

if (authService.hasRole(['Admin', 'Analyst'])) {
  // Show features for both roles
}
```

## Best Practices

1. **Always use barrel exports** for imports
2. **Use async variants** for long-running operations
3. **Handle errors** at component or hook level
4. **Type everything** - use TypeScript types
5. **Keep components focused** on UI rendering
6. **Keep services focused** on business logic
7. **Use hooks** to connect components to services
8. **Poll jobs** for long-running operations
9. **Clear tokens** on logout
10. **Validate user roles** before showing features

## File Structure

```
src/
├── components/          # UI components
│   ├── admin/          # Admin components
│   ├── analyst/        # Analyst components
│   ├── analytics/      # Analytics components
│   ├── auth/           # Auth components
│   ├── chat/           # Chat components
│   ├── common/         # Common components
│   ├── layout/         # Layout components
│   ├── profile/        # Profile components
│   ├── reports/        # Report components
│   ├── ui/             # Shadcn/UI components
│   └── index.ts        # Barrel export
├── context/            # React context
│   ├── AuthContext.tsx
│   ├── AuthProvider.tsx
│   └── index.ts
├── hooks/              # Custom hooks
│   ├── useAdmin.ts
│   ├── useChat.ts
│   ├── useAnalytics.ts
│   └── index.ts
├── lib/                # Utilities
│   ├── axios.ts        # HTTP client
│   ├── utils.ts        # Helper functions
│   └── index.ts
├── pages/              # Page components
│   ├── Admin.tsx
│   ├── ChatPage.tsx
│   └── index.ts
├── services/           # Business logic
│   ├── api/            # API layer
│   │   ├── adminApi.ts
│   │   ├── authApi.ts
│   │   └── index.ts
│   ├── adminService.ts
│   ├── authService.ts
│   └── index.ts
├── types/              # Type definitions
│   ├── common.types.ts
│   ├── auth.types.ts
│   ├── admin.types.ts
│   └── index.ts
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Related Documentation

- See [IMPORT_PATTERNS.md](./IMPORT_PATTERNS.md) for detailed import guidelines
- See individual service files for method documentation
- See type files for interface documentation
