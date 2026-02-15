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
  geminiApiKey: string;
  setGeminiApiKey: (value: string) => void;
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
  const [geminiApiKey, setGeminiApiKey] = useSessionStorage<string>('gemini_api_key', '');

  // Migration: Move keys from localStorage to sessionStorage if they exist
  useEffect(() => {
    const migrateKey = (
      keyName: string,
      setter: (val: string) => void,
      label: string
    ) => {
      try {
        const legacyKey = window.localStorage.getItem(keyName);
        if (legacyKey) {
          // Only migrate if sessionStorage is currently empty
          const currentSessionKey = window.sessionStorage.getItem(keyName);
          if (!currentSessionKey || currentSessionKey === '""') {
            window.sessionStorage.setItem(keyName, legacyKey);
            // Update state to reflect migrated value
            setter(JSON.parse(legacyKey));
          }
          window.localStorage.removeItem(keyName);
          Logger.info(`🔒 ${label} migrated to secure session storage.`);
        }
      } catch (e) {
        Logger.error(`Failed to migrate ${label}`, e);
      }
    };

    migrateKey('picovoice_access_key', setPicovoiceAccessKey, 'Picovoice Access Key');
    migrateKey('gemini_api_key', setGeminiApiKey, 'Gemini API Key');
  }, [setPicovoiceAccessKey, setGeminiApiKey]);

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
        geminiApiKey,
        setGeminiApiKey,
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
