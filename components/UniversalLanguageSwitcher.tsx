import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';

export default function UniversalLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { screen, isAnyModalOpen } = useUI();

  // Hide if any modal is open
  if (isAnyModalOpen) return null;

  const targetLang = language === 'en' ? 'es' : 'en';
  const label = language === 'en' ? 'Español' : 'English';

  // Dynamic styles based on screen context
  const getButtonStyles = () => {
    if (screen === 'alert') {
      return 'bg-white/20 text-white hover:bg-white/30 border-white/30 shadow-[0_0_15px_rgba(0,0,0,0.3)]';
    }
    // Ready screen (Light/Dark mode adaptive)
    return 'bg-white/80 dark:bg-black/40 text-gray-800 dark:text-white border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-black/60 shadow-lg backdrop-blur-md';
  };

  return (
    <div className="fixed top-4 left-4 z-[60]">
      <button
        onClick={() => setLanguage(targetLang)}
        className={`px-4 py-2 text-sm font-bold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-black ${getButtonStyles()}`}
        aria-label={`Switch to ${label}`}
      >
        {label}
      </button>
    </div>
  );
}
