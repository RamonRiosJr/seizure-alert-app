import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { PeopleTab } from './PeopleTab';
import { SafetyTab } from './SafetyTab';
import { DevicesTab } from './DevicesTab';
import { CareTab } from './CareTab';
import { AIHubTab } from './AIHubTab';
import { Users, ShieldCheck, Watch, Brain, Battery } from 'lucide-react';
import { DeviceManager } from '../DeviceManager';

export const SettingsHub: React.FC = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useSettings();
  const [isDeviceManagerOpen, setIsDeviceManagerOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header - Fixed */}
      <div className="p-4 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex-shrink-0">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {t('settingsTitle')}
        </h1>
      </div>

      <Tabs
        defaultValue="people"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Tab List - Fixed */}
        <div className="px-2 py-2 bg-slate-900 border-b border-white/5 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 h-12">
            <TabsTrigger value="people" className="flex flex-col md:flex-row gap-1 py-1">
              <Users className="h-4 w-4" />
              <span className="text-[10px] md:text-xs">{t('settingsContacts', 'People')}</span>
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex flex-col md:flex-row gap-1 py-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] md:text-xs">{t('safetyTab', 'Safety')}</span>
            </TabsTrigger>
            <TabsTrigger value="aura" className="flex flex-col md:flex-row gap-1 py-1">
              <Brain className="h-4 w-4" />
              <span className="text-[10px] md:text-xs">{t('aiHubTab', 'Aura AI')}</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex flex-col md:flex-row gap-1 py-1">
              <Watch className="h-4 w-4" />
              <span className="text-[10px] md:text-xs">{t('devicesTab', 'Devices')}</span>
            </TabsTrigger>
            <TabsTrigger value="care" className="flex flex-col md:flex-row gap-1 py-1">
              <Battery className="h-4 w-4" />
              <span className="text-[10px] md:text-xs">{t('careTab', 'Phone Care')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-24 pb-safe">
          <div className="max-w-2xl mx-auto px-4 w-full">
            <TabsContent value="people" className="mt-0">
              <PeopleTab />
            </TabsContent>

            <TabsContent value="safety" className="mt-0">
              <SafetyTab />
            </TabsContent>

            <TabsContent value="aura" className="mt-0">
              <AIHubTab />
            </TabsContent>

            <TabsContent value="devices" className="mt-0">
              <DevicesTab onOpenDeviceManager={() => setIsDeviceManagerOpen(true)} />
            </TabsContent>

            <TabsContent value="care" className="mt-0">
              <CareTab />
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {isDeviceManagerOpen && <DeviceManager onClose={() => setIsDeviceManagerOpen(false)} />}
    </div>
  );
};
