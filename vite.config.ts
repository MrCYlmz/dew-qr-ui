import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081,
  },
  base: '/dew-qr-ui/' // Replace 'dew-qr-ui' with your repository name
})
