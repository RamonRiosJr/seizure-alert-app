import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode: _mode }) => {
  return {
    base: '/seizure-alert-app/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt', // Changed from autoUpdate to allow user control via OfflineIndicator
        includeAssets: ['favicon.ico', 'seizure-alert-logo.svg'],
        manifest: {
          name: 'Aura Speaks AI',
          short_name: 'AuraSpeaks',
          description:
            'Aura Speaks AI - When I cannot speak, Aura speaks for me. Seizure safety diary and assistant.',
          theme_color: '#b91c1c',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/seizure-alert-app/',
          start_url: '/seizure-alert-app/',
          orientation: 'portrait',
          icons: [
            {
              src: 'Aura-Speaks-AI.png',
              sizes: 'any',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'Aura-Speaks-AI.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'Aura-Speaks-AI.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
          shortcuts: [
            {
              name: 'Emergency Alert',
              short_name: 'Emergency',
              description: 'Instant Seizure Alert',
              url: '/seizure-alert-app/?mode=emergency',
              icons: [{ src: 'Aura-Speaks-AI.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit for large AI assets
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    // To expose environment variables to the client, use the 'define' option:
    // define: {
    //   'process.env.API_KEY': JSON.stringify(env.API_KEY),
    // },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2015',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      include: [
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'hooks/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],
      exclude: ['tests/**', 'node_modules/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.config.{js,ts}',
          '**/*.d.ts',
          'tests/**',
          'src/test/**',
        ],
        thresholds: {
          lines: 70,
          functions: 60,
          branches: 52,
          statements: 69,
        },
      },
    },
  };
});
// Cache bust: 2026-02-05-1540-LayoutFix
