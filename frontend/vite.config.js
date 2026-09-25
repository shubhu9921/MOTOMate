import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://revora-x9f8.onrender.com',
        changeOrigin: true,
        headers: {
          Origin: 'https://revora-x9f8.onrender.com'
        }
      }
    }
  }
})
