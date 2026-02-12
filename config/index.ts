import { epilepsyProfile } from './profiles/epilepsy';
import { ConditionProfile } from './types';

// In the future, this can be swapped at build time or via ENV variable
export const activeProfile: ConditionProfile = epilepsyProfile;

export const useConfig = () => {
  return activeProfile;
};
