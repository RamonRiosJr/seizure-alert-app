export interface ConditionProfile {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    alert: string;
  };
  terminology: {
    event: string; // e.g., 'seizure', 'fall', 'incident'
    history: string; // e.g., 'Seizure History', 'Fall Log'
    actionPrompt: string; // e.g., 'I am having a seizure', 'I fell'
  };
  features: {
    seizureTypes: boolean;
    triggers: boolean;
    medications: boolean;
    audiogram: boolean; // For future specific diagnostics
  };
}
