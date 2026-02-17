import React from 'react';
import { X } from 'lucide-react';

interface ListeningOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  recognizedCommand: string | null;
}

export const ListeningOverlay: React.FC<ListeningOverlayProps> = ({
  isOpen,
  onClose,
  recognizedCommand,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-2 text-white/80 hover:text-white"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Visualizer (CSS Animation) */}
      <div className="relative flex items-center justify-center">
        {/* Core Pulse */}
        <div className="absolute h-32 w-32 rounded-full bg-indigo-500/50 animate-ping" />
        <div className="absolute h-24 w-24 rounded-full bg-purple-500/50 animate-pulse delay-75" />
        <div className="z-10 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 shadow-[0_0_40px_rgba(129,140,248,0.6)]" />
      </div>

      {/* Status Text */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {recognizedCommand ? <span className="text-green-400">Success!</span> : 'Listening...'}
        </h2>
        <p className="mt-2 text-lg text-indigo-200">
          {recognizedCommand ? (
            <>
              Heard command: <strong className="text-white">"{recognizedCommand}"</strong>
            </>
          ) : (
            "Say 'Help' or 'Status'"
          )}
        </p>
      </div>
    </div>
  );
};
