import React from 'react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { BottomNavigation } from './BottomNavigation'; // New Component

const ReadyScreen: React.FC = () => {
  const { language } = useLanguage();
  const { setScreen } = useUI();
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center justify-center h-dvh w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white text-center p-4 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex flex-col items-center justify-center flex-grow min-h-0 -mt-16 pb-20">
        <img
          src={language === 'es' ? 'Aura-Habla-IA.png' : 'Aura-Speaks-AI.png'}
          alt={`${t('title')} Logo`}
          className="w-72 h-auto md:w-96 md:h-auto mb-10 rounded-3xl shadow-lg"
        />

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

          {/* Fall Detection Indicator (Subtle) */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full text-center">
            <p className="text-sm text-slate-400 font-medium tracking-wide">
              {t('monitoringStatus') || 'Monitoring Active'}
            </p>
          </div>
        </div>
      </main>

      {/* New Clean Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ReadyScreen;
