import React, { Suspense } from 'react';
import './index.css';
import '@/i18n';
import ReactDOM from 'react-dom/client';

import App from './App';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { LanguageProvider } from './contexts/LanguageContext';
import { UIProvider } from './contexts/UIContext';
import { BLEProvider } from './contexts/BLEContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Suspense
        fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}
      >
        <LanguageProvider>
          <UIProvider>
            <BLEProvider>
              <App />
            </BLEProvider>
          </UIProvider>
        </LanguageProvider>
      </Suspense>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
