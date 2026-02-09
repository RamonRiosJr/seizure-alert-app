import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHeartMonitor } from '../../hooks/useHeartMonitor';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Heart, Dumbbell } from 'lucide-react';

export const SettingHeartRate: React.FC = () => {
    const { t } = useTranslation();
    const [threshold, setThreshold] = useLocalStorage('hrThreshold', 100);
    const [workoutMode, setWorkoutMode] = useLocalStorage('workoutMode', false);

    // Initialize hook logic
    useHeartMonitor(() => {
        // Callback handled by GlobalListeners
    });

    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('settingsHRTitle', 'Heart Rate Safety')}
                </h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('hrThreshold', 'High Heart Rate Threshold')}
                        </label>
                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                            {threshold} BPM
                        </span>
                    </div>
                    <input
                        type="range"
                        min="80"
                        max="160"
                        step="5"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        aria-label="Heart Rate Threshold Slider"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('hrDesc', 'Alerts will trigger if heart rate exceeds this value while not in workout mode.')}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('workoutMode', 'Workout Mode')}
                        </span>
                    </div>
                    <button
                        onClick={() => setWorkoutMode(!workoutMode)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${workoutMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        aria-label={workoutMode ? 'Disable Workout Mode' : 'Enable Workout Mode'}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${workoutMode ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>
            </div>
        </div>
    );
};
