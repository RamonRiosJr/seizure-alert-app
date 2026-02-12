import { ConditionProfile } from '../types';

export const epilepsyProfile: ConditionProfile = {
  id: 'epilepsy',
  name: 'Aura Seizure',
  colors: {
    primary: '#6200ee', // Current Purple
    secondary: '#03dac6', // Current Teal accent
    alert: '#b00020', // Error Red
  },
  terminology: {
    event: 'Seizure',
    history: 'Seizure History',
    actionPrompt: 'I am having a seizure',
  },
  features: {
    seizureTypes: true,
    triggers: true,
    medications: true,
    audiogram: false,
  },
};
