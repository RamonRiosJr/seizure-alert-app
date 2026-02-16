import { useEffect, useRef, useCallback } from 'react';
import { useBLEContext } from '../contexts/BLEContext';
import { useLocalStorage } from './useLocalStorage';
import { useSettings } from '../contexts/SettingsContext';

export const useHeartMonitor = (triggerAlert: () => void) => {
  const { lowPowerMode } = useSettings();
  const { heartRate, connectedDevice } = useBLEContext();
  const [threshold] = useLocalStorage<number>('hrThreshold', 100);
  const [isWorkoutMode] = useLocalStorage<boolean>('workoutMode', false);

  // Snooze state (persisted)
  const [snoozeUntil, setSnoozeUntil] = useLocalStorage<number>('hr_snooze_until', 0);

  // Ref to prevent spamming triggers
  const lastTriggerTime = useRef<number>(0);
  // Ref for Low Power Mode throttling
  const lastCheckTime = useRef<number>(0);

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

    const now = Date.now();

    // LOW POWER MODE OPTIMIZATION
    // If enabled, we only check HR every 5 seconds instead of on every packet
    if (lowPowerMode) {
      if (now - lastCheckTime.current < 5000) {
        return;
      }
      lastCheckTime.current = now;
    }

    // Check Threshold
    if (heartRate > threshold) {
      // Debounce: Only trigger once every 60 seconds to allow user to handle it
      if (now - lastTriggerTime.current > 60000) {
        console.log(`[HeartMonitor] HR ${heartRate} > ${threshold}. Triggering Alert!`);
        triggerAlert();
        lastTriggerTime.current = now;
      }
    }
  }, [
    heartRate,
    connectedDevice,
    threshold,
    isWorkoutMode,
    triggerAlert,
    snoozeUntil,
    lowPowerMode,
  ]);

  return {
    isMonitoring: !!connectedDevice && !isWorkoutMode,
    snoozeUntil,
    snooze,
  };
};
