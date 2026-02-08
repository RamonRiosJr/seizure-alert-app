import React, { useCallback, useEffect } from 'react';
import ReadyScreen from './components/ReadyScreen';
import AlertScreen from './components/AlertScreen';
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
import { useShake } from './hooks/useShake';

function App() {
  const {
    activeModal,
    screen,
    setScreen,
    closeModal,
    openModal // Needed for child props or effects
  } = useUI();

  const [theme, toggleTheme] = useTheme();

  const activateAlert = useCallback(() => {
    setScreen('alert');
  }, [setScreen]);

  // Check for emergency URL trigger (NFC/QR code/Shortcuts)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('emergency') === 'true' || params.get('mode') === 'emergency') {
      activateAlert();
    }
  }, [activateAlert]);

  // Shake to Alert
  useShake(() => {
    if (screen === 'ready') {
      activateAlert();
    }
  });

  return (
    <div className={`min-h-[100dvh] transition-colors duration-200 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>

      {screen === 'ready' && (
        <TopRightControls
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {screen === 'alert' ? (
        <AlertScreen />
      ) : (
        <ReadyScreen />
      )}

      {/* Screen Overlay for inactive state if needed, or just Conditional Rendering above */}

      <UniversalLanguageSwitcher />

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

      <InstallPrompt />
      <UpdateNotification />
    </div>
  );
}

export default App;