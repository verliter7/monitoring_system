import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { getThemeVariables } from 'antd/dist/theme.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'import',
            {
              libraryName: 'antd',
              style: true,
              libraryDirectory: 'es',
            },
          ],
        ],
      },
    }),
  ],
  // 按需引入antd css样式
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    // extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  server: {
    port: 9090,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 接口基地址
        changeOrigin: true,
      },
    },
  },
});
