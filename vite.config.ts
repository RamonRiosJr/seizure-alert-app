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
        includeAssets: ['favicon.ico', 'seizure-alert-logo.svg'],
        manifest: {
          name: 'Seizure Alert',
          short_name: 'SeizureAlert',
          description: 'Seizure Alert App by Coqui Cloud Dev Co. A free PWA safety tool for epilepsy monitoring.',
          theme_color: '#b91c1c',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/seizure-alert-app/',
          start_url: '/seizure-alert-app/',
          orientation: 'portrait',
          icons: [
            {
              src: 'Seizures_Alert_App_icon.png',
              sizes: 'any',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'Seizures_Alert_App_icon.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'Seizures_Alert_App_icon.png',
              sizes: '512x512',
              type: 'image/png'
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
    },
    build: {
      target: 'es2015'
    }
  };
});
// Cache bust: 2026-02-02-2300
