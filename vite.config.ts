import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // VITE_API_BASE_URL pode ser '/' para usar proxy ou uma URL absoluta para produção
  const apiBase = env.VITE_API_BASE_URL || env.API_BASE_URL || '/'
  // Proxy target deve ser uma URL absoluta; use VITE_DEV_PROXY_TARGET ou fallback localhost
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // só proxia /api no modo dev (ou quando apiBase for '/')
        '/api': {
          target: apiBase === '/' ? devProxyTarget : apiBase,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
