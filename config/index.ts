import { useConfigContext } from '../contexts/ConfigContext';
export type { ConditionProfile } from './types';
export { epilepsyProfile } from './profiles/epilepsy';
export { seniorProfile } from './profiles/senior';

// Use the Context hook for dynamic profile access
export const useConfig = () => {
  const { activeProfile } = useConfigContext();
  return activeProfile;
};
