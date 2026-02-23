import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Brain, Mic, Key } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { Switch } from '../ui/Switch';
import { ApiKeyWizard } from '../ApiKeyWizard';

export const AIHubTab: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const {
    voiceActivationEnabled,
    setVoiceActivationEnabled,
    picovoiceAccessKey,
    setPicovoiceAccessKey,
    geminiApiKey,
    setGeminiApiKey,
  } = useSettings();

  return (
    <div className="space-y-6">
      <Card variant="glass" className="border-blue-500/30">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Aura Intelligence</h3>
            <p className="text-sm text-blue-200">Smart diagnostics & assistance</p>
          </div>
          <div className="ml-auto">
            <Badge variant="default">Beta</Badge>
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-200">Google AI Studio Key</p>
              <p className="text-xs text-slate-400">
                Required for advanced analysis and diagnostics.
              </p>
            </div>
            {geminiApiKey ? (
              <Badge
                variant="default"
                className="bg-green-500/20 text-green-400 border-green-500/30"
              >
                Connected
              </Badge>
            ) : (
              <Badge
                variant="default"
                className="bg-amber-500/20 text-amber-400 border-amber-500/30"
              >
                Required
              </Badge>
            )}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="gemini-api-key"
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Enter your Gemini API Key"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Key className="w-4 h-4" />
              Setup Wizard
            </button>
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
                rel="noreferrer noopener"
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

      {!picovoiceAccessKey && (
        <Card variant="default" className="border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-amber-200/70 leading-relaxed">
            <strong>Note:</strong> Voice activation is disabled until an Access Key is provided.
            Your audio is processed 100% locally and never leaves this device.
          </p>
        </Card>
      )}

      <ApiKeyWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={(key) => {
          if (key) setGeminiApiKey(key);
        }}
      />
    </div>
  );
};
