import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/clippy/message': {
        target: 'http://10.200.20.204:18000',
        changeOrigin: true,
        secure: false,
      },
      '/clippy/whatif': {
        target: 'http://10.200.20.204:18000',
        changeOrigin: true,
        secure: false,
      },
      '/score': {
        target: 'http://10.200.20.204:18000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
