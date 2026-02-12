import { useState, useCallback, useEffect, useRef } from 'react';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { useLocalStorage } from './useLocalStorage';

// Standard Heart Rate Service UUIDs
const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_MEASUREMENT_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';

export interface BleDevice {
  deviceId: string;
  name?: string;
}

export const useBLE = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastConnectedDevice, setLastConnectedDevice] = useLocalStorage<BleDevice | null>(
    'last_ble_device',
    null
  );
  const lastConnectedDeviceRef = useRef<BleDevice | null>(null);
  const isManualDisconnect = useRef(false); // Track if disconnect was user-initiated

  // Keep ref in sync with state/storage so callbacks always see the latest
  useEffect(() => {
    lastConnectedDeviceRef.current = lastConnectedDevice;
  }, [lastConnectedDevice]);

  // Simulation Mode for Development
  const isMock = !Capacitor.isNativePlatform();

  const initBLE = useCallback(async () => {
    try {
      if (!isMock) {
        await BleClient.initialize();
      }
    } catch (e) {
      console.error('BLE Init Error:', e);
    }
  }, [isMock]);

  // Auto-connect on startup if we have a saved device and it wasn't a manual disconnect
  // (Optional: For now we only reconnect if active session drops, but we could add startup reconnect later)

  useEffect(() => {
    initBLE();
  }, [initBLE]);

  const scan = async () => {
    setIsScanning(true);
    setDevices([]);
    setError(null);

    try {
      if (isMock) {
        setTimeout(() => {
          setDevices([
            { deviceId: 'mock-1', name: 'Simulated HR Monitor' },
            { deviceId: 'mock-2', name: 'Polar H10 (Demo)' },
          ]);
          setIsScanning(false);
        }, 1500);
      } else {
        await BleClient.requestDevice({
          services: [HEART_RATE_SERVICE],
          optionalServices: [],
        });
        setIsScanning(false);
      }
    } catch (e: any) {
      setError(e.message || 'Scanning failed');
      setIsScanning(false);
    }
  };

  const [mockIntervalId, setMockIntervalId] = useState<any>(null);

  const connect = async (device: BleDevice) => {
    try {
      setError(null);
      isManualDisconnect.current = false; // Reset flag

      if (isMock) {
        setConnectedDevice(device);
        setLastConnectedDevice(device);

        const id = setInterval(() => {
          setHeartRate(Math.floor(Math.random() * (95 - 65 + 1) + 65));
        }, 1000);
        setMockIntervalId(id);
      } else {
        await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
        setConnectedDevice(device);
        setLastConnectedDevice(device);
        await startStreaming(device.deviceId);
      }
    } catch (e: any) {
      setError(e.message || 'Connection failed');
      setLastConnectedDevice(null);
    }
  };

  const disconnect = async () => {
    if (!connectedDevice) return;

    // Set flag BEFORE disconnecting so onDisconnect knows it's intentional
    isManualDisconnect.current = true;
    setLastConnectedDevice(null); // Clear saved device on manual disconnect

    try {
      if (isMock) {
        setConnectedDevice(null);
        setHeartRate(null);
        if (mockIntervalId) {
          clearInterval(mockIntervalId);
          setMockIntervalId(null);
        }
      } else {
        await BleClient.disconnect(connectedDevice.deviceId);
        setConnectedDevice(null);
        setHeartRate(null);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const attemptReconnect = async (deviceId: string) => {
    const lastDevice = lastConnectedDeviceRef.current;

    if (!lastDevice || lastDevice.deviceId !== deviceId) {
      console.warn('Cannot reconnect: Device mismatch or not found', { lastDevice, deviceId });
      return; // Don't reconnect if we forgot the device
    }

    setIsReconnecting(true);
    console.log(`Attempting to reconnect to ${deviceId}...`);

    // Retry 3 times
    for (let i = 0; i < 3; i++) {
      try {
        if (isMock) {
          // Mock reconnect
          await new Promise((resolve) => setTimeout(resolve, 1500));
          // Success!
          connect(lastDevice);
          setIsReconnecting(false);
          return;
        } else {
          await BleClient.connect(deviceId, (id) => onDisconnect(id));
          console.log('Reconnected successfully!');
          setConnectedDevice(lastDevice);
          await startStreaming(deviceId);
          setIsReconnecting(false);
          return;
        }
      } catch (e) {
        console.warn(`Reconnect attempt ${i + 1} failed`, e);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s
      }
    }

    setIsReconnecting(false);
    setError('Connection lost. Please reconnect manually.');
    setConnectedDevice(null); // Ensure UI reflects disconnected
  };

  const onDisconnect = (deviceId: string) => {
    console.log(`device ${deviceId} disconnected`);
    setConnectedDevice(null);
    setHeartRate(null);

    if (mockIntervalId) {
      clearInterval(mockIntervalId);
      setMockIntervalId(null);
    }

    // Check if we should auto-reconnect
    if (!isManualDisconnect.current) {
      console.log('Accidental disconnect detected. Initiating auto-reconnect...');
      attemptReconnect(deviceId);
    } else {
      console.log('Manual disconnect completed.');
    }
  };

  const startStreaming = async (deviceId: string) => {
    try {
      await BleClient.startNotifications(
        deviceId,
        HEART_RATE_SERVICE,
        HEART_RATE_MEASUREMENT_CHARACTERISTIC,
        (value) => {
          const data = new DataView(value.buffer);
          const flags = data.getUint8(0);
          let hr;
          if ((flags & 0x01) === 0) {
            hr = data.getUint8(1);
          } else {
            hr = data.getUint16(1, true);
          }
          setHeartRate(hr);
        }
      );
    } catch (e) {
      console.error('Error starting notifications', e);
    }
  };

  return {
    scan,
    connect,
    disconnect,
    isScanning,
    devices,
    connectedDevice,
    heartRate,
    error,
    isMock,
    isReconnecting,
  };
};
