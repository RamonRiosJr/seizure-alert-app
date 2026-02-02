import React from 'react';
import type { Language } from '../types';
import { translations } from '../constants';
import { MessageCircle } from 'lucide-react';

interface ReadyScreenProps {
  language: Language;
  onActivateAlert: () => void;
  onOpenChat: () => void;
}

const ReadyScreen: React.FC<ReadyScreenProps> = ({ language, onActivateAlert, onOpenChat }) => {
  const t = translations[language];

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-center p-4">
      <main className="flex flex-col items-center justify-center flex-grow">
        <img src="https://coqui.cloud/web/image/6174-48fd9fa0/LogoSeizuresAlertApp.svg" alt={`${t.title} Logo`} className="w-32 h-32 md:w-40 md:h-40 mb-4" />
        <h1 className="text-5xl md:text-7xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg md:text-2xl mb-16 max-w-lg">{t.subtitle}</p>
        <button
          onClick={onActivateAlert}
          className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 bg-red-600 text-white rounded-full shadow-[0_0_60px_rgba(220,38,38,0.6)] transition-transform duration-150 ease-in-out active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400"
          aria-label={t.emergencyButton}
        >
          <span className="absolute h-full w-full rounded-full bg-red-500 animate-pulse"></span>
          <span className="relative text-4xl md:text-5xl font-bold tracking-wider">{t.emergencyButton}</span>
        </button>
      </main>

      <button
        onClick={onOpenChat}
        className="absolute bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
        aria-label="Open AI Health Assistant"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ReadyScreen;