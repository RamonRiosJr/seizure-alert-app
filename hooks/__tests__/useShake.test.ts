import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useShake } from '../useShake';

describe('useShake', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;

  // Helper to simulate motion event
  const triggerMotion = (
    handler: (event: Partial<DeviceMotionEvent>) => void,
    x: number,
    y: number,
    z: number
  ) => {
    handler({
      accelerationIncludingGravity: { x, y, z },
      acceleration: { x: 0, y: 0, z: 0 },
      rotationRate: { alpha: 0, beta: 0, gamma: 0 },
      interval: 16,
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    // Mock DeviceMotionEvent presence
    Object.defineProperty(window, 'DeviceMotionEvent', {
      value: class {
        static requestPermission() {
          return Promise.resolve('granted');
        }
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useShake(() => {}));
    expect(result.current.isEnabled).toBe(false);
    // We mocked DeviceMotionEvent, so it should be supported
    expect(result.current.isSupported).toBe(true);
  });

  it('should detect shakes and trigger callback', () => {
    const onShake = vi.fn();
    // Simulate Android (no requestPermission needed)
    // @ts-ignore
    window.DeviceMotionEvent.requestPermission = undefined;

    // Sensitivity 10, 2 shakes required, 1000ms timeout
    const { result } = renderHook(() =>
      useShake(onShake, { threshold: 10, requiredShakes: 2, timeout: 1000 })
    );

    // Enable
    act(() => {
      result.current.setIsEnabled(true);
    });

    // Get the event listener
    expect(addEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function));
    const handler = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => call[0] === 'devicemotion'
    )![1] as (event: Partial<DeviceMotionEvent>) => void;

    // 1. Initial State (Rest)
    act(() => {
      triggerMotion(handler, 0, 0, 9.8); // Gravity only
    });

    // Advance time > 100ms (hook debounce)
    vi.advanceTimersByTime(110);

    // 2. First Shake (Heavy motion)
    act(() => {
      // Change > threshold (10).
      // Previous sum = 9.8
      // New sum must be significantly different.
      // Speed calculation: abs(diff) / diffTime * 10000
      // Let's create a massive spike
      triggerMotion(handler, 20, 20, 20);
    });

    // Should count as 1 shake, but not trigger yet (need 2)
    expect(onShake).not.toHaveBeenCalled();

    // Advance time < timeout (e.g. 500ms) but > debounce (100ms)
    vi.advanceTimersByTime(200);

    // 3. Second Shake
    act(() => {
      // Another massive spike
      triggerMotion(handler, -20, -20, -20);
    });

    // Should trigger now
    expect(onShake).toHaveBeenCalledTimes(1);
  });

  it('should reset count if timeout expires', () => {
    const onShake = vi.fn();
    // @ts-ignore
    window.DeviceMotionEvent.requestPermission = undefined;

    const { result } = renderHook(() =>
      useShake(onShake, { threshold: 10, requiredShakes: 2, timeout: 500 })
    );

    act(() => {
      result.current.setIsEnabled(true);
    });
    const handler = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => call[0] === 'devicemotion'
    )![1] as (event: Partial<DeviceMotionEvent>) => void;

    // First Shake
    act(() => {
      triggerMotion(handler, 0, 0, 9.8);
    });
    vi.advanceTimersByTime(110);
    act(() => {
      triggerMotion(handler, 20, 20, 20);
    });
    expect(onShake).not.toHaveBeenCalled();

    // Wait TOO LONG (timeout is 500ms)
    vi.advanceTimersByTime(600);

    // Second Shake (Should count as #1 now, not #2)
    act(() => {
      triggerMotion(handler, -20, -20, -20);
    });

    expect(onShake).not.toHaveBeenCalled();
  });
});
