import React from 'react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '../contexts/LanguageContext';
import { useBattery } from '../hooks/useBattery';
import { useSettings } from '../contexts/SettingsContext';
import { Battery, BatteryCharging, Zap, Lock, Unlock } from 'lucide-react';

import { useUI } from '../contexts/UIContext';
import { useWakeWord } from '../hooks/useWakeWord';
import { Mic, MicOff } from 'lucide-react';

const ReadyScreen: React.FC = () => {
  const { language } = useLanguage();
  const { setScreen, openModal } = useUI();
  const { t } = useTranslation();
  const { isListening } = useWakeWord();

  return (
    <div className="relative flex flex-col items-center justify-center h-dvh w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white text-center p-4 overflow-hidden">
      {/* Voice Activation Status */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${isListening ? 'bg-blue-500/10 border-blue-400/50 text-blue-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-500'}`}
        >
          {isListening ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <Mic className="w-3 h-3" />
              Aura is Listening
            </>
          ) : (
            <>
              <MicOff className="w-3 h-3" />
              Voice Trigger Off
            </>
          )}
        </div>
      </div>
      <main className="flex flex-col items-center justify-center flex-grow min-h-0 -mt-16">
        <img
          src={language === 'es' ? 'Aura-Habla-IA.png' : 'Aura-Speaks-AI.png'}
          alt={`${t('title')} Logo`}
          className="w-72 h-auto md:w-96 md:h-auto mb-6 rounded-3xl shadow-lg"
        />
        {/* Subtitle removed as it is now part of the logo */}

        <div className="relative">
          <button
            onClick={() => setScreen('alert')}
            className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 bg-red-600 text-white rounded-full animate-breathe transition-transform duration-150 ease-in-out active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400"
            aria-label={t('emergencyButton')}
          >
            <span className="absolute h-full w-full rounded-full bg-red-500 animate-pulse"></span>
            <span className="relative text-4xl md:text-5xl font-bold tracking-wider">
              {t('emergencyButton')}
            </span>
          </button>

          {/* AI Health Assistant Trigger */}
          <button
            onClick={() => openModal('chat')}
            className="fixed bottom-24 right-6 p-4 rounded-full bg-blue-600/20 border border-blue-400/30 backdrop-blur-md shadow-lg hover:scale-110 active:scale-90 transition-all z-40 group"
            aria-label={t('ariaOpenChat')}
          >
            {/* Icon or text for the AI button */}
            {t('aiButton')}
          </button>
        </div>

        {/* Battery Status Card */}
        <BatteryStatusCard />
      </main>
    </div>
  );
};

// Battery Status Card Component
const BatteryStatusCard: React.FC = () => {
  const { level, charging, dischargeRate, isSupported } = useBattery();
  const { lowPowerMode, preventSleep } = useSettings();
  const { openModal } = useUI();
  const { t } = useTranslation();

  if (!isSupported) return null;

  const percentage = Math.round(level * 100);

  // Calculate estimated time remaining
  const getEstimatedTime = () => {
    if (charging || !dischargeRate || dischargeRate >= 0) return null;
    const hoursRemaining = level / Math.abs(dischargeRate);
    if (hoursRemaining < 0.1 || hoursRemaining > 24) return null;
    return hoursRemaining;
  };

  const estimatedHours = getEstimatedTime();

  // Determine border color based on battery level
  let borderColor = 'border-green-500';
  let bgColor = 'bg-green-500/10';
  if (percentage < 20) {
    borderColor = 'border-red-500 animate-pulse';
    bgColor = 'bg-red-500/10';
  } else if (percentage < 50) {
    borderColor = 'border-yellow-500';
    bgColor = 'bg-yellow-500/10';
  }

  return (
    <div
      onClick={() => openModal('settings')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal('settings');
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={t('ariaBatteryStatus', {
        percentage,
        status: charging ? t('batteryCharging') : t('batteryDischarging'),
        action: t('batteryTapSettings'),
      })}
      className={`mt-6 w-full max-w-md cursor-pointer transition-all hover:scale-105 active:scale-95 rounded-xl border-2 ${borderColor} ${bgColor} backdrop-blur-sm p-4 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {charging ? (
            <BatteryCharging className="w-6 h-6 text-green-400" />
          ) : (
            <Battery className="w-6 h-6" />
          )}
          {t('batteryHealth')}
        </h3>
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>

      <div className="space-y-2 text-sm">
        {/* Charging Status */}
        {charging && (
          <div className="flex items-center gap-2 text-green-400">
            <Zap className="w-4 h-4 fill-green-400" />
            <span className="font-semibold">{t('batteryCharging')}</span>
          </div>
        )}

        {/* Discharge Rate */}
        {!charging && dischargeRate && dischargeRate < 0 && (
          <div className="flex items-center justify-between opacity-90">
            <span>{t('drainRate')}</span>
            <span className="font-mono font-semibold">
              {Math.abs(dischargeRate * 100).toFixed(1)}% {t('perHour')}
            </span>
          </div>
        )}

        {/* Estimated Time Remaining */}
        {estimatedHours && (
          <div className="flex items-center justify-between opacity-90">
            <span>{t('estTime')}</span>
            <span className="font-semibold">
              ~{Math.floor(estimatedHours)}
              {t('hoursShort')} {Math.round((estimatedHours % 1) * 60)}
              {t('minutesShort')}
            </span>
          </div>
        )}

        {/* Low Power Mode Indicator */}
        {lowPowerMode && (
          <div className="flex items-center gap-2 text-green-400 mt-2 pt-2 border-t border-white/10">
            <span className="text-lg">💚</span>
            <span className="font-semibold">
              {t('lowPowerMode')}: {t('statusOn')}
            </span>
          </div>
        )}

        {/* Wake Lock Indicator */}
        {preventSleep && (
          <div className="flex items-center gap-2 text-amber-400 mt-2 pt-2 border-t border-white/10">
            {preventSleep ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span className="font-semibold">
              {t('preventSleep')}: {t('statusPrevented')}
            </span>
          </div>
        )}
      </div>

      <p className="text-xs opacity-60 mt-3 text-center">{t('tapForSettings')}</p>
    </div>
  );
};

export default ReadyScreen;
