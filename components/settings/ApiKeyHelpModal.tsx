import React from 'react';
import { X, ExternalLink, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApiKeyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-500" />
            {t('apiKeyHelpTitle')}
          </h3>
          <button
            onClick={onClose}
            aria-label={t('closeButton')}
            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
              1
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">{t('apiKeyHelpStep1')}</p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                {t('openAIStudio')} <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                {t('apiKeyHelpStep2')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('apiKeyHelpStep3')}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{t('apiKeyHelpStep4')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 text-center">
          <button
            onClick={onClose}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            {t('closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
