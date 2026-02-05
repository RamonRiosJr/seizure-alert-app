import React from 'react';
import { Settings, ClipboardList, AlertTriangle, Heart, Coffee } from 'lucide-react';
import { translations } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';

interface TopRightControlsProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export default function TopRightControls({ theme, toggleTheme }: TopRightControlsProps) {
    const { language } = useLanguage();
    const { openModal } = useUI();
    const t = translations[language];

    const buttonClasses = 'p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95';

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-3">
            {/* Top Row: Story, Coffee, Disclosure */}
            <div className="flex items-center gap-3">
                {/* 1. My Story - High Priority */}
                <button
                    onClick={() => openModal('about')}
                    className="p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 hover:scale-105 active:scale-95"
                    aria-label={t.aboutTitle || "Our Story"}
                >
                    <Heart className="w-7 h-7 animate-pulse fill-rose-600 dark:fill-rose-400" />
                </button>

                {/* 2. Buy me a coffee */}
                <a
                    href="https://buymeacoffee.com/RamonRiosJr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-[#FFDD00] text-black hover:bg-[#FFEA00] hover:scale-105 active:scale-95"
                    aria-label="Buy me a coffee"
                >
                    <Coffee className="w-6 h-6" />
                </a>

                {/* 3. Disclaimer */}
                <button
                    onClick={() => openModal('disclaimer')}
                    className="p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 hover:scale-105 active:scale-95"
                    aria-label="Medical Disclaimer"
                >
                    <AlertTriangle className="w-6 h-6" />
                </button>
            </div>

            {/* Dropping Down: Reports */}
            <button
                onClick={() => openModal('reports')}
                className={buttonClasses}
                aria-label={t.openReports}
            >
                <ClipboardList className="w-6 h-6" />
            </button>

            {/* Dropping Down: Settings */}
            <button
                onClick={() => openModal('settings')}
                className={buttonClasses}
                aria-label="Open settings"
            >
                <Settings className="w-6 h-6" />
            </button>
        </div>
    );
}
