import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change this to your repo name path when deploying to GitHub Pages
// Example: if site will be at https://norani34.github.io/despacito-cafe/ then base should be '/despacito-cafe/'
export default defineConfig({
  base: '/despacito-cafe/',
  plugins: [react()],
})
