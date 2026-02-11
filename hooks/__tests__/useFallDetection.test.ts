import { renderHook, act } from '@testing-library/react';
import { useFallDetection } from '../useFallDetection';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import * as SettingsContext from '../../contexts/SettingsContext';

// Mock useSettings
vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
  SettingsProvider: ({ children }: any) => children,
}));

describe('useFallDetection', () => {
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;
  let mockOnFallDetected: any;

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnFallDetected = vi.fn();
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    localStorage.clear();

    // Default mock implementation
    (SettingsContext.useSettings as Mock).mockReturnValue({
      lowPowerMode: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should NOT listen to devicemotion by default (disabled)', () => {
    renderHook(() => useFallDetection(mockOnFallDetected));
    expect(addEventListenerSpy).not.toHaveBeenCalledWith('devicemotion', expect.any(Function));
  });

  it('should listen to devicemotion when enabled', () => {
    localStorage.setItem('fallDetectionEnabled', 'true');
    const { unmount } = renderHook(() => useFallDetection(mockOnFallDetected));

    expect(addEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function));
  });

  it('should trigger alert after High G-Force then Stillness', () => {
    localStorage.setItem('fallDetectionEnabled', 'true');
    renderHook(() => useFallDetection(mockOnFallDetected));

    const handleMotion = addEventListenerSpy.mock.calls.find(
      (call: any) => call[0] === 'devicemotion'
    )[1];

    // 1. Simulate High G-Force (Impact)
    // Euclidean distance of (0, 0, 25) is 25, which > 20 (medium threshold)
    act(() => {
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 0, z: 25 },
      } as DeviceMotionEvent);
    });

    // 2. Advance time 5 seconds (Stillness period)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockOnFallDetected).toHaveBeenCalled();
  });

  it('should CANCEL alert if Motion occurs after Impact', () => {
    localStorage.setItem('fallDetectionEnabled', 'true');
    renderHook(() => useFallDetection(mockOnFallDetected));

    const handleMotion = addEventListenerSpy.mock.calls.find(
      (call: any) => call[0] === 'devicemotion'
    )[1];

    // 1. Impact
    act(() => {
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 0, z: 25 },
      } as DeviceMotionEvent);
    });

    // 2. Motion (Walking/Moving)
    // 15 G is significantly different from 9.8 (Stillness)
    act(() => {
      handleMotion({
        accelerationIncludingGravity: { x: 15, y: 0, z: 0 },
      } as DeviceMotionEvent);
    });

    // 3. Wait for timeout
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockOnFallDetected).not.toHaveBeenCalled();
  });
});
