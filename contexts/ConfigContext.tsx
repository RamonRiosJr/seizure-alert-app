import React, { createContext, useContext, ReactNode } from 'react';
import { ConditionProfile } from '../config/types';
import { epilepsyProfile } from '../config/profiles/epilepsy';
import { seniorProfile } from '../config/profiles/senior';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ConfigContextType {
  activeProfile: ConditionProfile;
  setProfileId: (id: string) => void;
  availableProfiles: ConditionProfile[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const profiles: Record<string, ConditionProfile> = {
  epilepsy: epilepsyProfile,
  senior: seniorProfile,
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileId, setProfileId] = useLocalStorage<string>('app_profile_id', 'epilepsy');
  const activeProfile = profiles[profileId] || epilepsyProfile;

  const availableProfiles = Object.values(profiles);

  return (
    <ConfigContext.Provider value={{ activeProfile, setProfileId, availableProfiles }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};
