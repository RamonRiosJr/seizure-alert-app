import { ConditionProfile } from '../types';

export const seniorProfile: ConditionProfile = {
  id: 'senior',
  name: 'Aura Senior',
  colors: {
    primary: '#0d47a1', // Medical Blue
    secondary: '#29b6f6', // Light Blue accent
    alert: '#d32f2f', // Clear Red
  },
  terminology: {
    event: 'Fall',
    history: 'Fall Log',
    actionPrompt: 'I fell',
  },
  features: {
    seizureTypes: false,
    triggers: false,
    medications: true,
    audiogram: false,
  },
};
