import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - separate large libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor'
            }
            // Other node_modules go to vendor chunk
            return 'vendor'
          }
          // Page chunks - split by route
          if (id.includes('src/pages/HomePage')) {
            return 'home'
          }
          if (
            id.includes('src/pages/LogInPage') ||
            id.includes('src/pages/SignUpPage') ||
            id.includes('src/pages/VerifyAccount')
          ) {
            return 'auth'
          }
          if (id.includes('src/pages/Dashboard')) {
            return 'dashboard'
          }
          if (id.includes('src/pages/FPTDetail') || id.includes('src/pages/VinamilkDetail')) {
            return 'company-details'
          }
          if (id.includes('src/pages/Admin')) {
            return 'admin'
          }
        }
      }
    },
    chunkSizeWarningLimit: 600 // Increase limit slightly to avoid warning
  }
})
