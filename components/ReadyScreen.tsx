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
    <div className="relative flex flex-col items-center justify-center h-[100dvh] w-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-center p-4">
      <main className="flex flex-col items-center justify-center flex-grow min-h-0 -mt-16">
        <img src="seizure-alert-logo.svg" alt={`${t.title} Logo`} className="w-56 h-56 md:w-72 md:h-72 mb-6" />
        <p className="text-lg md:text-2xl mb-8 max-w-lg font-medium">{t.subtitle}</p>
        <button
          onClick={onActivateAlert}
          className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 bg-red-600 text-white rounded-full animate-breathe transition-transform duration-150 ease-in-out active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400"
          aria-label={t.emergencyButton}
        >
          <span className="absolute h-full w-full rounded-full bg-red-500 animate-pulse"></span>
          <span className="relative text-4xl md:text-5xl font-bold tracking-wider">{t.emergencyButton}</span>
        </button>
      </main>

      <button
        onClick={onOpenChat}
        className="absolute bottom-[18%] right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
        aria-label="Open AI Health Assistant"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ReadyScreen;