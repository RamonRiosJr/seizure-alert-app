import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const useFallDetection = (onFallDetected: () => void) => {
    const [isEnabled] = useLocalStorage('fallDetectionEnabled', false);
    const [sensitivity] = useLocalStorage('fallSensitivity', 'medium');
    const [lastImpactTime, setLastImpactTime] = useState<number>(0);
    const [isMonitoringStillness, setIsMonitoringStillness] = useState(false);

    // Thresholds based on sensitivity
    const getThresholds = useCallback(() => {
        switch (sensitivity) {
            case 'high': return { impact: 15, stillness: 5000 }; // Lower G-force, 5s wait
            case 'low': return { impact: 25, stillness: 4000 }; // Higher G-force
            case 'medium':
            default: return { impact: 20, stillness: 5000 };
        }
    }, [sensitivity]);

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (!isEnabled) return;

        const { accelerationIncludingGravity } = event;
        if (!accelerationIncludingGravity) return;

        const { x, y, z } = accelerationIncludingGravity;
        if (x === null || y === null || z === null) return;

        // Calculate G-force vector length
        const gForce = Math.sqrt(x * x + y * y + z * z);
        const thresholds = getThresholds();

        if (isMonitoringStillness) {
            // If movement is detected during stillness phase, cancel alert
            // Normal gravity is ~9.8. Movement means significant deviation or rotation.
            // Simplified: if variance from 1G (9.8) is high, user is moving.
            if (Math.abs(gForce - 9.8) > 2) {
                // Movement detected, user is likely okay or picking up phone
                console.log('Movement detected after impact - cancelling fall alert');
                setIsMonitoringStillness(false);
                setLastImpactTime(0);
            }
        } else {
            // Detect Impact
            if (gForce > thresholds.impact) {
                console.log(`High Impact Detected: ${gForce.toFixed(2)}m/s²`);
                setLastImpactTime(Date.now());
                setIsMonitoringStillness(true);
            }
        }
    }, [isEnabled, isMonitoringStillness, getThresholds, sensitivity, lastImpactTime]); // Added dependencies

    // Check for stillness timeout
    useEffect(() => {
        if (!isMonitoringStillness || lastImpactTime === 0) return;

        const thresholds = getThresholds();
        const timeoutId = setTimeout(() => {
            // Verify state is still valid inside timeout
            // We need a ref or stable check if we want to be perfect, 
            // but here we rely on the component not unmounting or state changing rapidly.
            // Actually, we should check if we are *still* monitoring.
            // However, the effect will cleanup/re-run if dependencies change.
            console.log('Fall Confirmed: Impact + Stillness');
            onFallDetected();
            setIsMonitoringStillness(false);
            setLastImpactTime(0);
        }, thresholds.stillness);

        return () => clearTimeout(timeoutId);
    }, [isMonitoringStillness, lastImpactTime, onFallDetected, getThresholds]);

    // Main Motion Listener
    useEffect(() => {
        if (isEnabled) {
            window.addEventListener('devicemotion', handleMotion);
        }
        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [isEnabled, handleMotion]);
};
