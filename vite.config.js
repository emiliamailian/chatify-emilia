import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true, // kör via https://localhost:5173
    proxy: {
      '/api': {
        target: 'https://chatify-api.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: p => p.replace(/^\/api/, ''),
        // Låt Vite plocka bort Domain-attributet helt -> host-only cookie för localhost
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
    },
  },
})
