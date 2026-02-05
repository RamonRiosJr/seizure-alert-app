import React from 'react';
import { X, ExternalLink, Heart, Github, Globe, Cloud, Coffee } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutScreenProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenDisclosure: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ isOpen, onClose, onOpenDisclosure }) => {
    const { language } = useLanguage();
    const t = translations[language];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-rose-600">
                        <Heart className="w-6 h-6 fill-current" />
                        {t.aboutTitle || "Our Story"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">

                    {/* Origin Story */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t.aboutOriginTitle || "The Medellin Incident"}
                        </h3>
                        <p className="italic border-l-4 border-rose-200 pl-4 py-1">
                            "{t.aboutStory || "I had a near seizure... I was eating a sandwich and a coffee in the airport in Medellin, when suddenly it hit me. I didn't have a way to express myself, words went away. I pulled my phone but to call who? My girlfriend an hour away? I needed to communicate but my mind had thousands of thoughts and déjá vus, unable to find the word 'seizure'. I drank my coffee rapidly and the symptoms faded a bit and I was able to stabilize. All I needed in that moment was a Button to press and others to be able to identify what was happening."}"
                        </p>
                        <div className="flex justify-end">
                            <a
                                href="https://buymeacoffee.com/RamonRiosJr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-black rounded-lg font-bold shadow-sm hover:bg-[#FFEA00] transition-colors text-sm"
                            >
                                <Coffee className="w-4 h-4" />
                                Buy me a coffee
                            </a>
                        </div>
                    </div>

                    {/* Mission/Disclaimer */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                            {t.aboutMissionTitle || "Our Mission"}
                        </h4>
                        <p className="text-sm">
                            {t.aboutMissionText || "This is not a medical app but a tool to inspire and help potentially others. Please read our full disclosure."}
                        </p>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onOpenDisclosure(); }}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium mt-2 hover:underline"
                        >
                            {t.aboutReadDisclosure || "Read Full Disclosure"} <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Links */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t.aboutConnectTitle || "Connect with the Developer"}
                        </h3>

                        <a
                            href="https://github.com/RamonRiosJr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            <div>
                                <div className="font-medium">My Projects</div>
                                <div className="text-xs opacity-70">github.com/RamonRiosJr</div>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                        </a>

                        <a
                            href="https://coqui.cloud"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Cloud className="w-5 h-5 text-sky-500" />
                            <div>
                                <div className="font-medium">{t.aboutCompanyTitle || "Coqui Cloud Dev Co."}</div>
                                <div className="text-xs opacity-70">coqui.cloud</div>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                        </a>

                        <a
                            href="https://ramonrios.net"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Globe className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="font-medium">Contact Me</div>
                                <div className="text-xs opacity-70">RamonRios.net</div>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutScreen;
