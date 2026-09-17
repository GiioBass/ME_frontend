import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'c92a-2800-e2-1e80-196d-907b-4a7d-db98-7fc4.ngrok-free.app'
    ]
  }
})
