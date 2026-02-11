import { renderHook } from '@testing-library/react';
import { useHeartMonitor } from '../useHeartMonitor';
import { useBLEContext } from '../../contexts/BLEContext';
import { useLocalStorage } from '../useLocalStorage';
import * as SettingsContext from '../../contexts/SettingsContext';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

// Mock Dependencies
vi.mock('../../contexts/BLEContext');
vi.mock('../useLocalStorage');
vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
  SettingsProvider: ({ children }: any) => children,
}));

describe('useHeartMonitor', () => {
  const mockTriggerAlert = vi.fn();

  // Default Mock State
  const mockBLEState = {
    heartRate: 80,
    connectedDevice: { deviceId: '123', name: 'Test Device' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useBLEContext as Mock).mockReturnValue(mockBLEState);
    (SettingsContext.useSettings as Mock).mockReturnValue({ lowPowerMode: false });
    (useLocalStorage as Mock).mockImplementation((key, initialValue) => {
      // Simple mock implementation of useLocalStorage
      if (key === 'hr_threshold') return [120, vi.fn()];
      if (key === 'workout_mode') return [false, vi.fn()];
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
      if (key === 'workout_mode') return [true, vi.fn()];
      if (key === 'hr_threshold') return [120, vi.fn()];
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
      if (key === 'hr_threshold') return [120, vi.fn()];
      return [initialValue, vi.fn()];
    });

    renderHook(() => useHeartMonitor(mockTriggerAlert));

    expect(mockTriggerAlert).not.toHaveBeenCalled();
  });
});
