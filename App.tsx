import React, { useState, useCallback } from 'react';
import ReadyScreen from './components/ReadyScreen';
import AlertScreen from './components/AlertScreen';
import Chatbot from './components/Chatbot';
import SettingsScreen from './components/SettingsScreen';
import ReportsScreen from './components/ReportsScreen';
import type { Language, AlertReport } from './types';
import { useTheme } from './hooks/useTheme';
import { translations } from './constants';
import { SunIcon, MoonIcon, SettingsIcon, DocumentChartBarIcon } from './assets/icons';

function LanguageSwitcher({ language, setLanguage }: { language: Language, setLanguage: (lang: Language) => void }) {
  const baseClasses = 'px-6 py-2 text-md font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-70 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
  const activeClasses = 'bg-blue-600 text-white focus:ring-blue-400';
  const inactiveClasses = 'text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-blue-400';

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-full shadow-lg">
      <button
        onClick={() => setLanguage('en')}
        className={`${baseClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
        aria-pressed={language === 'en'}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`${baseClasses} ${language === 'es' ? activeClasses : inactiveClasses}`}
        aria-pressed={language === 'es'}
      >
        Español
      </button>
    </div>
  );
}

function TopLeftControls({ theme, toggleTheme, onOpenSettings, onOpenReports, language }: { 
  theme: 'light' | 'dark', 
  toggleTheme: () => void,
  onOpenSettings: () => void,
  onOpenReports: () => void,
  language: Language
}) {
  const t = translations[language];
  return (
    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
      <button
        onClick={toggleTheme}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
      </button>
      <button
        onClick={onOpenSettings}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>
      <button
        onClick={onOpenReports}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={t.openReports}
      >
        <DocumentChartBarIcon className="w-6 h-6" />
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
        <>
          <TopLeftControls 
            theme={theme} 
            toggleTheme={toggleTheme}
            onOpenSettings={openSettings}
            onOpenReports={openReports}
            language={language}
          />
        </>
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
      
      {screen === 'ready' && <LanguageSwitcher language={language} setLanguage={setLanguage} />}

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