import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: ['e2e/**/*', 'node_modules/**/*'],
    alias: {
      // Alias de paths de la app
      '@': path.resolve(__dirname, './'),
      // Módulos exclusivos de Next.js — no existen en el entorno de Vitest
      'server-only': path.resolve(__dirname, './tests/__mocks__/server-only.ts'),
      'client-only': path.resolve(__dirname, './tests/__mocks__/client-only.ts'),
    }
  }
})
