import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { Logger } from '../services/logger';

export interface SettingsContextType {
  lowPowerMode: boolean;
  setLowPowerMode: (value: boolean) => void;
  preventSleep: boolean;
  setPreventSleep: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  voiceActivationEnabled: boolean;
  setVoiceActivationEnabled: (value: boolean) => void;
  picovoiceAccessKey: string;
  setPicovoiceAccessKey: (value: string) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lowPowerMode, setLowPowerMode] = useLocalStorage<boolean>('low_power_mode', false);
  const [preventSleep, setPreventSleep] = useLocalStorage<boolean>('prevent_sleep', false);
  const [activeTab, setActiveTab] = useLocalStorage<string>('settings_active_tab', 'profile');
  const [voiceActivationEnabled, setVoiceActivationEnabled] = useLocalStorage<boolean>(
    'voice_activation_enabled',
    false
  );
  const [picovoiceAccessKey, setPicovoiceAccessKey] = useSessionStorage<string>(
    'picovoice_access_key',
    ''
  );

  // Migration: Move Picovoice Access Key from localStorage to sessionStorage if it exists
  useEffect(() => {
    try {
      const legacyKey = window.localStorage.getItem('picovoice_access_key');
      if (legacyKey) {
        // Only migrate if sessionStorage is currently empty
        const currentSessionKey = window.sessionStorage.getItem('picovoice_access_key');
        if (!currentSessionKey || currentSessionKey === '""') {
          window.sessionStorage.setItem('picovoice_access_key', legacyKey);
          // Update state to reflect migrated value
          setPicovoiceAccessKey(JSON.parse(legacyKey));
        }
        window.localStorage.removeItem('picovoice_access_key');
        Logger.info('🔒 Picovoice Access Key migrated to secure session storage.');
      }
    } catch (e) {
      Logger.error('Failed to migrate Picovoice key', e);
    }
  }, [setPicovoiceAccessKey]);

  return (
    <SettingsContext.Provider
      value={{
        lowPowerMode,
        setLowPowerMode,
        preventSleep,
        setPreventSleep,
        activeTab,
        setActiveTab,
        voiceActivationEnabled,
        setVoiceActivationEnabled,
        picovoiceAccessKey,
        setPicovoiceAccessKey,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
