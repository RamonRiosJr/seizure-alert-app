import React from 'react';
import type { Language } from '../types';
import { translations } from '../constants';
import { MessageCircle } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

import { useUI } from '../contexts/UIContext';

const ReadyScreen: React.FC = () => {
  const { language } = useLanguage();
  const { setScreen, openModal } = useUI();
  const t = translations[language];

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white text-center p-4">
      <main className="flex flex-col items-center justify-center flex-grow min-h-0 -mt-16">
        <img src="Aura-Speaks-AI.png" alt={`${t.title} Logo`} className="w-72 h-auto md:w-96 md:h-auto mb-6 rounded-3xl shadow-lg" />
        <p className="text-lg md:text-2xl mb-8 max-w-lg font-medium">{t.subtitle}</p>

        <div className="relative">
          <button
            onClick={() => setScreen('alert')}
            className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 bg-red-600 text-white rounded-full animate-breathe transition-transform duration-150 ease-in-out active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400"
            aria-label={t.emergencyButton}
          >
            <span className="absolute h-full w-full rounded-full bg-red-500 animate-pulse"></span>
            <span className="relative text-4xl md:text-5xl font-bold tracking-wider">{t.emergencyButton}</span>
          </button>

          {/* Chatbot Trigger - 1 o'clock position */}
          <button
            onClick={() => openModal('chat')}
            className="absolute top-0 right-0 transform -translate-y-2 translate-x-2 bg-blue-600 text-white p-0 w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400 z-10 font-black text-lg"
            aria-label="Open AI Health Assistant"
          >
            {t.aiButton}
          </button>


        </div>
      </main >
    </div >
  );
};

export default ReadyScreen;