import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/seizure-alert-app/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
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
