import React from 'react';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { useBattery } from '../../hooks/useBattery';
import { Battery, Globe } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const CareTab: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { lowPowerMode, setLowPowerMode, preventSleep, setPreventSleep } = useSettings();
  const { level, charging, dischargeRate, dischargingTime, chargingTime } = useBattery();

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
              {t('powerPerformanceTitle', 'Phone Care')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('batteryHealth', 'Manage battery and power settings')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <span className="text-slate-200 mr-2">{t('preventSleepHeader', 'Stay Awake')}</span>
                <Badge variant="warning">{t('highUsage', 'High Power')}</Badge>
              </div>
              <p className="text-xs text-slate-500">
                {t('preventSleepDescription', 'Keep screen on to monitor safety continuously.')}
              </p>
            </div>
            <Switch checked={preventSleep} onCheckedChange={setPreventSleep} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200">{t('lowPowerModeHeader', 'Battery Saver')}</span>
              <p className="text-xs text-slate-500">
                {t('lowPowerModeDescription', 'Save power by checking sensors less often.')}
              </p>
            </div>
            <Switch checked={lowPowerMode} onCheckedChange={setLowPowerMode} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Battery className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              {t('batteryDiagnostics', 'Battery Diagnostics')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('realTimePowerStats', 'Real-time power consumption stats')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">
              {t('currentLevel', 'Current Level')}
            </span>
            <span className="text-xl font-mono text-white">{Math.round(level * 100)}%</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">{t('status', 'Status')}</span>
            <span
              className={`text-xl font-medium ${charging ? 'text-green-400' : 'text-slate-300'}`}
            >
              {charging ? t('charging', 'Charging') : t('discharging', 'Discharging')}
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">
              {t('dischargeRate', 'Discharge Rate')}
            </span>
            <span className="text-lg font-mono text-white">
              {dischargeRate ? `${dischargeRate > 0 ? '+' : ''}${dischargeRate}%/hr` : '--'}
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">{t('estTime', 'Est. Time')}</span>
            <span className="text-lg font-mono text-white">
              {dischargingTime && dischargingTime !== Infinity
                ? `${Math.round(dischargingTime / 60)}m`
                : chargingTime && chargingTime !== Infinity
                  ? `${Math.round(chargingTime / 60)}m`
                  : '--'}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Battery className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              {t('batteryDiagnostics', 'Battery Diagnostics')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('realTimePowerStats', 'Real-time power consumption stats')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">
              {t('currentLevel', 'Current Level')}
            </span>
            <span className="text-xl font-mono text-white">{Math.round(level * 100)}%</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">{t('status', 'Status')}</span>
            <span
              className={`text-xl font-medium ${charging ? 'text-green-400' : 'text-slate-300'}`}
            >
              {charging ? t('charging', 'Charging') : t('discharging', 'Discharging')}
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">
              {t('dischargeRate', 'Discharge Rate')}
            </span>
            <span className="text-lg font-mono text-white">
              {dischargeRate ? `${dischargeRate > 0 ? '+' : ''}${dischargeRate}%/hr` : '--'}
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-500 block mb-1">{t('estTime', 'Est. Time')}</span>
            <span className="text-lg font-mono text-white">
              {dischargingTime && dischargingTime !== Infinity
                ? `${Math.round(dischargingTime / 60)}m`
                : chargingTime && chargingTime !== Infinity
                  ? `${Math.round(chargingTime / 60)}m`
                  : '--'}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">Language / Idioma</span>
              <span className="text-xs text-slate-500">Choose your preferred language</span>
            </div>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-colors shadow-sm active:scale-95"
          >
            {i18n.language === 'en' ? 'English' : 'Español'}
          </button>
        </div>
      </Card>

      <div className="text-center py-8">
        <p className="text-xs text-slate-600 font-medium">Aura Speaks AI v0.3.5 (Expert UX)</p>
      </div>
    </div>
  );
};
