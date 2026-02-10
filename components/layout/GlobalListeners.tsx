import React, { useEffect, useCallback } from 'react';
import { useUI } from '../../contexts/UIContext';
import { useShake } from '../../hooks/useShake';
import { useHeartMonitor } from '../../hooks/useHeartMonitor';
import { useFallDetection } from '../../hooks/useFallDetection';

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

  return null; // This component handles logic only, no UI
};
