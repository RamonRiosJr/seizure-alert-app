import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const InstallPrompt: React.FC = () => {
  const { installApp, dismissPrompt, isIOS, showPrompt } = usePWAInstall();
  const { t } = useTranslation();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-4 max-w-md mx-auto relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />

        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl flex-shrink-0">
          <Download className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        <div className="flex-grow text-center md:text-left">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t('installTitle')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isIOS ? t('installDescIOS') : t('installDescAndroid')}
          </p>

          {isIOS && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-1">
                <span>{t('installStep1')}</span>
                <Share className="w-4 h-4 inline-block" />
                <span>{t('installShare')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{t('installStep2')}</span>
                <PlusSquare className="w-4 h-4 inline-block" />
                <span>{t('installAddToHome')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 flex-col md:flex-row">
          {!isIOS && (
            <button
              onClick={installApp}
              className="flex-1 md:flex-none py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-red-500/30 transition-all active:scale-95 whitespace-nowrap"
            >
              {t('installButton')}
            </button>
          )}
          <button
            onClick={dismissPrompt}
            className="flex-1 md:flex-none py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 whitespace-nowrap"
          >
            {isIOS ? t('closeButton') : t('notNowButton')}
          </button>
        </div>

        <button
          onClick={dismissPrompt}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
