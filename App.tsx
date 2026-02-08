import React from 'react';
import Chatbot from './components/Chatbot';
import SettingsScreen from './components/SettingsScreen';
import ReportsScreen from './components/ReportsScreen';
import AboutScreen from './components/AboutScreen';
import { useTheme } from './hooks/useTheme';
import DisclaimerModal from './components/DisclaimerModal';
import { useUI } from './contexts/UIContext';
import TopRightControls from './components/TopRightControls';
import UniversalLanguageSwitcher from './components/UniversalLanguageSwitcher';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateNotification } from './components/UpdateNotification';
import { AppRouter } from './router/AppRouter';
import { GlobalListeners } from './components/layout/GlobalListeners';
import { OfflineIndicator } from './components/OfflineIndicator';

function App() {
  const {
    activeModal,
    screen,
    closeModal,
    openModal
  } = useUI();

  const [theme, toggleTheme] = useTheme();

  return (
    <div className={`min-h-[100dvh] transition-colors duration-200 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Non-visual logic listeners */}
      <GlobalListeners />
      <OfflineIndicator />

      {/* Layout Elements */}
      {screen === 'ready' && (
        <TopRightControls
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main Content Router */}
      <AppRouter />

      {/* Global UI Elements */}
      <UniversalLanguageSwitcher />
      <InstallPrompt />
      <UpdateNotification />

      {/* Modals */}
      <Chatbot
        isOpen={activeModal === 'chat'}
        onClose={closeModal}
      />

      <SettingsScreen
        isOpen={activeModal === 'settings'}
        onClose={closeModal}
      />

      <ReportsScreen
        isOpen={activeModal === 'reports'}
        onClose={closeModal}
      />

      <DisclaimerModal
        isOpen={activeModal === 'disclaimer'}
        onClose={closeModal}
      />

      <AboutScreen
        isOpen={activeModal === 'about'}
        onClose={closeModal}
        onOpenDisclosure={() => openModal('disclaimer')}
      />
    </div>
  );
}

export default App;