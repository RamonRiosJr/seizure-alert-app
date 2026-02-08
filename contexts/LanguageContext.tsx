import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();

    // Ensure language is typed correctly. i18n.language might contain region codes (en-US)
    // For this app, we simply cast or normalize if needed. 
    // Our constants.ts had 'en' | 'es'. i18next might detect 'es-ES'.
    // Simple normalization:
    const language = (i18n.language?.split('-')[0] as Language) || 'en';

    const setLanguage = (lang: Language) => {
        i18n.changeLanguage(lang);
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
