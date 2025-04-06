// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API requests to the actual API server
      '/api': {
        target: 'http://45.150.128.165:8000',
        changeOrigin: true,
        secure: false,
        // Optionally rewrite paths if needed
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});