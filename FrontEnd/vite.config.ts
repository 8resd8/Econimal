import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    react(),
    mkcert({
      hosts: ['localhost', '192.168.36.196'],
    }),
    checker({
      typescript: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: [
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
      ],
      manifest: {
        name: '에코니멀',
        short_name: '에코니멀',
        description: '참여형 환경 에듀테크 서비스, 에코니멀',
        theme_color: '#242424',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        display: 'standalone',
        orientation: 'landscape', // 가로 모드로 설정
        start_url: '/',
        scope: './',
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html}'], // 빌드된 결과물만 캐싱
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
            },
          },
          {
            urlPattern: /\.(?:js|ts|tsx|css)$/,
            handler: 'StaleWhileRevalidate',
          },
        ],
      },
    }),
  ],
  server: {
    https: true,
    host: true,
    port: 5173,
    strictPort: true,
  },
});
