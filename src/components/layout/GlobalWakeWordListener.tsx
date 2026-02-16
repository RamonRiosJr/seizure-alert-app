import React from 'react';
import { useWakeWord } from '../../hooks/useWakeWord';

/**
 * GlobalWakeWordListener
 * A non-visual component that activates the useWakeWord hook globally.
 */
export const GlobalWakeWordListener: React.FC = () => {
  // Activating the hook at the top level
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isListening, error } = useWakeWord();

  // Log errors globally for debugging in dev
  React.useEffect(() => {
    if (error) {
      console.warn('Voice Activation Error:', error);
    }
  }, [error]);

  return null; // This component has no UI
};
