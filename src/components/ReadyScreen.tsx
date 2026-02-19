import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Triangle, Brain } from 'lucide-react';

import { useBLEContext } from '../contexts/BLEContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { useSettings } from '../contexts/SettingsContext';
import { BottomNavigation } from './BottomNavigation'; // New Component

const ReadyScreen: React.FC = () => {
  const { language } = useLanguage();
  const { setScreen } = useUI();
  const { t } = useTranslation();
  const { heartRate, connectedDevice } = useBLEContext();
  const { geminiApiKey } = useSettings();
  const [fallDetectionEnabled] = useLocalStorage('fallDetectionEnabled', false);

  return (
    <div className="relative flex flex-col items-center justify-center h-dvh w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white text-center p-4 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex flex-col items-center justify-center flex-grow min-h-0 -mt-16 pb-20 relative w-full max-w-md">
        {/* Top Right Controls */}
        <div className="absolute top-0 right-4 flex gap-4 z-10 translate-y-[-150%] md:translate-y-[-200%]">
          {/* Heart Rate Monitor Status */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              connectedDevice ? 'bg-red-500/20 text-red-500' : 'bg-gray-800/50 text-gray-500'
            }`}
          >
            <Heart className={`w-6 h-6 ${connectedDevice ? 'fill-current animate-pulse' : ''}`} />
            {connectedDevice && heartRate && (
              <span className="absolute -bottom-6 text-xs font-mono text-red-400">{heartRate}</span>
            )}
          </div>

          {/* Fall Detection Status */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              fallDetectionEnabled
                ? 'bg-green-500/20 text-green-500'
                : 'bg-gray-800/50 text-gray-500'
            }`}
          >
            <Triangle className={`w-6 h-6 ${fallDetectionEnabled ? 'fill-current' : ''}`} />
          </div>

          {/* Gemini API Status */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              geminiApiKey ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-800/50 text-gray-500'
            }`}
          >
            <Brain className="w-6 h-6" />
          </div>
        </div>

        <img
          src={language === 'es' ? 'Aura-Habla-IA.png' : 'Aura-Speaks-AI.png'}
          alt={`${t('title')} Logo`}
          className="w-72 h-auto md:w-96 md:h-auto mb-10 rounded-3xl shadow-lg"
        />

        {/* Friendly Instructions (Subtitle) */}
        <p className="text-gray-400 text-sm md:text-base font-medium mb-8 px-4 opacity-90">
          {t('subtitle')}
        </p>

        {/* Emergency Button - The Focal Point */}
        <div className="relative">
          <button
            onClick={() => setScreen('alert')}
            className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 bg-red-600 text-white rounded-full animate-breathe transition-transform duration-150 ease-in-out active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400 shadow-2xl shadow-red-900/50"
            aria-label={t('emergencyButton')}
          >
            <span className="absolute h-full w-full rounded-full bg-red-500 animate-pulse opacity-50"></span>
            <span className="relative text-4xl md:text-5xl font-bold tracking-wider drop-shadow-md">
              {t('emergencyButton')}
            </span>
          </button>

          {/* Monitoring Status Label */}
          <p className="text-gray-400 text-sm md:text-base font-medium mt-6 animate-pulse tracking-wide uppercase">
            {t('monitoringStatus')}
          </p>

          {/* Fall Detection Indicator (Subtle) */}
        </div>
      </main>

      {/* New Clean Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ReadyScreen;
