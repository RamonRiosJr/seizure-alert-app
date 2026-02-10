import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useFallDetectionMonitor } from '../hooks/useFallDetectionMonitor';
import { GForceMeter } from './GForceMeter';
import { GForceGraph } from './GForceGraph';

interface FallDetectionTestModeProps {
    onClose: () => void;
}

/**
 * Full-screen test mode for fall detection
 * Shows real-time G-force data, visual feedback, and test instructions
 */
export const FallDetectionTestMode: React.FC<FallDetectionTestModeProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { currentGForce, isImpactDetected, isMonitoringStillness, history, thresholds } = useFallDetectionMonitor();
    const [fallConfirmed, setFallConfirmed] = useState(false);

    // Determine current status
    const getStatus = () => {
        if (fallConfirmed) {
            return {
                icon: CheckCircle,
                text: t('fallConfirmed', 'Fall Confirmed!'),
                color: 'text-red-500',
                bgColor: 'bg-red-50 dark:bg-red-900/20'
            };
        }
        if (isMonitoringStillness) {
            return {
                icon: AlertCircle,
                text: t('stillnessCheck', 'Stillness Check...'),
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
            };
        }
        if (isImpactDetected) {
            return {
                icon: AlertCircle,
                text: t('impactDetected', 'Impact Detected!'),
                color: 'text-orange-500',
                bgColor: 'bg-orange-50 dark:bg-orange-900/20'
            };
        }
        return {
            icon: Activity,
            text: t('monitoring', 'Monitoring...'),
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        };
    };

    const status = getStatus();
    const StatusIcon = status.icon;

    // Trigger fall confirmed state when stillness monitoring completes
    React.useEffect(() => {
        if (!isMonitoringStillness && isImpactDetected) {
            setFallConfirmed(true);
            setTimeout(() => setFallConfirmed(false), 3000);
        }
    }, [isMonitoringStillness, isImpactDetected]);

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-6 h-6 text-orange-500" />
                    <h2 className="text-xl font-bold text-white">
                        {t('fallDetectionTest', 'Fall Detection Test Mode')}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Close test mode"
                >
                    <X className="w-6 h-6 text-gray-400" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-w-2xl mx-auto">
                {/* Status Banner */}
                <div className={`${status.bgColor} border-2 border-current ${status.color} rounded-xl p-4 flex items-center gap-3`}>
                    <StatusIcon className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <div className="font-bold text-lg">{status.text}</div>
                        {isMonitoringStillness && (
                            <div className="text-sm opacity-75">
                                {t('keepStill', 'Keep device still for 5 seconds...')}
                            </div>
                        )}
                    </div>
                </div>

                {/* G-Force Meter */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-center">
                        {t('currentGForce', 'Current G-Force')}
                    </h3>
                    <GForceMeter
                        value={currentGForce}
                        threshold={thresholds.impact}
                        max={30}
                    />
                    <div className="mt-4 text-center text-sm text-gray-400">
                        {t('normalGravity', 'Normal gravity: ~9.8 m/s²')}
                    </div>
                </div>

                {/* Real-Time Graph */}
                <div>
                    <h3 className="text-white font-semibold mb-2">
                        {t('gForceHistory', 'G-Force History')}
                    </h3>
                    <GForceGraph
                        history={history}
                        threshold={thresholds.impact}
                        max={30}
                    />
                </div>

                {/* Test Instructions */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        {t('howToTest', 'How to Test')}
                    </h3>
                    <ol className="space-y-3 text-gray-300">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                1
                            </span>
                            <span>{t('testStep1', 'Hold your device firmly with both hands')}</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                2
                            </span>
                            <span>{t('testStep2', 'Shake vigorously or simulate a drop motion (without letting go!)')}</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                3
                            </span>
                            <span>{t('testStep3', 'Keep completely still for 5 seconds')}</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                4
                            </span>
                            <span>{t('testStep4', 'Watch for "Fall Confirmed" status and feel the vibration')}</span>
                        </li>
                    </ol>

                    <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg text-sm text-orange-200">
                        <strong>{t('note', 'Note')}:</strong> {t('testModeNote', 'Test mode will NOT trigger real emergency alerts. This is safe to test.')}
                    </div>
                </div>

                {/* Sensitivity Info */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-3">
                        {t('currentSettings', 'Current Settings')}
                    </h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                        <div className="flex justify-between">
                            <span>{t('impactThreshold', 'Impact Threshold')}:</span>
                            <span className="font-mono text-orange-400">{thresholds.impact} m/s²</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('stillnessDuration', 'Stillness Duration')}:</span>
                            <span className="font-mono text-orange-400">{thresholds.stillness / 1000}s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
