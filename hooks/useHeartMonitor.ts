import { useEffect, useRef, useCallback } from 'react';
import { useBLEContext } from '../contexts/BLEContext';
import { useLocalStorage } from './useLocalStorage';

export const useHeartMonitor = (triggerAlert: () => void) => {
  const { heartRate, connectedDevice } = useBLEContext();
  const [threshold] = useLocalStorage<number>('hr_threshold', 120);
  const [isWorkoutMode] = useLocalStorage<boolean>('workout_mode', false);

  // Snooze state (persisted)
  const [snoozeUntil, setSnoozeUntil] = useLocalStorage<number>('hr_snooze_until', 0);

  // Ref to prevent spamming triggers
  const lastTriggerTime = useRef<number>(0);

  const snooze = useCallback(
    (durationMs: number) => {
      const until = Date.now() + durationMs;
      setSnoozeUntil(until);
      console.log(`[HeartMonitor] Snoozed alerts for ${durationMs / 60000} minutes`);
    },
    [setSnoozeUntil]
  );

  useEffect(() => {
    if (!connectedDevice || !heartRate) return;

    // Safety checks
    if (isWorkoutMode) return;

    // Check Snooze
    if (Date.now() < snoozeUntil) {
      return;
    }

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
  }, [heartRate, connectedDevice, threshold, isWorkoutMode, triggerAlert, snoozeUntil]);

  return {
    isMonitoring: !!connectedDevice && !isWorkoutMode,
    snoozeUntil,
    snooze,
  };
};
