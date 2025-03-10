import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: '에코니멀',
        short_name: '에코니멀',
        description: '참여형 환경 에듀테크 서비스, 에코니멀',
        theme_color: '#242424',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        display: 'fullscreen',
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
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
    host: true, // 모든 네트워크 인터페이스에서 접근 가능
    port: 5173, // 기본 포트
    strictPort: true, // 포트가 사용 중이면 종료
  },
});
