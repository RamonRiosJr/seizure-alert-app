import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFallDetection } from '../../hooks/useFallDetection';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Activity, AlertTriangle, TestTube2 } from 'lucide-react';
import { FallDetectionTestMode } from '../FallDetectionTestMode';

export const SettingFallDetection: React.FC = () => {
    const { t } = useTranslation();
    const [isEnabled, setIsEnabled] = useLocalStorage('fallDetectionEnabled', false);
    const [sensitivity, setSensitivity] = useLocalStorage('fallSensitivity', 'medium');
    const [showTestMode, setShowTestMode] = useState(false);

    // Initialize hook to ensure listener is active if enabled
    useFallDetection(() => {
        // This callback is handled by GlobalListeners, but we need the hook here 
        // if we want to show active status or debug info, 
        // but primarily we just need to toggle the setting.
    });

    return (
        <>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {t('settingsFallDetectionTitle', 'Fall Detection (Beta)')}
                    </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('settingsFallDesc', 'Uses device sensors to detect high-impact falls followed by stillness.')}
                </p>

                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {t('enable', 'Enable Detection')}
                    </span>
                    <button
                        onClick={() => setIsEnabled(!isEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isEnabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        aria-label={isEnabled ? 'Disable Fall Detection' : 'Enable Fall Detection'}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>

                {isEnabled && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('sensitivity', 'Sensitivity')}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['low', 'medium', 'high'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSensitivity(level)}
                                        className={`py-1 px-2 rounded-lg text-xs font-medium capitalize border ${sensitivity === level
                                            ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-700 dark:text-orange-300'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-xs text-orange-800 dark:text-orange-200">
                                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>
                                    {sensitivity === 'high'
                                        ? 'High sensitivity may cause false alarms during vigorous activity.'
                                        : sensitivity === 'low'
                                            ? 'Low sensitivity requires harder impact to trigger.'
                                            : 'Balanced for daily activities.'}
                                </span>
                            </div>
                        </div>

                        {/* Test Mode Button */}
                        <button
                            onClick={() => setShowTestMode(true)}
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <TestTube2 className="w-5 h-5" />
                            {t('testFallDetection', 'Test Fall Detection')}
                        </button>
                    </div>
                )}
            </div>

            {/* Test Mode Modal */}
            {showTestMode && (
                <FallDetectionTestMode onClose={() => setShowTestMode(false)} />
            )}
        </>
    );
};
