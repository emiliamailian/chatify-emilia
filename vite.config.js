import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://chatify-api.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: p => p.replace(/^\/api/, ''),
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
    },
  },
})
