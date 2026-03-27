# Frontend Application

Frontend application for RAG (Retrieval-Augmented Generation) system built with React and TypeScript.

## 🎯 Phase 7: Documentation Complete

This project has been fully refactored with comprehensive documentation:

- ✅ **JSDoc Comments**: All service classes and methods documented
- ✅ **Type Documentation**: All type definitions documented with examples
- ✅ **Architecture Guide**: Complete system architecture documentation
- ✅ **Import Patterns**: Barrel export patterns and best practices
- ✅ **Code Quality**: TypeScript, ESLint, and Prettier all passing

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [IMPORT_PATTERNS.md](./IMPORT_PATTERNS.md) for detailed documentation.

## 📋 Prerequisites

- **Node.js**: Version >= 20.0.0 and < 21.0.0
- **npm**: Version 8+ (comes with Node.js)

## 🚀 Getting Started

### Installation

1. Clone the repository and navigate to the frontend directory:

```bash
cd FE
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🛠️ Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build the application for production     |
| `npm run preview`      | Preview the production build locally     |
| `npm run lint`         | Run ESLint to check code quality         |
| `npm run lint:fix`     | Run ESLint and automatically fix issues  |
| `npm run prettier`     | Check code formatting with Prettier      |
| `npm run prettier:fix` | Format code with Prettier                |

## 🏗️ Tech Stack

- **React**: ^19.2.0 - UI library
- **TypeScript**: ~5.9.3 - Type safety
- **Vite**: 7.2.5 (Rolldown) - Build tool and dev server
- **Tailwind CSS**: ^4.0.0 - Utility-first CSS framework
- **Shadcn/UI**: Component library built on Radix UI and Tailwind CSS
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting

## 📁 Project Structure

```
FE/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, icons, etc.
│   ├── components/  # Reusable UI components (Shadcn/UI)
│   ├── context/     # React context providers
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utility functions and configurations
│   ├── pages/       # Page components
│   ├── services/    # Business logic layer
│   │   ├── api/     # HTTP API layer
│   │   └── index.ts # Barrel export
│   ├── types/       # TypeScript type definitions
│   ├── App.tsx      # Main application component
│   ├── main.tsx     # Application entry point
│   └── index.css    # Global styles with Tailwind CSS
├── components.json  # Shadcn/UI configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── package.json     # Dependencies and scripts
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── ARCHITECTURE.md  # System architecture documentation
├── IMPORT_PATTERNS.md # Import patterns and best practices
└── README.md        # This file
```

## 🏗️ Architecture

The application follows a **layered architecture** with clear separation of concerns:

1. **UI Layer** (`components/`, `pages/`) - React components and pages
2. **Hooks Layer** (`hooks/`) - Custom hooks connecting UI to services
3. **Service Layer** (`services/`) - Business logic and data transformation
4. **API Layer** (`services/api/`) - HTTP requests and response handling
5. **HTTP Client** (`lib/axios.ts`) - Configured Axios instance

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.**

## 📦 Import Patterns

This project uses **barrel exports** for clean, maintainable imports:

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

**See [IMPORT_PATTERNS.md](./IMPORT_PATTERNS.md) for detailed import guidelines.**

## 📁 Project Structure

## 🎨 Styling & Components

### Tailwind CSS

This project uses Tailwind CSS v4 with:

- **Utility-first approach**: Use utility classes for rapid UI development
- **Custom design system**: Pre-configured colors, spacing, and typography
- **Dark mode support**: Automatic light/dark theme switching
- **Responsive design**: Mobile-first responsive utilities

Example usage:

```tsx
<div className='bg-background text-foreground p-4 rounded-lg shadow-md'>
  <h1 className='text-2xl font-bold text-primary'>Hello World</h1>
</div>
```

### Shadcn/UI Components

Pre-built, accessible components ready to use:

- **Button**: Various styles and sizes
- **Card**: Content containers
- **Input**: Form inputs with validation
- **Dialog**: Modal dialogs
- **And many more...**

Example usage:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant='default'>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Adding New Components

To add new Shadcn/UI components:

```bash
npx shadcn@latest add [component-name]
```

## 🔧 Services

The application includes 8 main services for different features:

### Admin Service
```typescript
import { adminService } from '@/services'

// Get users
const users = await adminService.getUsers({ page: 1, pageSize: 10 })

// Get system statistics
const stats = await adminService.getSystemStatistics()
```

### Auth Service
```typescript
import { authService } from '@/services'

// Register user
await authService.register({ email, password, fullName })

// Login
const result = await authService.login({ email, password })

// Check authentication
if (authService.isAuthenticated()) {
  console.log('User is logged in')
}
```

### Chat Service
```typescript
import { chatService } from '@/services'

// Create session
const session = await chatService.createSession({ analyticsTypeId, title })

// Ask question (async recommended)
const result = await chatService.askQuestionAsync({ sessionId, questionText })
```

### Reports Service
```typescript
import { reportsService } from '@/services'

// Get reports
const reports = await reportsService.getMyReports({ page: 1, pageSize: 10 })

// Upload report (async recommended)
const result = await reportsService.uploadReportAsync({ file, companyId, ... })
```

### Analytics Service
```typescript
import { analyticsService } from '@/services'

// Get analytics types
const types = await analyticsService.getAnalyticsTypes()

// Generate report (async recommended)
const result = await analyticsService.generateReportAsync({ sessionId, title })
```

### Companies Service
```typescript
import { companiesService } from '@/services'

// Get companies
const companies = await companiesService.getCompanies({ page: 1, pageSize: 10 })

// Get company details
const company = await companiesService.getCompanyDetail(companyId)
```

### Metrics Service
```typescript
import { metricsService } from '@/services'

// Get metrics groups
const groups = await metricsService.getMetricsGroups()

// Get metric values
const values = await metricsService.getMetricValues(reportId)
```

### Jobs Service
```typescript
import { jobsService } from '@/services'

// Poll for job completion
const result = await jobsService.pollJobStatus(jobId, (progress) => {
  console.log(`Progress: ${progress}%`)
})
```

**See individual service files for complete method documentation.**

## 🔧 Configuration

### Tailwind CSS

The project is configured with Tailwind CSS v4 for utility-first styling:

- Configuration: `tailwind.config.ts`
- Global styles: `src/index.css`
- Includes custom color scheme with light/dark mode support
- Pre-configured with design tokens for consistent theming

### Shadcn/UI

Component library setup with:

- Pre-built accessible components
- Customizable design system
- Built on Radix UI primitives
- Fully integrated with Tailwind CSS theming

### ESLint

The project uses ESLint with TypeScript and React-specific rules. Configuration is in `eslint.config.js`.

### Prettier

Code formatting rules are defined in `.prettierrc`.

### TypeScript

TypeScript configuration is split across multiple files:

- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Node.js-specific settings

## 📚 Documentation

### Architecture & Design

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture with layer descriptions and data flow
- **[IMPORT_PATTERNS.md](./IMPORT_PATTERNS.md)** - Import patterns, barrel exports, and best practices

### Service Documentation

All services include comprehensive JSDoc comments:

- **adminService** - User management, system statistics, report categories, analytics types
- **authService** - Registration, login, logout, token management, role checking
- **chatService** - Chat sessions, question asking, chat history
- **companiesService** - Company CRUD operations
- **reportsService** - Report management, upload, search, download
- **analyticsService** - Analytics types, report generation
- **metricsService** - Metrics groups, definitions, values, calculations
- **jobsService** - Background job status polling and result retrieval

### Type Documentation

All type definitions include JSDoc comments with examples:

- **common.types** - Shared types (ApiResponse, PaginatedResponse, etc.)
- **auth.types** - Authentication types and interfaces
- **admin.types** - Admin management types
- **chat.types** - Chat session and message types
- **companies.types** - Company types
- **reports.types** - Report types
- **analytics.types** - Analytics types
- **metrics.types** - Metrics types
- **jobs.types** - Background job types

## 🤝 Contributing

1. Ensure your Node.js version is >= 20.0.0 and < 21.0.0
2. Install dependencies: `npm install`
3. Run linting: `npm run lint`
4. Run formatting: `npm run prettier`
5. Test your changes: `npm run dev`

## 📝 Notes

- This project uses Rolldown-Vite as the build tool for improved performance
- React 19.2.0 includes the latest features and improvements
- All code should follow the ESLint and Prettier configurations
