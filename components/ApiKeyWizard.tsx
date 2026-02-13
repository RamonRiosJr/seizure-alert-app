import React, { useState } from 'react';
import { X, Key, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ApiKeyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApiKeyWizard: React.FC<ApiKeyWizardProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API Key');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Test the key with a simple model call
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      await model.generateContent('Hello');

      // If success, save and close
      localStorage.setItem('gemini_api_key', JSON.stringify(apiKey));
      onSuccess();
      onClose();
    } catch (e: unknown) {
      console.error('API Verification failed:', e);
      setError('Invalid API Key. Please check and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            Connect Aura AI
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close wizard"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-purple-500' : 'bg-slate-700'}`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg h-fit">
                  <AlertCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Free Connection Required</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    To power Aura's voice features, you need a free secure key from Google. It takes
                    about 30 seconds.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-between px-4 group transition-all"
              >
                <div className="text-left">
                  <span className="block text-white font-medium">1. Get your Key</span>
                  <span className="text-xs text-slate-400">Opens Google AI Studio</span>
                </div>
                <ExternalLink className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                I have the Key <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <label htmlFor="api-key-input" className="text-sm font-medium text-slate-300">
                  Paste Key Here
                </label>
                <div className="relative">
                  <input
                    id="api-key-input"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  />
                  {apiKey && (
                    <div className="absolute right-3 top-3 text-green-500">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {error && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleValidate}
                disabled={isValidating || !apiKey}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    Verifying... <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>Connect & Save</>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-400 hover:text-white"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
