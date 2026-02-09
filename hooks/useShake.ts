import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface ShakeOptions {
    threshold?: number; // Acceleration threshold in m/s²
    timeout?: number;   // Reset timeout in ms
    requiredShakes?: number; // Number of shakes required
}

export const useShake = (onShake: () => void, options: ShakeOptions = {}) => {
    const {
        threshold = 15,
        timeout = 1000,
        requiredShakes = 3
    } = options;

    const [isEnabled, setIsEnabled] = useLocalStorage<boolean>('shake_enabled', false);

    // Lazy initialization for support and permission to avoid effect updates
    const [isSupported] = useState<boolean>(() => typeof window !== 'undefined' && 'DeviceMotionEvent' in window);

    const [permissionGranted, setPermissionGranted] = useState<boolean>(() => {
        if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DME = (window as any).DeviceMotionEvent;
        // If requestPermission is NOT a function, it's likely non-iOS (Android) or old iOS where perms are auto-granted
        return typeof DME?.requestPermission !== 'function';
    });

    // Shake detection state
    const shakesRef = useRef<number>(0);
    const lastShakeTimeRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const lastXRef = useRef<number>(0);
    const lastYRef = useRef<number>(0);
    const lastZRef = useRef<number>(0);

    // Remove useEffect that was setting these values

    const requestPermission = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DME = window.DeviceMotionEvent as any;
        if (typeof DME.requestPermission === 'function') {
            try {
                const permissionState = await DME.requestPermission();
                if (permissionState === 'granted') {
                    setPermissionGranted(true);
                    return true;
                }
            } catch (error) {
                console.error('Error requesting device motion permission:', error);
            }
            return false;
        }
        return true; // Implied true for non-iOS
    }, []);

    // Polyfill type for older TS environments if needed
    interface DeviceAcceleration {
        x: number | null;
        y: number | null;
        z: number | null;
    }

    type DeviceMotionEventWithAcceleration = DeviceMotionEvent & {
        accelerationIncludingGravity: DeviceAcceleration;
    }

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (!isEnabled) return;

        const current = event.accelerationIncludingGravity;
        if (!current || current.x === null || current.y === null || current.z === null) return;

        const currentTime = Date.now();

        // Simple verification content
        // We only process if enough time has passed (100ms) to avoid noise
        if ((currentTime - lastTimeRef.current) > 100) {
            const diffTime = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;

            const speed = Math.abs(current.x + current.y + current.z - lastXRef.current - lastYRef.current - lastZRef.current) / diffTime * 10000;

            if (speed > threshold * 100) { // Scaling for sensitivity
                // Check if this is a subsequent shake within the timeout
                if (currentTime - lastShakeTimeRef.current < timeout) {
                    shakesRef.current += 1;
                } else {
                    shakesRef.current = 1; // Reset if too slow
                }

                lastShakeTimeRef.current = currentTime;

                if (shakesRef.current >= requiredShakes) {
                    onShake();
                    shakesRef.current = 0; // Reset after trigger
                }
            }

            lastXRef.current = current.x;
            lastYRef.current = current.y;
            lastZRef.current = current.z;
        }
    }, [isEnabled, onShake, threshold, timeout, requiredShakes]);

    useEffect(() => {
        if (isEnabled && permissionGranted) {
            window.addEventListener('devicemotion', handleMotion);
        }
        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [isEnabled, permissionGranted, handleMotion]);

    return {
        isEnabled,
        setIsEnabled,
        isSupported,
        permissionGranted,
        requestPermission
    };
};
