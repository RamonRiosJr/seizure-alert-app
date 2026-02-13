import React from 'react';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Battery, Globe, Watch } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { SettingHeartRate } from './SettingHeartRate';
import { SettingNFC } from './SettingNFC';

interface SystemTabProps {
  onOpenDeviceManager: () => void;
}

export const SystemTab: React.FC<SystemTabProps> = ({ onOpenDeviceManager }) => {
  const { i18n, t } = useTranslation();
  const { lowPowerMode, setLowPowerMode, preventSleep, setPreventSleep } = useSettings();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <Battery className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              {t('powerPerformanceTitle', 'Power & Performance')}
            </h3>
            <p className="text-sm text-slate-400">{t('batteryHealth', 'Manage battery usage')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <span className="text-slate-200 mr-2">
                  {t('preventSleepHeader', 'Prevent Sleep')}
                </span>
                <Badge variant="warning">{t('highUsage', 'High Usage')}</Badge>
              </div>
              <p className="text-xs text-slate-500">
                {t('preventSleepDescription', 'Keep screen awake while monitoring')}
              </p>
            </div>
            <Switch checked={preventSleep} onCheckedChange={setPreventSleep} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200">{t('lowPowerModeHeader', 'Low Power Mode')}</span>
              <p className="text-xs text-slate-500">
                {t('lowPowerModeDescription', 'Reduce sensor polling rate to save battery')}
              </p>
            </div>
            <Switch checked={lowPowerMode} onCheckedChange={setLowPowerMode} />
          </div>
        </div>
      </Card>

      {/* Heart Rate / Watch Settings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Watch className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('heartRateSafetyTitle', 'Watch & Wearables')}
            </h3>
          </div>
          <button
            onClick={onOpenDeviceManager}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-3 py-1.5 rounded-full border border-blue-400/20"
          >
            {t('scanForDevices', 'Manage Devices')}
          </button>
        </div>
        <SettingHeartRate />
      </section>

      <SettingNFC />

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-purple-400" />
            <span className="text-slate-200">Language / Idioma</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded bg-slate-700 text-sm font-medium hover:bg-slate-600 transition-colors"
          >
            {i18n.language === 'en' ? 'English' : 'Español'}
          </button>
        </div>
      </Card>

      <div className="text-center py-4">
        <p className="text-xs text-slate-600">Aura Speaks AI v0.3.1 (Alpha)</p>
      </div>
    </div>
  );
};
