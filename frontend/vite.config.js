import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/products': {
        target: 'http://localhost:8001',
        changeOrigin: true
      },
      '/api/tours': {
        target: 'http://localhost:8002',
        changeOrigin: true
      },
      '/api/orders': {
        target: 'http://localhost:8003',
        changeOrigin: true
      }
    }
  }
})
