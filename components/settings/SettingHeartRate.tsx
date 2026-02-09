import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Activity } from 'lucide-react';

export const SettingHeartRate = () => {
    const [threshold, setThreshold] = useLocalStorage<number>('hr_threshold', 120);

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md space-y-3">
            <label className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">High Heart Rate Threshold</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{threshold} BPM</span>
                </div>
                <input
                    type="range"
                    min="100"
                    max="180"
                    step="5"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Alert triggers if heart rate exceeds this value.</span>
            </label>
            <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Use "Workout Mode" in <strong>Device Manager</strong> to pause alerts during exercise.</p>
            </div>
        </div>
    );
};
