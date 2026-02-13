import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { ProfileTab } from './ProfileTab';
import { AlertsTab } from './AlertsTab';
import { SystemTab } from './SystemTab';
import { AIHubTab } from './AIHubTab';
import { User, Bell, Cpu, Brain } from 'lucide-react';

export const SettingsHub: React.FC = () => {
    const { t } = useTranslation();
    const { activeTab, setActiveTab } = useSettings();

    return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-100">
            <div className="p-4 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {t('settings.title', 'Settings')}
                </h1>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <Tabs
                    defaultValue="profile"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col"
                >
                    <div className="px-4 py-2 bg-slate-900 shadow-sm z-10">
                        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                            <TabsTrigger value="profile">
                                <User className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">{t('settings.tabs.profile', 'Profile')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="alerts">
                                <Bell className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">{t('settings.tabs.alerts', 'Alerts')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="ai">
                                <Brain className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">{t('settings.tabs.ai', 'AI Hub')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="system">
                                <Cpu className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">{t('settings.tabs.system', 'System')}</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 safe-area-bottom">
                        <TabsContent value="profile" className="mt-0 space-y-4">
                            <ProfileTab />
                        </TabsContent>

                        <TabsContent value="alerts" className="mt-0 space-y-4">
                            <AlertsTab />
                        </TabsContent>

                        <TabsContent value="ai" className="mt-0 space-y-4">
                            <AIHubTab />
                        </TabsContent>

                        <TabsContent value="system" className="mt-0 space-y-4">
                            <SystemTab />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};
