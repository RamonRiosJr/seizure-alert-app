import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
        resources: {
            en: {
                translation: {
                    aiButton: "AI",
                    checkInButton: "I'm Safe / Check In",
                    imSafeMessage: "I am safe. This was a false alarm.",
                    noContactsPrompt: "No emergency contacts set. Add one now?",
                }
            },
            es: {
                translation: {
                    title: "Aura Speaks AI",
                    emergencyButton: "EMERGENCIA",
                    aiButton: "IA",
                    checkInButton: "Estoy Bien / Reportar",
                    imSafeMessage: "Estoy bien. Fue una falsa alarma.",
                    noContactsPrompt: "No hay contactos de emergencia. ¿Agregar uno ahora?",
                }
            }
        },
        backend: {
            loadPath: './locales/{{lng}}/{{ns}}.json',
        },
    });

export default i18n;
