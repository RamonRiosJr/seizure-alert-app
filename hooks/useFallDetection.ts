import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface FallDetectionOptions {
    impactThreshold?: number; // G-force threshold (e.g., 20g)
    stillnessThreshold?: number; // Movement threshold during check (e.g., 1g)
    stillnessDuration?: number; // Duration to wait for stillness (ms)
}

export const useFallDetection = (onFallDetected: () => void, options: FallDetectionOptions = {}) => {
    const {
        impactThreshold = 20, // High impact
        stillnessThreshold = 2, // Relative stillness (allowing for some jitter)
        stillnessDuration = 5000 // 5 seconds of stillness
    } = options;

    const [isEnabled, setIsEnabled] = useLocalStorage<boolean>('fall_detection_enabled', false);
    const [sensitivity, setSensitivity] = useLocalStorage<string>('fall_sensitivity', 'medium'); // low, medium, high

    // Adjust threshold based on sensitivity
    const getEffectiveThreshold = () => {
        switch (sensitivity) {
            case 'high': return 15;
            case 'low': return 30;
            case 'medium': default: return 20;
        }
    };

    const currentImpactThreshold = getEffectiveThreshold();

    // State for the detection state machine
    const [isMonitoringStillness, setIsMonitoringStillness] = useState(false);

    // Refs for processing
    const lastTimeRef = useRef<number>(0);
    const stillnessStartTimeRef = useRef<number | null>(null);
    const stillnessTimerRef = useRef<number | null>(null);

    // cleanup
    const stopMonitoring = useCallback(() => {
        setIsMonitoringStillness(false);
        stillnessStartTimeRef.current = null;
        if (stillnessTimerRef.current) {
            clearTimeout(stillnessTimerRef.current);
            stillnessTimerRef.current = null;
        }
    }, []);

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (!isEnabled) return;

        const current = event.accelerationIncludingGravity;
        if (!current || current.x === null || current.y === null || current.z === null) return;

        const currentTime = Date.now();
        // Rate limit processing to ~10hz to save battery
        if ((currentTime - lastTimeRef.current) < 100) return;
        lastTimeRef.current = currentTime;

        // Calculate total acceleration vector (G-force approx, assuming 1g = 9.8m/s^2 usually, but browser APIs vary)
        // Typically: Math.sqrt(x*x + y*y + z*z) / 9.8 to get Gs. 
        // Let's assume raw values are m/s^2. 1g ~= 9.8. 
        // 20g ~= 196 m/s^2.

        const totalAccel = Math.sqrt(current.x ** 2 + current.y ** 2 + current.z ** 2);
        const gForce = totalAccel / 9.81;

        if (isMonitoringStillness) {
            // PHASE 2: Check for stillness
            // If movement exceeds threshold, user is moving -> Cancel Alarm
            // Note: We need to check delta or absolute variance, but raw magnitude hovering around 1g (9.8) is normal.
            // If phone is still, totalAccel should be ~9.8 (1g).
            // If user is walking/moving, it fluctuates.

            // Simple approach: If G-force spikes again or varies wildly, cancel.
            // Actually, we want to know if they are *moving*. 
            // Better: If they pick up the phone, G-force changes orientation or spikes.

            const deviation = Math.abs(gForce - 1); // Deviation from 1g static

            // If deviation > 0.5g (moving significantly), cancel
            if (deviation > 1.0) { // Tolerant threshold for "moving around"
                console.log(`[FallDetection] Movement detected (${gForce.toFixed(2)}g). Cancelled.`);
                stopMonitoring();
            }
        } else {
            // PHASE 1: Detect Impact
            if (gForce > currentImpactThreshold) {
                console.log(`[FallDetection] Impact detected: ${gForce.toFixed(2)}g. Waiting for stillness...`);
                setIsMonitoringStillness(true);
                stillnessStartTimeRef.current = currentTime;

                // Start timer
                stillnessTimerRef.current = window.setTimeout(() => {
                    console.log("[FallDetection] Stillness confirmed. TRIGGERING ALERT.");
                    onFallDetected();
                    stopMonitoring();
                }, stillnessDuration);
            }
        }

    }, [isEnabled, currentImpactThreshold, isMonitoringStillness, onFallDetected, stillnessDuration, stopMonitoring]);

    // Effect 1: Manage Event Listener
    useEffect(() => {
        if (isEnabled) {
            window.addEventListener('devicemotion', handleMotion);
        }
        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [isEnabled, handleMotion]);

    // Effect 2: Cleanup on unmount
    useEffect(() => {
        return () => {
            stopMonitoring();
        };
    }, [stopMonitoring]);

    // Effect 3: Stop monitoring if disabled
    useEffect(() => {
        if (!isEnabled) {
            stopMonitoring();
        }
    }, [isEnabled, stopMonitoring]);

    return {
        isEnabled,
        setIsEnabled,
        sensitivity,
        setSensitivity,
        isMonitoringStillness
    };
};
