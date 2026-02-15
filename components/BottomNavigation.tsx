import React from 'react';
import {
  Settings,
  ClipboardList,
  AlertTriangle,
  Heart,
  Coffee,
  Mic,
  MicOff,
  Battery,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUI } from '../contexts/UIContext';
import { useWakeWord } from '../hooks/useWakeWord';
import { useSettings } from '../contexts/SettingsContext';
import { useBattery } from '../hooks/useBattery';

export const BottomNavigation: React.FC = () => {
  const { openModal } = useUI();
  const { t } = useTranslation();
  const { isListening, toggleListening } = useWakeWord();
  const { settings } = useSettings();
  const { level, charging } = useBattery();

  // Button styles
  const btnBase =
    'p-3 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center';
  const btnNeutral = `${btnBase} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700`;
  const btnAccent = `${btnBase} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700`;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-50 flex justify-center gap-4 pb-8 safe-area-bottom">
      {/* Voice Trigger (Left) - Only if Key exists */}
      {settings.picovoiceApiKey && (
        <button
          onClick={toggleListening}
          className={`${btnBase} ${isListening ? 'bg-blue-500 text-white shadow-blue-500/30' : 'bg-slate-800 text-slate-400'}`}
          aria-label={isListening ? 'Voice Trigger On' : 'Voice Trigger Off'}
        >
          {isListening ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
        </button>
      )}

      {/* Main Actions Group */}
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {/* Reports */}
        <button onClick={() => openModal('reports')} className={btnNeutral}>
          <ClipboardList className="w-5 h-5" />
        </button>

        {/* Battery Indicator (Mini) */}
        <div className="flex flex-col items-center px-2">
          <div className="relative">
            <Battery className={`w-5 h-5 ${level < 0.2 ? 'text-red-500' : 'text-green-500'}`} />
            {charging && (
              <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 fill-yellow-400" />
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">
            {Math.round(level * 100)}%
          </span>
        </div>

        {/* Settings */}
        <button onClick={() => openModal('settings')} className={btnNeutral}>
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Secondary Actions (Right) */}
      <button
        onClick={() => openModal('about')}
        className={`${btnBase} bg-rose-500/10 text-rose-500 hover:bg-rose-500/20`}
      >
        <Heart className="w-5 h-5" />
      </button>

      <button
        onClick={() => openModal('disclaimer')}
        className={`${btnBase} bg-amber-500/10 text-amber-500 hover:bg-amber-500/20`}
      >
        <AlertTriangle className="w-5 h-5" />
      </button>
    </div>
  );
};
