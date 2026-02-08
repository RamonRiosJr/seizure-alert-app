import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
// @ts-ignore - Vite virtual module
import { registerSW } from 'virtual:pwa-register';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './contexts/LanguageContext';
import { UIProvider } from './contexts/UIContext';

// Explicitly register Service Worker for PWA support
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('PWA: App is ready to work offline');
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);