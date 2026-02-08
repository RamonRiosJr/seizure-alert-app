import React, { Suspense } from 'react';
import './index.css';
import '@/i18n';
import ReactDOM from 'react-dom/client';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './contexts/LanguageContext';
import { UIProvider } from './contexts/UIContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <LanguageProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </LanguageProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);