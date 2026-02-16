import React from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';
import { Watch, Nfc } from 'lucide-react';
import { SettingHeartRate } from './SettingHeartRate';
import { SettingNFC } from './SettingNFC';

interface DevicesTabProps {
  onOpenDeviceManager: () => void;
}

export const DevicesTab: React.FC<DevicesTabProps> = ({ onOpenDeviceManager }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Heart Rate / Watch Settings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Watch className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('heartRateSafetyTitle', 'Watch & Wearables')}
            </h3>
          </div>
          <button
            onClick={onOpenDeviceManager}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-3 py-1.5 rounded-full border border-blue-400/20"
          >
            {t('scanForDevices', 'Manage Devices')}
          </button>
        </div>
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            {t('watchDesc', 'Connect your smartwatch to monitor heart rate and detect falls.')}
          </p>
          <SettingHeartRate />
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Nfc className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            {t('nfcTitle', 'Contactless Alert (NFC)')}
          </h3>
        </div>
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            {t('nfcDesc', 'Tap your phone against a special tag to trigger an alert instantly.')}
          </p>
          <SettingNFC />
        </Card>
      </section>
    </div>
  );
};
