import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const HMR_HOST = process.env.VITE_HMR_HOST || 'localhost'
const HMR_PROTOCOL = process.env.VITE_HMR_PROTOCOL || 'ws'
const HMR_CLIENT_PORT = Number(process.env.VITE_HMR_CLIENT_PORT || 5173)

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      host: HMR_HOST,
      protocol: HMR_PROTOCOL,
      clientPort: HMR_CLIENT_PORT,
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
})
