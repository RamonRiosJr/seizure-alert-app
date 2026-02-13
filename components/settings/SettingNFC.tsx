import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, Check, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Card';

export const SettingNFC: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'writing' | 'success' | 'error'>('idle');

  const handleWriteTag = async () => {
    try {
      if (!('NDEFReader' in window)) {
        alert(
          t('settingsNFCNotSupported', {
            url: window.location.href + '?emergency=true',
          })
        );
        return;
      }

      setStatus('writing');
      // @ts-ignore - Web NFC API is experimental
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: 'url',
            data: window.location.origin + window.location.pathname + '?emergency=true',
          },
        ],
      });
      setStatus('success');
      alert(t('nfcSuccess'));
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      alert(t('nfcWriteFailed'));
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <Card>
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">
            {t('nfcActivationTitle', 'NFC Activation')}
          </h3>
          <p className="text-sm text-slate-400">
            {t('nfcActivationDesc', 'Tap-to-Alert programming')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          {t(
            'nfcDesc',
            'Program an NFC tag to instantly launch this app in Emergency Mode when tapped.'
          )}
        </p>

        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center">
            <HelpCircle className="w-3 h-3 mr-1" />
            {t('nfcHowToUse', 'How to use')}
          </h4>
          <ol className="text-[10px] text-slate-400 space-y-1 list-decimal list-inside">
            <li>{t('nfcStep1', 'Tap the button below')}</li>
            <li>{t('nfcStep2', 'Hold phone near writable tag')}</li>
            <li>{t('nfcStep3', 'Tag is programmed with Emergency Link')}</li>
          </ol>
        </div>

        <button
          onClick={handleWriteTag}
          disabled={status === 'writing'}
          className={`w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            status === 'writing'
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : status === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {status === 'writing' ? (
            'Programming...'
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              {t('nfcSuccess', 'Success!')}
            </>
          ) : (
            t('nfcStartBtn', 'Start NFC Programming')
          )}
        </button>
      </div>
    </Card>
  );
};
