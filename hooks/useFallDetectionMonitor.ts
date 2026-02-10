import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface FallDetectionMonitorData {
    currentGForce: number;
    isImpactDetected: boolean;
    isMonitoringStillness: boolean;
    history: number[];
    thresholds: {
        impact: number;
        stillness: number;
    };
}

/**
 * Hook for monitoring fall detection in real-time (for test mode)
 * Provides live G-force data, detection states, and history for visualization
 */
export const useFallDetectionMonitor = (): FallDetectionMonitorData => {
    const [sensitivity] = useLocalStorage('fallSensitivity', 'medium');
    const [currentGForce, setCurrentGForce] = useState(9.8); // Start at normal gravity
    const [isImpactDetected, setIsImpactDetected] = useState(false);
    const [isMonitoringStillness, setIsMonitoringStillness] = useState(false);
    const [history, setHistory] = useState<number[]>([]);

    // Get thresholds based on sensitivity
    const getThresholds = useCallback(() => {
        switch (sensitivity) {
            case 'high': return { impact: 15, stillness: 5000 };
            case 'low': return { impact: 25, stillness: 4000 };
            case 'medium':
            default: return { impact: 20, stillness: 5000 };
        }
    }, [sensitivity]);

    const thresholds = getThresholds();

    // Handle device motion events
    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        const { accelerationIncludingGravity } = event;
        if (!accelerationIncludingGravity) return;

        const { x, y, z } = accelerationIncludingGravity;
        if (x === null || y === null || z === null) return;

        // Calculate G-force magnitude
        const gForce = Math.sqrt(x * x + y * y + z * z);
        setCurrentGForce(gForce);

        // Update history (keep last 50 readings for graph)
        setHistory(prev => {
            const newHistory = [...prev, gForce];
            return newHistory.slice(-50); // Keep last 50 readings
        });

        // Detect impact
        if (gForce > thresholds.impact && !isImpactDetected) {
            setIsImpactDetected(true);
            setIsMonitoringStillness(true);

            // Haptic feedback on impact
            if ('vibrate' in navigator) {
                navigator.vibrate(200);
            }

            // Reset impact detection after stillness period
            setTimeout(() => {
                setIsImpactDetected(false);
            }, 1000);
        }

        // Check for movement during stillness monitoring
        if (isMonitoringStillness && Math.abs(gForce - 9.8) > 2) {
            // Movement detected, cancel stillness monitoring
            setIsMonitoringStillness(false);
        }
    }, [thresholds.impact, isImpactDetected, isMonitoringStillness]);

    // Set up motion listener
    useEffect(() => {
        window.addEventListener('devicemotion', handleMotion);
        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [handleMotion]);

    // Auto-reset stillness monitoring after threshold time
    useEffect(() => {
        if (!isMonitoringStillness) return;

        const timeoutId = setTimeout(() => {
            // Fall confirmed - trigger strong haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200, 100, 200]);
            }
            setIsMonitoringStillness(false);
        }, thresholds.stillness);

        return () => clearTimeout(timeoutId);
    }, [isMonitoringStillness, thresholds.stillness]);

    return {
        currentGForce,
        isImpactDetected,
        isMonitoringStillness,
        history,
        thresholds
    };
};
