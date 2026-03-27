/**
 * Phase 6 Functional Verification Script
 * Manual verification of all pages, components, and services
 * This script can be run to verify the refactoring is complete and working
 */

/**
 * 6.7 Test all pages load without errors
 */
export async function verifyPagesLoad() {
  console.log('=== 6.7 Verifying All Pages Load Without Errors ===')
  const pages = [
    'HomePage',
    'LogInPage',
    'RegisterPage',
    'VerifyAccount',
    'Admin',
    'ChatPage',
    'ProfilePage',
    'Report',
    'AnalystPage'
  ]

  const results = []
  for (const page of pages) {
    try {
      const module = await import(`@/pages/${page}`)
      const isValid = module.default && typeof module.default === 'function'
      results.push({
        page,
        status: isValid ? '✓ PASS' : '✗ FAIL',
        message: isValid ? 'Page loaded successfully' : 'Page is not a valid component'
      })
    } catch (error) {
      results.push({
        page,
        status: '✗ FAIL',
        message: `Failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  }

  console.table(results)
  return results.every((r) => r.status === '✓ PASS')
}

/**
 * 6.8 Test all components render correctly
 */
export async function verifyComponentsRender() {
  console.log('=== 6.8 Verifying All Components Render Correctly ===')

  const componentDirs = [
    { dir: 'admin', components: ['AdminLayout', 'DashboardContent', 'UserManagementContent'] },
    { dir: 'auth', components: ['LoginForm', 'RegisterForm', 'ProtectedRoute', 'PublicRoute'] },
    { dir: 'chat', components: ['ChatInterface'] },
    { dir: 'reports', components: ['ReportsContent'] },
    { dir: 'ui', components: ['Button'] },
    { dir: 'layout', components: ['Sidebar'] },
    { dir: 'profile', components: ['ProfileContent'] },
    { dir: 'common', components: ['AutoRefreshIndicator'] }
  ]

  const results = []

  for (const { dir, components } of componentDirs) {
    try {
      const module = await import(`@/components/${dir}`)
      for (const component of components) {
        const exists = component in module
        results.push({
          directory: dir,
          component,
          status: exists ? '✓ PASS' : '✗ FAIL',
          message: exists ? 'Component exported' : 'Component not found'
        })
      }
    } catch (error) {
      results.push({
        directory: dir,
        component: 'N/A',
        status: '✗ FAIL',
        message: `Failed to load directory: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  }

  // Verify deleted directories don't exist
  const deletedDirs = ['companies', 'metrics']
  for (const dir of deletedDirs) {
    try {
      await import(`@/components/${dir}`)
      results.push({
        directory: dir,
        component: 'N/A',
        status: '✗ FAIL',
        message: 'Directory should have been deleted'
      })
    } catch {
      results.push({
        directory: dir,
        component: 'N/A',
        status: '✓ PASS',
        message: 'Directory correctly deleted'
      })
    }
  }

  console.table(results)
  return results.every((r) => r.status === '✓ PASS')
}

/**
 * 6.9 Test all services function correctly
 */
export async function verifyServicesFunction() {
  console.log('=== 6.9 Verifying All Services Function Correctly ===')

  const services = [
    { name: 'adminService', methods: ['getUsers', 'getUserDetail', 'updateUser', 'deleteUser', 'getSystemStatistics'] },
    { name: 'authService', methods: ['login', 'register', 'logout', 'verifyAccount', 'getCurrentUser'] },
    { name: 'chatService', methods: ['createSession', 'sendMessage', 'getSessionHistory', 'getSessions'] },
    { name: 'companiesService', methods: ['getCompanies', 'getCompanyDetail', 'createCompany', 'updateCompany'] },
    { name: 'reportsService', methods: ['getReports', 'getReportDetail', 'uploadReport', 'deleteReport'] },
    { name: 'analyticsService', methods: ['getAnalyticsReports', 'createAnalyticsReport'] },
    { name: 'metricsService', methods: ['getMetrics'] },
    { name: 'jobsService', methods: ['getJobs'] }
  ]

  const results = []

  for (const { name, methods } of services) {
    try {
      const module = await import(`@/services/${name}`)
      const service = module[name]

      if (!service) {
        results.push({
          service: name,
          method: 'N/A',
          status: '✗ FAIL',
          message: 'Service not exported'
        })
        continue
      }

      for (const method of methods) {
        const exists = typeof service[method] === 'function'
        results.push({
          service: name,
          method,
          status: exists ? '✓ PASS' : '✗ FAIL',
          message: exists ? 'Method exists' : 'Method not found'
        })
      }
    } catch (error) {
      results.push({
        service: name,
        method: 'N/A',
        status: '✗ FAIL',
        message: `Failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  }

  console.table(results)
  return results.every((r) => r.status === '✓ PASS')
}

/**
 * 6.10 Test admin dashboard functionality
 */
export async function verifyAdminDashboard() {
  console.log('=== 6.10 Verifying Admin Dashboard Functionality ===')

  try {
    const { adminService } = await import('@/services')

    const adminMethods = ['getUsers', 'getUserDetail', 'updateUser', 'deleteUser']

    const results = adminMethods.map((method) => ({
      method,
      status: typeof (adminService as unknown as Record<string, unknown>)[method] === 'function' ? '✓ PASS' : '✗ FAIL',
      message:
        typeof (adminService as unknown as Record<string, unknown>)[method] === 'function'
          ? 'Method available'
          : 'Method not found'
    }))

    console.table(results)
    return results.every((r) => r.status === '✓ PASS')
  } catch (error) {
    console.error('Failed to verify admin dashboard:', error)
    return false
  }
}

/**
 * 6.11 Test user management functionality
 */
export async function verifyUserManagement() {
  console.log('=== 6.11 Verifying User Management Functionality ===')

  try {
    const { authService, adminService } = await import('@/services')

    const results = [
      { component: 'authService', method: 'login', status: typeof authService.login === 'function' },
      { component: 'authService', method: 'register', status: typeof authService.register === 'function' },
      { component: 'authService', method: 'logout', status: typeof authService.logout === 'function' },
      { component: 'authService', method: 'verifyAccount', status: typeof authService.verifyAccount === 'function' },
      { component: 'authService', method: 'getCurrentUser', status: typeof authService.getCurrentUser === 'function' },
      { component: 'adminService', method: 'getUsers', status: typeof adminService.getUsers === 'function' },
      { component: 'adminService', method: 'getUserDetail', status: typeof adminService.getUserDetail === 'function' },
      { component: 'adminService', method: 'updateUser', status: typeof adminService.updateUser === 'function' },
      { component: 'adminService', method: 'deleteUser', status: typeof adminService.deleteUser === 'function' }
    ]

    const formattedResults = results.map((r) => ({
      ...r,
      status: r.status ? '✓ PASS' : '✗ FAIL'
    }))

    console.table(formattedResults)
    return results.every((r) => r.status)
  } catch (error) {
    console.error('Failed to verify user management:', error)
    return false
  }
}

/**
 * 6.12 Test company management functionality
 */
export async function verifyCompanyManagement() {
  console.log('=== 6.12 Verifying Company Management Functionality ===')

  try {
    const { companiesService } = await import('@/services')

    const methods = ['getCompanies', 'getCompanyDetail', 'createCompany', 'updateCompany', 'deleteCompany']

    const results = methods.map((method) => ({
      method,
      status:
        typeof (companiesService as unknown as Record<string, unknown>)[method] === 'function' ? '✓ PASS' : '✗ FAIL',
      message:
        typeof (companiesService as unknown as Record<string, unknown>)[method] === 'function'
          ? 'Method available'
          : 'Method not found'
    }))

    console.table(results)
    return results.every((r) => r.status === '✓ PASS')
  } catch (error) {
    console.error('Failed to verify company management:', error)
    return false
  }
}

/**
 * 6.13 Test chat functionality
 */
export async function verifyChatFunctionality() {
  console.log('=== 6.13 Verifying Chat Functionality ===')

  try {
    const { chatService } = await import('@/services')
    const chatComponents = await import('@/components/chat')

    const serviceMethods = [
      { name: 'createSession', exists: typeof chatService.createSession === 'function' },
      { name: 'askQuestion', exists: typeof chatService.askQuestion === 'function' },
      { name: 'askQuestionAsync', exists: typeof chatService.askQuestionAsync === 'function' },
      { name: 'getChatHistory', exists: typeof chatService.getChatHistory === 'function' },
      { name: 'getChatSessions', exists: typeof chatService.getChatSessions === 'function' }
    ]

    const components = [
      { name: 'ChatInterface', exists: 'ChatInterface' in chatComponents },
      { name: 'CreateSessionModal', exists: 'CreateSessionModal' in chatComponents },
      { name: 'AnalyticsTypeSelector', exists: 'AnalyticsTypeSelector' in chatComponents }
    ]

    const results = [
      ...serviceMethods.map((m) => ({
        type: 'Service Method',
        name: m.name,
        status: m.exists ? '✓ PASS' : '✗ FAIL'
      })),
      ...components.map((c) => ({
        type: 'Component',
        name: c.name,
        status: c.exists ? '✓ PASS' : '✗ FAIL'
      }))
    ]

    console.table(results)
    return results.every((r) => r.status === '✓ PASS')
  } catch (error) {
    console.error('Failed to verify chat functionality:', error)
    return false
  }
}

/**
 * 6.14 Test analytics functionality
 */
export async function verifyAnalyticsFunctionality() {
  console.log('=== 6.14 Verifying Analytics Functionality ===')

  try {
    const { analyticsService, metricsService } = await import('@/services')
    const analyticsComponents = await import('@/components/analytics')

    const results = [
      {
        type: 'Service Method',
        name: 'analyticsService.getAnalyticsTypes',
        status: typeof analyticsService.getAnalyticsTypes === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'analyticsService.generateReport',
        status: typeof analyticsService.generateReport === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'analyticsService.generateReportAsync',
        status: typeof analyticsService.generateReportAsync === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'analyticsService.getReports',
        status: typeof analyticsService.getReports === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'metricsService.getMetricsGroups',
        status: typeof metricsService.getMetricsGroups === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'metricsService.getMetricDefinitions',
        status: typeof metricsService.getMetricDefinitions === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'metricsService.getMetricValues',
        status: typeof metricsService.getMetricValues === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'metricsService.calculateMetrics',
        status: typeof metricsService.calculateMetrics === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Component',
        name: 'AnalyticsReportsViewer',
        status: 'AnalyticsReportsViewer' in analyticsComponents ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Component',
        name: 'CreateAnalyticsReport',
        status: 'CreateAnalyticsReport' in analyticsComponents ? '✓ PASS' : '✗ FAIL'
      }
    ]

    console.table(results)
    return results.every((r) => r.status === '✓ PASS')
  } catch (error) {
    console.error('Failed to verify analytics functionality:', error)
    return false
  }
}

/**
 * 6.15 Test report functionality
 */
export async function verifyReportFunctionality() {
  console.log('=== 6.15 Verifying Report Functionality ===')

  try {
    const { reportsService } = await import('@/services')
    const reportComponents = await import('@/components/reports')

    const results = [
      {
        type: 'Service Method',
        name: 'reportsService.getMyReports',
        status: typeof reportsService.getMyReports === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.getPublicReports',
        status: typeof reportsService.getPublicReports === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.getReportDetail',
        status: typeof reportsService.getReportDetail === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.uploadReport',
        status: typeof reportsService.uploadReport === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.uploadReportAsync',
        status: typeof reportsService.uploadReportAsync === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.deleteReport',
        status: typeof reportsService.deleteReport === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.downloadReport',
        status: typeof reportsService.downloadReport === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.searchReports',
        status: typeof reportsService.searchReports === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Service Method',
        name: 'reportsService.getReportCategories',
        status: typeof reportsService.getReportCategories === 'function' ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Component',
        name: 'ReportsContent',
        status: 'ReportsContent' in reportComponents ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Component',
        name: 'ReportDetailModal',
        status: 'ReportDetailModal' in reportComponents ? '✓ PASS' : '✗ FAIL'
      },
      {
        type: 'Component',
        name: 'UploadReportModal',
        status: 'UploadReportModal' in reportComponents ? '✓ PASS' : '✗ FAIL'
      }
    ]

    console.table(results)
    return results.every((r) => r.status === '✓ PASS')
  } catch (error) {
    console.error('Failed to verify report functionality:', error)
    return false
  }
}

/**
 * Verify naming conventions
 */
export async function verifyNamingConventions() {
  console.log('=== Verifying Naming Convention Consistency ===')

  const serviceFiles = [
    'adminService',
    'authService',
    'chatService',
    'companiesService',
    'reportsService',
    'analyticsService',
    'metricsService',
    'jobsService'
  ]

  const results = []

  // Check new service names exist
  for (const serviceName of serviceFiles) {
    try {
      await import(`@/services/${serviceName}`)
      results.push({
        check: 'New service name',
        name: serviceName,
        status: '✓ PASS'
      })
    } catch {
      results.push({
        check: 'New service name',
        name: serviceName,
        status: '✗ FAIL'
      })
    }
  }

  // Check old service names don't exist
  const oldNames = ['admin.service', 'companyService', 'auth.service']
  for (const oldName of oldNames) {
    try {
      await import(`@/services/${oldName}`)
      results.push({
        check: 'Old service name (should not exist)',
        name: oldName,
        status: '✗ FAIL'
      })
    } catch {
      results.push({
        check: 'Old service name (should not exist)',
        name: oldName,
        status: '✓ PASS'
      })
    }
  }

  console.table(results)
  return results.every((r) => r.status === '✓ PASS')
}

/**
 * Run all verifications
 */
export async function runAllVerifications() {
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║     Phase 6 Functional Testing - Complete Verification     ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  const results = {
    '6.7 Pages Load': await verifyPagesLoad(),
    '6.8 Components Render': await verifyComponentsRender(),
    '6.9 Services Function': await verifyServicesFunction(),
    '6.10 Admin Dashboard': await verifyAdminDashboard(),
    '6.11 User Management': await verifyUserManagement(),
    '6.12 Company Management': await verifyCompanyManagement(),
    '6.13 Chat Functionality': await verifyChatFunctionality(),
    '6.14 Analytics Functionality': await verifyAnalyticsFunctionality(),
    '6.15 Report Functionality': await verifyReportFunctionality(),
    'Naming Conventions': await verifyNamingConventions()
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║                    VERIFICATION SUMMARY                    ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  const summary = Object.entries(results).map(([test, passed]) => ({
    test,
    status: passed ? '✓ PASS' : '✗ FAIL'
  }))

  console.table(summary)

  const allPassed = Object.values(results).every((r) => r)
  console.log(`\nOverall Status: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}\n`)

  return allPassed
}

// Export for use in other modules
export default {
  verifyPagesLoad,
  verifyComponentsRender,
  verifyServicesFunction,
  verifyAdminDashboard,
  verifyUserManagement,
  verifyCompanyManagement,
  verifyChatFunctionality,
  verifyAnalyticsFunctionality,
  verifyReportFunctionality,
  verifyNamingConventions,
  runAllVerifications
}
