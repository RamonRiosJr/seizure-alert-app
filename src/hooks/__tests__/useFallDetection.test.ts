import { renderHook, act } from '@testing-library/react';
import { useFallDetection } from '../useFallDetection';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import * as SettingsContext from '../../contexts/SettingsContext';

// Mock useSettings
vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
  SettingsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('useFallDetection', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let mockOnFallDetected: Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnFallDetected = vi.fn();
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    localStorage.clear();

    // Default mock implementation
    const mockSettings: SettingsContext.SettingsContextType = {
      lowPowerMode: false,
      setLowPowerMode: vi.fn(),
      preventSleep: false,
      setPreventSleep: vi.fn(),
      activeTab: 'care',
      setActiveTab: vi.fn(),
      voiceActivationEnabled: false,
      setVoiceActivationEnabled: vi.fn(),
      picovoiceAccessKey: '',
      setPicovoiceAccessKey: vi.fn(),
      geminiApiKey: '',
      setGeminiApiKey: vi.fn(),
    };
    (SettingsContext.useSettings as Mock).mockReturnValue(mockSettings);
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
      (call: unknown[]) => call[0] === 'devicemotion'
    )![1];

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
      (call: unknown[]) => call[0] === 'devicemotion'
    )![1];

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

  it('should throttle motion events when Low Power Mode is enabled', () => {
    // Enable Low Power Mode
    const mockLowPowerSettings: SettingsContext.SettingsContextType = {
      lowPowerMode: true,
      setLowPowerMode: vi.fn(),
      preventSleep: false,
      setPreventSleep: vi.fn(),
      activeTab: 'care',
      setActiveTab: vi.fn(),
      voiceActivationEnabled: false,
      setVoiceActivationEnabled: vi.fn(),
      picovoiceAccessKey: '',
      setPicovoiceAccessKey: vi.fn(),
      geminiApiKey: '',
      setGeminiApiKey: vi.fn(),
    };
    (SettingsContext.useSettings as Mock).mockReturnValue(mockLowPowerSettings);
    localStorage.setItem('fallDetectionEnabled', 'true');
    renderHook(() => useFallDetection(mockOnFallDetected));

    const handleMotion = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => call[0] === 'devicemotion'
    )![1];

    const consoleSpy = vi.spyOn(console, 'log');

    // 1. First event (T=0) - Processed
    act(() => {
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 0, z: 25 },
      } as DeviceMotionEvent);
    });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('High Impact Detected'));
    consoleSpy.mockClear();

    // 2. Second event (T=100) - Should be THROTTLED (Ignored)
    act(() => {
      vi.advanceTimersByTime(100);
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 0, z: 25 },
      } as DeviceMotionEvent);
    });
    expect(consoleSpy).not.toHaveBeenCalled(); // Should NOT log "High Impact Detected" again

    // 3. Third event (T=210) - Should be Processed
    act(() => {
      vi.advanceTimersByTime(110); // Total 210ms
      handleMotion({
        accelerationIncludingGravity: { x: 0, y: 0, z: 25 },
      } as DeviceMotionEvent);
    });
    // The previous impact (T=0) put us in "Monitoring Stillness" mode.
    // This new motion (T=210) is detected as movement, cancelling the fall alert.
    // This confirms the event was processed and NOT throttled.
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Movement detected'));
  });
});
