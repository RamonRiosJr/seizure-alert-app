import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Thresholds {
  impact: number;
  stillness: number;
}

export interface FallDetectionState {
  currentGForce: number;
  isImpactDetected: boolean;
  isMonitoringStillness: boolean;
  thresholds: Thresholds;
  sensitivity: string;
}

interface UseFallDetectionCoreProps {
  isEnabled: boolean;
  onImpact?: (gForce: number) => void;
  onFallDetected?: () => void;
  onMotionDetected?: () => void; // Called when stillness is broken
  onSensorReading?: (gForce: number) => void;
}

export const useFallDetectionCore = ({
  isEnabled,
  onImpact,
  onFallDetected,
  onMotionDetected,
  onSensorReading,
}: UseFallDetectionCoreProps) => {
  const [sensitivity] = useLocalStorage('fallSensitivity', 'medium');
  const [currentGForce, setCurrentGForce] = useState(9.8);
  const [isImpactDetected, setIsImpactDetected] = useState(false);
  const [isMonitoringStillness, setIsMonitoringStillness] = useState(false);
  const [lastImpactTime, setLastImpactTime] = useState<number>(0);

  // Use ref for internal state tracking in high-frequency event loop
  const isMonitoringRef = useRef(false);

  const getThresholds = useCallback((): Thresholds => {
    switch (sensitivity) {
      case 'high':
        return { impact: 15, stillness: 5000 };
      case 'low':
        return { impact: 25, stillness: 4000 };
      case 'medium':
      default:
        return { impact: 20, stillness: 5000 };
    }
  }, [sensitivity]);

  const thresholds = getThresholds();

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      if (!isEnabled) return;

      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;

      // Calculate G-force
      const gForce = Math.sqrt(x * x + y * y + z * z);
      setCurrentGForce(gForce);
      if (onSensorReading) onSensorReading(gForce);

      // Stillness Monitoring Phase
      if (isMonitoringRef.current) {
        // If movement detected (variance from 1G > 2)
        if (Math.abs(gForce - 9.8) > 2) {
          console.log(`Movement detected during stillness check: ${gForce.toFixed(2)}`);
          setIsMonitoringStillness(false);
          isMonitoringRef.current = false;
          setLastImpactTime(0);
          if (onMotionDetected) onMotionDetected();
        }
      }
      // Impact Detection Phase
      else {
        if (gForce > thresholds.impact) {
          console.log(`High Impact Detected: ${gForce.toFixed(2)}`);
          setLastImpactTime(Date.now());
          setIsMonitoringStillness(true);
          isMonitoringRef.current = true;
          setIsImpactDetected(true);

          if (onImpact) onImpact(gForce);

          // Reset impact flag visually after a second (for UI)
          setTimeout(() => setIsImpactDetected(false), 1000);
        }
      }
    },
    [isEnabled, thresholds.impact, onImpact, onMotionDetected, onSensorReading]
  );

  // Stillness Timeout
  useEffect(() => {
    if (!isMonitoringStillness || lastImpactTime === 0) return;

    const timeoutId = setTimeout(() => {
      if (isMonitoringRef.current) {
        console.log('Fall Confirmed');
        if (onFallDetected) onFallDetected();
        setIsMonitoringStillness(false);
        isMonitoringRef.current = false;
        setLastImpactTime(0);
      }
    }, thresholds.stillness);

    return () => clearTimeout(timeoutId);
  }, [isMonitoringStillness, lastImpactTime, thresholds.stillness, onFallDetected]);

  // Event Listener
  useEffect(() => {
    if (isEnabled) {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isEnabled, handleMotion]);

  return {
    currentGForce,
    isImpactDetected,
    isMonitoringStillness,
    thresholds,
    sensitivity,
  };
};
