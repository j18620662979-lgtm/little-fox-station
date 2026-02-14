import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/little-fox-station/',
  plugins: [vue()],
  server: { port: 5173, strictPort: true }
})