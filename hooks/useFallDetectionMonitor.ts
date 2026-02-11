import { useState } from 'react';
import { useFallDetectionCore, FallDetectionState } from './useFallDetectionCore';

interface FallDetectionMonitorData extends FallDetectionState {
  history: number[];
}

/**
 * Hook for monitoring fall detection in real-time (for test mode)
 * Provides live G-force data, detection states, and history for visualization
 */
export const useFallDetectionMonitor = (): FallDetectionMonitorData => {
  const [history, setHistory] = useState<number[]>([]);

  const core = useFallDetectionCore({
    isEnabled: true, // Always listen when in test mode/monitor
    onSensorReading: (gForce) => {
      setHistory((prev) => {
        const newHistory = [...prev, gForce];
        return newHistory.slice(-50); // Keep last 50 readings
      });
    },
  });

  return {
    ...core,
    history,
  };
};
