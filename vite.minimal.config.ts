/**
 * vite.minimal.config.ts
 * A minimal Vite configuration file
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175
  },
  build: {
    rollupOptions: {
      input: {
        main: './src/main.minimal.tsx'
      }
    }
  }
})
