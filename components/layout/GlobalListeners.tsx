import React, { useEffect, useCallback } from 'react';
import { useUI } from '../../contexts/UIContext';
import { useShake } from '../../hooks/useShake';
import { useHeartMonitor } from '../../hooks/useHeartMonitor';
import { useFallDetection } from '../../hooks/useFallDetection';
import { useSettings } from '../../contexts/SettingsContext';
import { useBLEContext } from '../../contexts/BLEContext';
import { useWakeLock } from '../../hooks/useWakeLock';

export const GlobalListeners: React.FC = () => {
  const { screen, setScreen } = useUI();

  const activateAlert = useCallback(() => {
    setScreen('alert');
  }, [setScreen]);

  // Check for emergency URL trigger (NFC/QR code/Shortcuts)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('emergency') === 'true' || params.get('mode') === 'emergency') {
      activateAlert();
    }
  }, [activateAlert]);

  // Shake to Alert
  useShake(() => {
    if (screen === 'ready') {
      activateAlert();
    }
  });

  // Heart Rate Monitor
  useHeartMonitor(activateAlert);

  // Fall Detection
  useFallDetection(activateAlert);

  // Wake Lock Management
  const { preventSleep } = useSettings();
  const { connectedDevice } = useBLEContext();
  const { requestLock, releaseLock, isLocked } = useWakeLock();

  useEffect(() => {
    const shouldLock = preventSleep && !!connectedDevice;

    if (shouldLock) {
      if (!isLocked) {
        requestLock();
      }
    } else {
      if (isLocked) {
        releaseLock();
      }
    }

    // Re-acquire on visibility change if it was released by system
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && shouldLock && !isLocked) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [preventSleep, connectedDevice, isLocked, requestLock, releaseLock]);

  return null; // This component handles logic only, no UI
};
