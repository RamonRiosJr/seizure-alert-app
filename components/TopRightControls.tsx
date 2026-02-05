import React from 'react';
import { Settings, ClipboardList, AlertTriangle, Heart } from 'lucide-react';
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

    const buttonClasses = 'p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600';

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => openModal('settings')}
                    className={buttonClasses}
                    aria-label="Open settings"
                >
                    <Settings className="w-6 h-6" />
                </button>
                <button
                    onClick={() => openModal('reports')}
                    className={buttonClasses}
                    aria-label={t.openReports}
                >
                    <ClipboardList className="w-6 h-6" />
                </button>
            </div>

            <button
                onClick={() => openModal('disclaimer')}
                className="p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                aria-label="Medical Disclaimer"
            >
                <AlertTriangle className="w-6 h-6" />
            </button>

            <button
                onClick={() => openModal('about')}
                className="p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50"
                aria-label={t.aboutTitle || "Our Story"}
            >
                <Heart className="w-6 h-6 animate-pulse fill-rose-600 dark:fill-rose-400" />
            </button>
        </div>
    );
}
