import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    // Multi-page build: the main site and the standalone problem statements page
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        problemStatements: resolve(root, 'problem-statements/index.html'),
      },
    },
  },
})
