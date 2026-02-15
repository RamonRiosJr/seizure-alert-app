import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Brain, Mic, Sparkles } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { Switch } from '../ui/Switch';
import { ApiKeyWizard } from '../ApiKeyWizard';

export const AIHubTab: React.FC = () => {
  const {
    voiceActivationEnabled,
    setVoiceActivationEnabled,
    picovoiceAccessKey,
    setPicovoiceAccessKey,
    geminiApiKey,
  } = useSettings();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Gemini AI Settings */}
      <Card variant="glass" className="border-purple-500/30">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gemini AI Connection</h3>
            <p className="text-sm text-purple-200">Generative AI Capabilities</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300 font-medium">
              {geminiApiKey ? '✅ Connected to Gemini AI' : '🔴 Not Connected'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Required for advanced chat and analysis.
            </p>
          </div>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {geminiApiKey ? 'Update Key' : 'Connect'}
          </button>
        </div>
      </Card>

      {/* Picovoice Settings */}
      <Card variant="glass" className="border-blue-500/30">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Voice Activation</h3>
            <p className="text-sm text-blue-200">"Hey Aura" Wake Word</p>
          </div>
          <div className="ml-auto">
            <Badge variant="default">Beta</Badge>
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 mb-6">
          <p className="text-sm text-slate-300">
            Voice activation requires a <strong>Picovoice Access Key</strong> to process "Hey Aura"
            locally on your device.
          </p>
          <div className="mt-4 space-y-2">
            <label
              htmlFor="picovoice-key"
              className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Picovoice Access Key
            </label>
            <input
              id="picovoice-key"
              type="password"
              value={picovoiceAccessKey}
              onChange={(e) => setPicovoiceAccessKey(e.target.value)}
              placeholder="Enter your Access Key"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <p className="text-[10px] text-slate-500 italic">
              Get a free key at{' '}
              <a
                href="https://console.picovoice.ai/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                console.picovoice.ai
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg transition-colors ${voiceActivationEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}
            >
              <Mic className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">Hands-Free Trigger</span>
              <span className="text-xs text-slate-500">Enable "Hey Aura" wake-word</span>
            </div>
          </div>
          <Switch
            checked={voiceActivationEnabled}
            onCheckedChange={setVoiceActivationEnabled}
            disabled={!picovoiceAccessKey}
          />
        </div>
      </Card>

      <ApiKeyWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => setIsWizardOpen(false)}
      />

      {!picovoiceAccessKey && (
        <Card variant="default" className="border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-amber-200/70 leading-relaxed">
            <strong>Note:</strong> Voice activation is disabled until an Access Key is provided.
            Your audio is processed 100% locally and never leaves this device.
          </p>
        </Card>
      )}
    </div>
  );
};
