import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { translations } from '../constants';
import type { Language } from '../types';

interface DisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose, language }) => {
    const t = translations[language];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[70] backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col transform transition-all border-l-4 border-yellow-500 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                        <AlertTriangle className="w-6 h-6" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t.disclaimerTitle}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <main className="p-6 text-gray-700 dark:text-gray-300 space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>{t.disclaimerImportant}</strong> {t.disclaimerText1}
                    </div>
                    <p className="leading-relaxed">
                        {t.disclaimerText2}
                    </p>
                    <p className="leading-relaxed">
                        {t.disclaimerText3}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                        {t.disclaimerText4}
                    </p>
                </main>

                <footer className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        {t.disclaimerButton}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default DisclaimerModal;
