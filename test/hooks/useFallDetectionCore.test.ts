import { renderHook, act } from '@testing-library/react';
import { useFallDetectionCore } from '@/useFallDetectionCore';
import { vi, describe, it, expect, beforeEach, afterEach, MockInstance } from 'vitest';

describe('useFallDetectionCore Performance', () => {
  let addEventListenerSpy: MockInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should throttle sensor updates to ~10Hz', () => {
    const onSensorReading = vi.fn();

    renderHook(() =>
      useFallDetectionCore({
        isEnabled: true,
        onSensorReading,
      })
    );

    const handleMotion = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => Array.isArray(call) && call[0] === 'devicemotion'
    )![1] as (event: unknown) => void;

    // Simulate 60 events in 1 second (16.6ms intervals)
    for (let i = 0; i < 60; i++) {
      act(() => {
        vi.advanceTimersByTime(16);
        handleMotion({
          accelerationIncludingGravity: { x: 0, y: 9.8 + (i % 2) * 0.1, z: 0 },
        } as unknown as DeviceMotionEvent);
      });
    }

    expect(onSensorReading.mock.calls.length).toBeGreaterThanOrEqual(9);
    expect(onSensorReading.mock.calls.length).toBeLessThanOrEqual(12);
  });

  it('should FORCE update on impact even if throttled', () => {
    const onSensorReading = vi.fn();

    renderHook(() =>
      useFallDetectionCore({
        isEnabled: true,
        onSensorReading,
      })
    );

    const handleMotion = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => Array.isArray(call) && call[0] === 'devicemotion'
    )![1] as (event: unknown) => void;

    // 1. Initial event (Updates)
    act(() => {
      vi.advanceTimersByTime(16);
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 9.8, z: 0 },
      } as unknown as DeviceMotionEvent);
    });
    expect(onSensorReading).toHaveBeenCalledTimes(1);

    // 2. Second event (Throttled)
    act(() => {
      vi.advanceTimersByTime(16);
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 9.8, z: 0 },
      } as unknown as DeviceMotionEvent);
    });
    expect(onSensorReading).toHaveBeenCalledTimes(1); // Still 1

    // 3. IMPACT event (Should FORCE Update)
    act(() => {
      vi.advanceTimersByTime(16);
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 30, z: 0 },
      } as unknown as DeviceMotionEvent);
    });
    expect(onSensorReading).toHaveBeenCalledTimes(2); // Should be 2 now
    expect(onSensorReading).toHaveBeenLastCalledWith(30);
  });
});
