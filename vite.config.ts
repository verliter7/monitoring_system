import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 9090,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 接口基地址
        changeOrigin: true,
      },
    },
  },
});
