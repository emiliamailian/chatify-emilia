import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],     // 👈 lägg till
  server: {
    https: true,                      // 👈 viktigt
    proxy: {
      '/api': {
        target: 'https://chatify-api.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/',
      },
    },
  },
})
