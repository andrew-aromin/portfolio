import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: '0.0.0.0:3005',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
