import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { useTranslation } from 'react-i18next';
import { Bell, Pencil, Save, Volume2, VolumeX, Mic } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { SettingShake } from './SettingShake';
import { SettingFallDetection } from './SettingFallDetection';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEmergencyAlert } from '../../hooks/useEmergencyAlert';

const AlertMessageEditor = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    const saved = localStorage.getItem(`seizure_alert_status_message_${language}`);
    setMessage(saved || t('alertStatus'));
  }, [language, t]);

  const handleSave = () => {
    localStorage.setItem(`seizure_alert_status_message_${language}`, message);
    alert(t('settingsSaveSuccess'));
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 border border-slate-700 bg-slate-800 rounded-xl text-slate-200 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder={t('customAlertPlaceholder')}
      />
      <button
        onClick={handleSave}
        className="self-end px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors active:scale-95"
      >
        <Save className="w-4 h-4" />
        {t('settingsSave')}
      </button>
    </div>
  );
};

export const SafetyTab: React.FC = () => {
  const { t } = useTranslation();
  const { voiceActivationEnabled, setVoiceActivationEnabled, picovoiceAccessKey } = useSettings();
  const [sirenEnabled, setSirenEnabled] = useLocalStorage('siren_enabled', true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const { startAlert, stopAlert } = useEmergencyAlert();

  const handleTogglePreview = () => {
    if (isPreviewing) {
      stopAlert();
      setIsPreviewing(false);
    } else {
      startAlert();
      setIsPreviewing(true);
    }
  };

  // Ensure sound stops if component unmounts
  React.useEffect(() => {
    return () => {
      stopAlert();
    };
  }, [stopAlert]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">{t('sirenTitle', 'Emergency Siren')}</h3>
            <p className="text-sm text-slate-400">
              {t('sirenDesc', 'Sound a loud alarm during emergencies')}
            </p>
          </div>
          <button
            onClick={handleTogglePreview}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isPreviewing
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isPreviewing ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            {isPreviewing ? t('stopTest', 'Stop Test') : t('testSiren', 'Test Siren')}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200">{t('sirenMute', 'Active Siren')}</span>
              <p className="text-xs text-slate-500">
                {t('sirenUnmute', 'Sound will play even if your phone is set to quiet mode.')}
              </p>
            </div>
            <Switch checked={sirenEnabled} onCheckedChange={setSirenEnabled} />
          </div>
        </div>
      </Card>

      <SettingShake />

      <SettingFallDetection />

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg transition-colors ${voiceActivationEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}
            >
              <Mic className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">Hands-Free Trigger</span>
              <p className="text-xs text-slate-500">Start alert by saying "Hey Aura"</p>
            </div>
          </div>
          <Switch
            checked={voiceActivationEnabled}
            onCheckedChange={setVoiceActivationEnabled}
            disabled={!picovoiceAccessKey}
          />
        </div>
      </Card>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2 px-1">
          <Pencil className="w-6 h-6 text-blue-400" />
          {t('customAlertMsgTitle', 'Custom Alert Message')}
        </h3>
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            {t(
              'customAlertMsgDesc',
              'This message will be shown on the screen when an alert is triggered.'
            )}
          </p>
          <AlertMessageEditor />
        </Card>
      </section>
    </div>
  );
};
