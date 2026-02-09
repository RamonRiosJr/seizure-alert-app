import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Activity, Info } from 'lucide-react';

export const SettingFallDetection = () => {
    const [isEnabled, setIsEnabled] = useLocalStorage<boolean>('fall_detection_enabled', false);
    const [sensitivity, setSensitivity] = useLocalStorage<string>('fall_sensitivity', 'medium');

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md space-y-4">
            <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Enable Fall Detection</span>
                <button
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            {isEnabled && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sensitivity</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['low', 'medium', 'high'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setSensitivity(level)}
                                className={`px-3 py-2 text-sm rounded-md border capitalize transiton-colors ${sensitivity === level
                                    ? 'bg-orange-100 border-orange-500 text-orange-700 dark:bg-orange-900/30 dark:border-orange-500 dark:text-orange-300'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        High: 15g impact. Medium: 20g. Low: 30g.
                    </p>
                    <div className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>Alerts only trigger if you remain <strong>still</strong> for 5 seconds after a fall.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
