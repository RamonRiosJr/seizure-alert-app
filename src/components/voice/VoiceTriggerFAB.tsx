import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceTriggerFABProps {
  onPress: () => void;
  isListening: boolean;
}

export const VoiceTriggerFAB: React.FC<VoiceTriggerFABProps> = ({ onPress, isListening }) => {
  return (
    <button
      onClick={onPress}
      className={`fixed bottom-24 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all duration-300 active:scale-95 ${
        isListening
          ? 'bg-red-500 ring-4 ring-red-300 animate-pulse'
          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-2xl'
      }`}
      aria-label="Voice Control"
    >
      <Mic className="h-8 w-8 text-white" />
    </button>
  );
};
