import { renderHook, act } from '@testing-library/react';
import { useHeartMonitor } from '@/useHeartMonitor';
import { useBLEContext } from '@/../contexts/BLEContext';
import { useLocalStorage } from '@/useLocalStorage';
import * as SettingsContext from '@/../contexts/SettingsContext';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

// Mock Dependencies
vi.mock('@/../contexts/BLEContext');
vi.mock('@/useLocalStorage');
vi.mock('@/../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
  SettingsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('useHeartMonitor', () => {
  const mockTriggerAlert = vi.fn();

  // Default Mock State
  const mockBLEState = {
    heartRate: 80,
    connectedDevice: { deviceId: '123', name: 'Test Device' },
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z')); // Ensure Date.now() is not 0
    vi.clearAllMocks();
    (useBLEContext as Mock).mockReturnValue(mockBLEState);
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
    (useLocalStorage as Mock).mockImplementation((key, initialValue) => {
      // Simple mock implementation of useLocalStorage
      if (key === 'hrThreshold') return [120, vi.fn()];
      if (key === 'workoutMode') return [false, vi.fn()];
      // if (key === 'app_settings') return [{}, vi.fn()];
      return [initialValue, vi.fn()];
    });
  });

  it('should not trigger alert when HR is below threshold', () => {
    (useBLEContext as Mock).mockReturnValue({ ...mockBLEState, heartRate: 100 });

    renderHook(() => useHeartMonitor(mockTriggerAlert));

    expect(mockTriggerAlert).not.toHaveBeenCalled();
  });

  it('should trigger alert when HR is above threshold (120)', () => {
    (useBLEContext as Mock).mockReturnValue({ ...mockBLEState, heartRate: 130 });

    renderHook(() => useHeartMonitor(mockTriggerAlert));

    expect(mockTriggerAlert).toHaveBeenCalled();
  });

  it('should NOT trigger alert if Workout Mode is active', () => {
    (useBLEContext as Mock).mockReturnValue({ ...mockBLEState, heartRate: 150 });
    // Mock Workout Mode = true
    (useLocalStorage as Mock).mockImplementation((key, initialValue) => {
      if (key === 'workoutMode') return [true, vi.fn()];
      if (key === 'hrThreshold') return [120, vi.fn()];
      return [initialValue, vi.fn()];
    });

    renderHook(() => useHeartMonitor(mockTriggerAlert));

    expect(mockTriggerAlert).not.toHaveBeenCalled();
  });
  it('should NOT trigger alert if Snooze is active', () => {
    (useBLEContext as Mock).mockReturnValue({ ...mockBLEState, heartRate: 150 });

    // Mock Snooze until future
    const futureTime = Date.now() + 10000;
    (useLocalStorage as Mock).mockImplementation((key, initialValue) => {
      if (key === 'hr_snooze_until') return [futureTime, vi.fn()];
      if (key === 'hrThreshold') return [120, vi.fn()];
      return [initialValue, vi.fn()];
    });

    renderHook(() => useHeartMonitor(mockTriggerAlert));

    expect(mockTriggerAlert).not.toHaveBeenCalled();
  });

  it('should throttle HR checks when Low Power Mode is enabled', () => {
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

    // 1. Initial HR below threshold (Processed, No Alert)
    (useBLEContext as Mock).mockReturnValue({ ...mockBLEState, heartRate: 100 });
    const { rerender } = renderHook(() => useHeartMonitor(mockTriggerAlert));
    expect(mockTriggerAlert).not.toHaveBeenCalled();

    // 2. Advance time 1s (T=1000) - Update HR to ABOVE threshold
    // Should be THROTTLED, so NO Alert despite high HR
    (useBLEContext as Mock).mockReturnValue({ ...mockBLEState, heartRate: 140 });
    vi.advanceTimersByTime(1000);
    rerender();
    // Note: In real hook, it reacts to BLEContext updates. Rerender simulates this.
    expect(mockTriggerAlert).not.toHaveBeenCalled();

    // 3. Advance time to 60s+ (T=60001) - Update HR to 141 (New value to trigger effect)
    // Should be Processed -> Alert!
    (useBLEContext as Mock).mockReturnValue({ ...mockBLEState, heartRate: 141 });
    // Note: We need to wait > 60s to pass the debounce check (now - lastTriggerTime > 60000)
    vi.advanceTimersByTime(60001);
    rerender();
    expect(mockTriggerAlert).toHaveBeenCalled();
  });

  it('should execute snooze function', () => {
    const { result } = renderHook(() => useHeartMonitor(mockTriggerAlert));

    const consoleSpy = vi.spyOn(console, 'log');

    act(() => {
      result.current.snooze(10000); // 10 seconds
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Snoozed alerts'));
  });
});
