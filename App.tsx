import React, { useState, useCallback } from 'react';
import ReadyScreen from './components/ReadyScreen';
import AlertScreen from './components/AlertScreen';
import Chatbot from './components/Chatbot';
import SettingsScreen from './components/SettingsScreen';
import ReportsScreen from './components/ReportsScreen';
import type { Language, AlertReport } from './types';
import { useTheme } from './hooks/useTheme';
import { translations } from './constants';
import { Settings, ClipboardList } from 'lucide-react';

// Controls that only appear on the Ready Screen
function TopRightControls({
  theme,
  toggleTheme,
  onOpenSettings,
  onOpenReports,
  language
}: {
  theme: 'light' | 'dark',
  toggleTheme: () => void,
  onOpenSettings: () => void,
  onOpenReports: () => void,
  language: Language
}) {
  const t = translations[language];
  const buttonClasses = 'p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600';

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">

      <button
        onClick={onOpenSettings}
        className={buttonClasses}
        aria-label="Open settings"
      >
        <Settings className="w-6 h-6" />
      </button>
      <button
        onClick={onOpenReports}
        className={buttonClasses}
        aria-label={t.openReports}
      >
        <ClipboardList className="w-6 h-6" />
      </button>
    </div>
  );
}

function UniversalLanguageSwitcher({
  language,
  setLanguage,
  screen
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
  screen: 'ready' | 'alert';
}) {
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


function App() {
  const [screen, setScreen] = useState<'ready' | 'alert'>('ready');
  const [language, setLanguage] = useState<Language>('en');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();

  const activateAlert = useCallback(() => {
    setScreen('alert');
  }, []);

  const deactivateAlert = useCallback((duration: number) => {
    try {
      const newReport: AlertReport = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration,
        notes: '',
      };
      const existingReportsJSON = localStorage.getItem('alert_reports');
      const existingReports: AlertReport[] = existingReportsJSON ? JSON.parse(existingReportsJSON) : [];

      const updatedReports = [newReport, ...existingReports];

      localStorage.setItem('alert_reports', JSON.stringify(updatedReports));
    } catch (error) {
      console.error("Failed to save alert report:", error);
    }

    setScreen('ready');
  }, []);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const openReports = useCallback(() => setIsReportsOpen(true), []);
  const closeReports = useCallback(() => setIsReportsOpen(false), []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      {screen === 'ready' && (
        <TopRightControls
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenSettings={openSettings}
          onOpenReports={openReports}
          language={language}
        />
      )}

      {screen === 'ready' && (
        <ReadyScreen
          language={language}
          onActivateAlert={activateAlert}
          onOpenChat={openChat}
        />
      )}

      {screen === 'alert' && (
        <AlertScreen
          language={language}
          onDeactivateAlert={deactivateAlert}
        />
      )}

      <UniversalLanguageSwitcher
        language={language}
        setLanguage={setLanguage}
        screen={screen}
      />

      <Chatbot
        isOpen={isChatOpen}
        onClose={closeChat}
        language={language}
      />

      <SettingsScreen
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        language={language}
      />

      <ReportsScreen
        isOpen={isReportsOpen}
        onClose={closeReports}
        language={language}
      />
    </div>
  );
}

export default App;