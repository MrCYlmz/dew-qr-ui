import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    port: 8081,
    host: true, // Listen on all interfaces (0.0.0.0) for LAN access
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // This will copy index.html as 404.html
        notfound: resolve(__dirname, 'index.html'),
      },
    }
  }
})
