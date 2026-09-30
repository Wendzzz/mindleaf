import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Standalone Mindleaf landing page. Relative base so dist/ works from any folder.
export default defineConfig({
  base: './',
  plugins: [react()],
})
