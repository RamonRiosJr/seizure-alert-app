import React from 'react';
import { useTranslation } from 'react-i18next';
import { useShake } from '../../hooks/useShake';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Smartphone, Check } from 'lucide-react';

export const SettingShake: React.FC = () => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useLocalStorage('shakeEnabled', true);
  const { requestPermission, isIOS } = useShake(() => {});

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Smartphone className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {t('settingsShakeTitle', 'Shake to Alert')}
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        {t('settingsShakeDesc', 'Rapidly shake your phone 3 times to trigger the emergency alert.')}
      </p>

      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {t('enable', 'Enable Feature')}
        </span>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            isEnabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label={isEnabled ? 'Disable Shake to Alert' : 'Enable Shake to Alert'}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {isEnabled && isIOS && (
        <div className="mt-2">
          <button
            onClick={requestPermission}
            className="w-full py-2 px-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Check className="w-4 h-4" />
            {t('settingsShakePermissionBtn', 'Grant Motion Permission (iOS)')}
          </button>
        </div>
      )}
    </div>
  );
};
