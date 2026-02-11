import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
  lowPowerMode: boolean;
  setLowPowerMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lowPowerMode, setLowPowerMode] = useLocalStorage<boolean>('low_power_mode', false);

  return (
    <SettingsContext.Provider value={{ lowPowerMode, setLowPowerMode }}>
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
