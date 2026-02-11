import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSettings } from '../contexts/SettingsContext';

export const useFallDetection = (onFallDetected: () => void, isTestMode: boolean = false) => {
  const { lowPowerMode } = useSettings();
  const [isEnabled] = useLocalStorage('fallDetectionEnabled', false);
  const [sensitivity] = useLocalStorage('fallSensitivity', 'medium');
  const [lastImpactTime, setLastImpactTime] = useState<number>(0);
  const [isMonitoringStillness, setIsMonitoringStillness] = useState(false);
  const [currentGForce, setCurrentGForce] = useState<number>(0);

  // Use ref to track current monitoring state for timeout callback
  const isMonitoringRef = useRef(false);
  const lastThrottleTime = useRef<number>(0);

  // Thresholds based on sensitivity
  const getThresholds = useCallback(() => {
    switch (sensitivity) {
      case 'high':
        return { impact: 15, stillness: 5000 }; // Lower G-force, 5s wait
      case 'low':
        return { impact: 25, stillness: 4000 }; // Higher G-force
      case 'medium':
      default:
        return { impact: 20, stillness: 5000 };
    }
  }, [sensitivity]);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      // In test mode, we ignore the global "isEnabled" flag
      if (!isEnabled && !isTestMode) return;

      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;

      // Calculate G-force vector length
      const gForce = Math.sqrt(x * x + y * y + z * z);

      // LOW POWER MODE OPTIMIZATION
      // If enabled, we only process every 200ms to save CPU cycles
      if (lowPowerMode) {
        const now = Date.now();
        if (now - lastThrottleTime.current < 200) {
          return;
        }
        lastThrottleTime.current = now;
      }

      // Update state for visualizer (throttle slightly in real usage if needed, but react handles it okay for now)
      setCurrentGForce(gForce);

      const thresholds = getThresholds();

      // Use ref to check current monitoring state (avoids stale closure)
      if (isMonitoringRef.current) {
        // If movement is detected during stillness phase, cancel alert
        // Normal gravity is ~9.8. Movement means significant deviation or rotation.
        // Simplified: if variance from 1G (9.8) is high, user is moving.
        if (Math.abs(gForce - 9.8) > 2) {
          // Movement detected, user is likely okay or picking up phone
          console.log(
            `Movement detected after impact - cancelling fall alert (gForce: ${gForce.toFixed(2)})`
          );
          setIsMonitoringStillness(false);
          isMonitoringRef.current = false;
          setLastImpactTime(0);
        }
      } else {
        // Detect Impact
        if (gForce > thresholds.impact) {
          console.log(`High Impact Detected: ${gForce.toFixed(2)}m/s²`);
          setLastImpactTime(Date.now());
          setIsMonitoringStillness(true);
          isMonitoringRef.current = true;
        }
      }
    },
    [isEnabled, isTestMode, getThresholds, lowPowerMode]
  );

  // Check for stillness timeout
  useEffect(() => {
    if (!isMonitoringStillness || lastImpactTime === 0) return;

    const thresholds = getThresholds();
    const timeoutId = setTimeout(() => {
      // Check ref value to get current monitoring state (not stale closure value)
      // This prevents race conditions where motion cancels monitoring
      // but the timeout was already scheduled
      if (isMonitoringRef.current) {
        console.log('Fall Confirmed: Impact + Stillness');
        onFallDetected();
        setIsMonitoringStillness(false);
        isMonitoringRef.current = false;
        setLastImpactTime(0);
      }
    }, thresholds.stillness);

    return () => clearTimeout(timeoutId);
  }, [isMonitoringStillness, lastImpactTime, onFallDetected, getThresholds]);

  // Main Motion Listener
  useEffect(() => {
    if (isEnabled || isTestMode) {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isEnabled, isTestMode, handleMotion, lowPowerMode]);

  return {
    currentGForce,
    isMonitoringStillness,
    thresholds: getThresholds(),
    sensitivity,
  };
};
