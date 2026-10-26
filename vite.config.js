import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Saat dev, proxy menambah api_key dari .env (TMDB_API_KEY tanpa prefix VITE_,
// sehingga tidak ikut masuk ke bundle klien).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (path) => {
            const rest = path.replace(/^\/api\/tmdb/, '')
            return `${rest}${rest.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(env.TMDB_API_KEY ?? '')}`
          },
        },
      },
    },
  }
})
