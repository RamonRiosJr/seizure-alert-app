import React from 'react';
import { SettingsHub } from './settings/SettingsHub';
import { X } from 'lucide-react';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl relative border border-slate-700/50">
        {/* Close Button Overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-full backdrop-blur-md transition-colors border border-slate-700 shadow-lg"
          aria-label="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>

        <SettingsHub />
      </div>
    </div>
  );
};

export default SettingsScreen;
