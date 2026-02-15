import React from 'react';
import { Mic, Globe, X } from 'lucide-react';

interface JournalingFABProps {
    isRecording?: boolean;
    onPress: () => void;
    lang?: 'en' | 'es';
}

/**
 * A floating action button for instant voice journaling.
 * Pulsates when recording and shows language toggle.
 */
export const JournalingFAB: React.FC<JournalingFABProps> = ({
    isRecording = false,
    onPress,
    lang = 'en'
}) => {
    return (
        <div className="fixed bottom-24 right-6 z-50">
            <button
                onClick={onPress}
                className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all duration-300 ${isRecording
                        ? 'bg-red-500 scale-110 shadow-red-500/50 animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/40 hover:scale-105'
                    }`}
                aria-label={isRecording ? "Stop Recording" : "Start Voice Journal"}
            >
                {isRecording ? (
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                ) : null}

                {isRecording ? (
                    <X className="w-8 h-8 text-white relative z-10" />
                ) : (
                    <Mic className="w-8 h-8 text-white relative z-10" />
                )}
            </button>

            {/* Language Badge */}
            <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-full shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                <Globe className="w-3 h-3 text-indigo-500" />
                {lang.toUpperCase()}
            </div>
        </div>
    );
};
