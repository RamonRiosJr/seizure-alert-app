import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/seizure-alert-app/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Seizure Alert',
          short_name: 'Seizure Alert',
          description: 'An emergency tool for people with epilepsy to alert others nearby during a seizure.',
          theme_color: '#dc2626',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/seizure-alert-app/',
          start_url: '/seizure-alert-app/',
          orientation: 'portrait',
          icons: [
            {
              src: 'https://coqui.cloud/web/image/6174-48fd9fa0/LogoSeizuresAlertApp.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: 'https://coqui.cloud/web/image/6174-48fd9fa0/LogoSeizuresAlertApp.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'https://coqui.cloud/web/image/6174-48fd9fa0/LogoSeizuresAlertApp.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        },
        devOptions: {
          enabled: true
        }
      })
    ],
    // To expose environment variables to the client, use the 'define' option:
    // define: {
    //   'process.env.API_KEY': JSON.stringify(env.API_KEY),
    // },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
