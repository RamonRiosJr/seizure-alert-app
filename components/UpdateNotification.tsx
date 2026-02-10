import React from 'react';
// @ts-ignore - Vite virtual module
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const UpdateNotification: React.FC = () => {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-blue-200 dark:border-blue-900 flex flex-col gap-3 relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

        <div className="flex items-start justify-between pl-2">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin-slow" />
              {t('updateAvailable')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('updateDesc')}</p>
          </div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label={t('closeButton')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-end gap-2 pl-2">
          <button
            onClick={() => updateServiceWorker(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            {t('updateReload')}
          </button>
        </div>
      </div>
    </div>
  );
};
