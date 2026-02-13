import React from 'react';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Battery, Globe, Moon } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const SystemTab: React.FC = () => {
    const { i18n } = useTranslation();
    const {
        lowPowerMode,
        setLowPowerMode,
        preventSleep,
        setPreventSleep
    } = useSettings();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <>
            <Card>
                <div className="flex items-center space-x-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        <Battery className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white">Power & Performance</h3>
                        <p className="text-sm text-slate-400">Manage battery usage</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center">
                                <span className="text-slate-200 mr-2">Prevent Sleep</span>
                                <Badge variant="warning">High Usage</Badge>
                            </div>
                            <p className="text-xs text-slate-500">Keep screen awake while monitoring</p>
                        </div>
                        <Switch checked={preventSleep} onCheckedChange={setPreventSleep} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <span className="text-slate-200">Low Power Mode</span>
                            <p className="text-xs text-slate-500">Reduce sensor polling rate to save battery</p>
                        </div>
                        <Switch checked={lowPowerMode} onCheckedChange={setLowPowerMode} />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-purple-400" />
                        <span className="text-slate-200">Language / Idioma</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 rounded bg-slate-700 text-sm font-medium hover:bg-slate-600 transition-colors"
                    >
                        {i18n.language === 'en' ? 'English' : 'Español'}
                    </button>
                </div>
            </Card>

            <div className="text-center py-4">
                <p className="text-xs text-slate-600">Aura Speaks AI v0.1.0 (Alpha)</p>
            </div>
        </>
    );
};
