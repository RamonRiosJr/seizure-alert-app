import { useState, useEffect } from 'react';

export interface BatteryState {
  level: number; // 0.0 to 1.0
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  dischargeRate: number | null; // % per hour (negative value)
}

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  addEventListener(
    type: string,
    listener: EventListener | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListener | EventListenerObject | null,
    options?: boolean | EventListenerOptions
  ): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

// Simple in-memory history for session-based rate calculation
let batteryHistory: { time: number; level: number }[] = [];

export const useBattery = () => {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 1,
    charging: false,
    chargingTime: 0,
    dischargingTime: Infinity,
    dischargeRate: null,
  });
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && 'getBattery' in navigator;
  });

  const calculateDischargeRate = (currentLevel: number, isCharging: boolean) => {
    const now = Date.now();

    // Reset history if charging or full
    if (isCharging || currentLevel === 1) {
      batteryHistory = [];
      return null;
    }

    // Add current point
    batteryHistory.push({ time: now, level: currentLevel });

    // Improve accuracy by keeping only last 60 minutes of data
    const oneHourAgo = now - 60 * 60 * 1000;
    batteryHistory = batteryHistory.filter((p) => p.time > oneHourAgo);

    if (batteryHistory.length < 2) return null;

    const first = batteryHistory[0];
    const last = batteryHistory[batteryHistory.length - 1];

    if (!first || !last) return null;

    const timeDiffHours = (last.time - first.time) / (1000 * 60 * 60);
    const levelDiff = last.level - first.level; // Should be negative

    if (timeDiffHours < 0.05) return null; // Wait for at least 3 minutes of data

    // Return percentage per hour (e.g., -0.10 means 10% per hour)
    return parseFloat((levelDiff / timeDiffHours).toFixed(3));
  };

  useEffect(() => {
    if (!isSupported) {
      // console.warn('[useBattery] Battery Status API not supported');
      // check if we want to log this warning or just fail silently
      return;
    }

    const nav = navigator as NavigatorWithBattery;
    let batteryManager: BatteryManager | null = null;

    const updateBatteryStatus = () => {
      if (batteryManager) {
        const rate = calculateDischargeRate(batteryManager.level, batteryManager.charging);

        setBatteryState({
          level: batteryManager.level,
          charging: batteryManager.charging,
          chargingTime: batteryManager.chargingTime,
          dischargingTime: batteryManager.dischargingTime,
          dischargeRate: rate,
        });
      }
    };

    if (!nav.getBattery) return;

    nav
      .getBattery()
      .then((battery) => {
        batteryManager = battery;
        updateBatteryStatus();

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        battery.addEventListener('chargingtimechange', updateBatteryStatus);
        battery.addEventListener('dischargingtimechange', updateBatteryStatus);
      })
      .catch((err) => {
        console.error('[useBattery] Failed to get battery status:', err);
        setIsSupported(false);
      });

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', updateBatteryStatus);
        batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
        batteryManager.removeEventListener('chargingtimechange', updateBatteryStatus);
        batteryManager.removeEventListener('dischargingtimechange', updateBatteryStatus);
      }
    };
  }, [isSupported]);

  return { ...batteryState, isSupported };
};
