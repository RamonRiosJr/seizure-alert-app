import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
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
  const [picovoiceAccessKey, setPicovoiceAccessKey] = useLocalStorage<string>(
    'picovoice_access_key',
    ''
  );

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
