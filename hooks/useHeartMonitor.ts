import { useEffect, useRef } from 'react';
import { useBLEContext } from '../contexts/BLEContext';
import { useLocalStorage } from './useLocalStorage';

export const useHeartMonitor = (triggerAlert: () => void) => {
  const { heartRate, connectedDevice } = useBLEContext();
  const [threshold] = useLocalStorage<number>('hr_threshold', 120);
  const [isWorkoutMode] = useLocalStorage<boolean>('workout_mode', false);

  // Ref to prevent spamming triggers
  const lastTriggerTime = useRef<number>(0);

  useEffect(() => {
    if (!connectedDevice || !heartRate) return;

    // Safety checks
    if (isWorkoutMode) return;

    // Check Threshold
    if (heartRate > threshold) {
      const now = Date.now();
      // Debounce: Only trigger once every 60 seconds to allow user to handle it
      if (now - lastTriggerTime.current > 60000) {
        console.log(`[HeartMonitor] HR ${heartRate} > ${threshold}. Triggering Alert!`);
        triggerAlert();
        lastTriggerTime.current = now;
      }
    }
  }, [heartRate, connectedDevice, threshold, isWorkoutMode, triggerAlert]);

  return { isMonitoring: !!connectedDevice && !isWorkoutMode };
};
