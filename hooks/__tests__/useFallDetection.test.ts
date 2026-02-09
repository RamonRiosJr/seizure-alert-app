import { renderHook, act } from '@testing-library/react';
import { useFallDetection } from '../useFallDetection';
import { useLocalStorage } from '../useLocalStorage';
import { vi, describe, it, expect, beforeEach, Mock, afterEach } from 'vitest';

// Mock Dependencies
vi.mock('../useLocalStorage');

describe('useFallDetection', () => {
    const mockTriggerAlert = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (useLocalStorage as Mock).mockImplementation((key, initialValue) => {
            if (key === 'fall_detection_enabled') return [true, vi.fn()];
            if (key === 'fall_sensitivity') return ['medium', vi.fn()];
            return [initialValue, vi.fn()];
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should trigger alert after Impact (25g) + Stillness (5s)', () => {
        renderHook(() => useFallDetection(mockTriggerAlert));

        // Simulate Impact (25g)
        const impactEvent = new Event('devicemotion') as any;
        impactEvent.accelerationIncludingGravity = { x: 0, y: 0, z: 25 * 9.81 }; // ~25g

        act(() => {
            window.dispatchEvent(impactEvent);
        });

        // Verify monitoring started (console log would confirm, but we rely on alert trigger)

        // Simulate Stillness (1g) for 5 seconds
        // We need to advance time and fire events to prevent "timeout" cancellation if logic required it
        // But our hook uses a simple Timeout that gets cancelled if motion is detected.
        // If no motion events aka "High Motion" occur, the timeout completes.

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(mockTriggerAlert).toHaveBeenCalled();
    });

    it('should CANCEL alert if Motion occurs after Impact', () => {
        renderHook(() => useFallDetection(mockTriggerAlert));

        // Simulate Impact (25g)
        const impactEvent = new Event('devicemotion') as any;
        impactEvent.accelerationIncludingGravity = { x: 0, y: 0, z: 25 * 9.81 };

        act(() => {
            window.dispatchEvent(impactEvent);
        });

        // Simulate Motion (2g - user moves) at 2s
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        const motionEvent = new Event('devicemotion') as any;
        motionEvent.accelerationIncludingGravity = { x: 0, y: 0, z: 3 * 9.81 }; // 3g (Active movement)

        act(() => {
            window.dispatchEvent(motionEvent);
        });

        // Advance to end of original timeout
        act(() => {
            vi.advanceTimersByTime(3000); // 2s + 3s = 5s
        });

        expect(mockTriggerAlert).not.toHaveBeenCalled();
    });
});
