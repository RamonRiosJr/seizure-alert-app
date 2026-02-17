import { useState, useCallback } from 'react';

interface UseVoiceMockReturn {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  command: string | null;
}

export function useVoiceMock(): UseVoiceMockReturn {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState<string | null>(null);

  const startListening = useCallback(() => {
    setIsListening(true);
    setCommand(null);

    // Mock: Simulate "hearing" a command after 3 seconds
    setTimeout(() => {
      setCommand('Help');
      // In a real app, this would trigger the actual action
      console.log("🎤 Data Bridge: Voice Command 'Help' Recognized");

      // Auto-close after recognition
      setTimeout(() => {
        setIsListening(false);
      }, 1500);
    }, 3000);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setCommand(null);
  }, []);

  return { isListening, startListening, stopListening, command };
}
