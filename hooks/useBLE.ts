import { useState, useCallback, useEffect } from 'react';
import { BleClient, numberToUUID } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

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

    // Simulation Mode for Development (since we can't do real BLE in simulator easily)
    const isMock = !Capacitor.isNativePlatform();

    const initBLE = useCallback(async () => {
        try {
            if (!isMock) {
                await BleClient.initialize();
            }
        } catch (e) {
            console.error('BLE Init Error:', e);
            // Fallback to mock if init fails (e.g. in browser)
        }
    }, [isMock]);

    useEffect(() => {
        initBLE();
    }, [initBLE]);

    const scan = async () => {
        setIsScanning(true);
        setDevices([]);
        setError(null);

        try {
            if (isMock) {
                // Simulate scanning delay
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
                // Note: requestDevice returns a single device selected by user in the native picker.
                // For a list, we'd use BleClient.requestLEScan(), but that's more complex permissions-wise.
                // For "Top Tier" UX, the native picker is often cleaner on iOS/Android.
                // However, to show a custom UI, we'll assume we might want to scan. 
                // Let's stick to requestDevice for now as it's most reliable for a start.
                setIsScanning(false);
            }
        } catch (e: any) {
            setError(e.message || 'Scanning failed');
            setIsScanning(false);
        }
    };

    // Keep track of the interval ID to clear it on disconnect
    const [mockIntervalId, setMockIntervalId] = useState<any>(null);

    const connect = async (device: BleDevice) => {
        try {
            if (isMock) {
                setConnectedDevice(device);
                // Start simulated HR data
                const id = setInterval(() => {
                    // Random HR between 65 and 95
                    setHeartRate(Math.floor(Math.random() * (95 - 65 + 1) + 65));
                }, 1000);
                setMockIntervalId(id);
            } else {
                await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
                setConnectedDevice(device);
                await startStreaming(device.deviceId);
            }
        } catch (e: any) {
            setError(e.message || 'Connection failed');
        }
    };

    const disconnect = async () => {
        if (!connectedDevice) return;
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

    const onDisconnect = (deviceId: string) => {
        console.log(`device ${deviceId} disconnected`);
        setConnectedDevice(null);
        setHeartRate(null);
        if (mockIntervalId) {
            clearInterval(mockIntervalId);
            setMockIntervalId(null);
        }
    };

    const startStreaming = async (deviceId: string) => {
        try {
            await BleClient.startNotifications(
                deviceId,
                HEART_RATE_SERVICE,
                HEART_RATE_MEASUREMENT_CHARACTERISTIC,
                (value) => {
                    // Parse HR format (Standard Bluetooth Spec)
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
        isMock
    };
};
