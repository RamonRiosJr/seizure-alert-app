import React, { useState, useCallback, useEffect } from 'react';
import ReadyScreen from './components/ReadyScreen';
import AlertScreen from './components/AlertScreen';
import Chatbot from './components/Chatbot';
import SettingsScreen from './components/SettingsScreen';
import ReportsScreen from './components/ReportsScreen';
import type { Language, AlertReport } from './types';
import { useTheme } from './hooks/useTheme';
import { translations } from './constants';
import { Settings, ClipboardList, AlertTriangle } from 'lucide-react';
import DisclaimerModal from './components/DisclaimerModal';

// Controls that only appear on the Ready Screen
function TopRightControls({
  theme,
  toggleTheme,
  onOpenSettings,
  onOpenReports,
  onOpenDisclaimer,
  language
}: {
  theme: 'light' | 'dark',
  toggleTheme: () => void,
  onOpenSettings: () => void,
  onOpenReports: () => void,
  onOpenDisclaimer: () => void,
  language: Language
}) {
  const t = translations[language];
  const buttonClasses = 'p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600';

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
      <button
        onClick={onOpenDisclaimer}
        className="p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
        aria-label="Medical Disclaimer"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>

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
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
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

  // Check for emergency URL trigger (NFC/QR code)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('emergency') === 'true') {
      activateAlert();
      // Optional: Clean URL so reload doesn't re-trigger? 
      // window.history.replaceState({}, '', window.location.pathname);
    }
  }, [activateAlert]);

  // Handle back button for modals
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If any modal is open, close it and stay on page (prevent exit)
      if (isChatOpen || isSettingsOpen || isReportsOpen) {
        setIsChatOpen(false);
        setIsSettingsOpen(false);
        setIsReportsOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isChatOpen, isSettingsOpen, isReportsOpen, isDisclaimerOpen]);

  const openChat = useCallback(() => {
    window.history.pushState({ modal: 'chat' }, '');
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    if (isChatOpen) {
      // Check if looking at state created by us vs generic back
      if (window.history.state?.modal === 'chat') {
        window.history.back();
      } else {
        setIsChatOpen(false);
      }
    }
  }, [isChatOpen]);

  // Apply similar logic to other modals for consistency
  const openSettings = useCallback(() => {
    window.history.pushState({ modal: 'settings' }, '');
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    if (isSettingsOpen) {
      if (window.history.state?.modal === 'settings') {
        window.history.back();
      } else {
        setIsSettingsOpen(false);
      }
    }
  }, [isSettingsOpen]);

  const openReports = useCallback(() => {
    window.history.pushState({ modal: 'reports' }, '');
    setIsReportsOpen(true);
  }, []);

  const closeReports = useCallback(() => {
    if (isReportsOpen) {
      if (window.history.state?.modal === 'reports') {
        window.history.back();
      } else {
        setIsReportsOpen(false);
      }
    }
  }, [isReportsOpen]);

  // Missing handlers
  const openDisclaimer = useCallback(() => {
    window.history.pushState({ modal: 'disclaimer' }, '');
    setIsDisclaimerOpen(true);
  }, []);

  const closeDisclaimer = useCallback(() => {
    if (isDisclaimerOpen) {
      if (window.history.state?.modal === 'disclaimer') window.history.back();
      else setIsDisclaimerOpen(false);
    }
  }, [isDisclaimerOpen]);



  return (
    <div className="w-screen h-screen overflow-hidden">
      {screen === 'ready' && (
        <TopRightControls
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenSettings={openSettings}
          onOpenReports={openReports}
          onOpenDisclaimer={openDisclaimer}
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
        isVisible={!isSettingsOpen && !isReportsOpen && !isDisclaimerOpen}
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

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={closeDisclaimer}
      />
    </div>
  );
}

export default App;