import { useState, useEffect } from 'react';

export interface BatteryState {
  level: number; // 0.0 to 1.0
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
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

export const useBattery = () => {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 1,
    charging: false,
    chargingTime: 0,
    dischargingTime: Infinity,
  });
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && 'getBattery' in navigator;
  });

  useEffect(() => {
    if (!isSupported) {
      console.warn('[useBattery] Battery Status API not supported');
      return;
    }

    const nav = navigator as NavigatorWithBattery;
    let batteryManager: BatteryManager | null = null;

    const updateBatteryStatus = () => {
      if (batteryManager) {
        setBatteryState({
          level: batteryManager.level,
          charging: batteryManager.charging,
          chargingTime: batteryManager.chargingTime,
          dischargingTime: batteryManager.dischargingTime,
        });
      }
    };

    nav
      .getBattery()
      .then((battery) => {
        batteryManager = battery;
        // setIsSupported(true); // Already set lazily
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
