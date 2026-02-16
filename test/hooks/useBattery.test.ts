import { renderHook, act } from '@testing-library/react';
import { useBattery } from '@/hooks/useBattery';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useBattery', () => {
  let getBatteryMock: ReturnType<typeof vi.fn>;
  let batteryMock: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    [key: string]: unknown;
  };

  beforeEach(() => {
    batteryMock = {
      level: 1,
      charging: false,
      chargingTime: 0,
      dischargingTime: Infinity,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    getBatteryMock = vi.fn().mockResolvedValue(batteryMock);

    Object.defineProperty(navigator, 'getBattery', {
      value: getBatteryMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should return initial state', async () => {
    const { result } = renderHook(() => useBattery());

    // Wait for promise to resolve
    await act(async () => {});

    expect(result.current.isSupported).toBe(true);
    expect(result.current.level).toBe(1);
  });

  it('should calculate discharge rate over time', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBattery());

    await act(async () => {});

    // Simulate 50% drop over 1 hour
    // Initial: 1.0 at T=0

    // Advance 30 mins, drop to 0.75
    vi.advanceTimersByTime(30 * 60 * 1000);
    batteryMock.level = 0.75;
    // Trigger event
    const levelChangeHandler = batteryMock.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'levelchange'
    )?.[1];

    await act(async () => {
      levelChangeHandler();
    });

    // Current rate calculation requires at least 2 points
    // It should calculate: (0.75 - 1.0) / 0.5 hours = -0.5 (50% per hour)
    // Wait, logic says min 2 points.

    // Advance another 30 mins, drop to 0.50
    vi.advanceTimersByTime(30 * 60 * 1000);
    batteryMock.level = 0.5;

    await act(async () => {
      levelChangeHandler();
    });

    // Total time: 1 hour. Total drop: 0.5. Rate: -0.5
    // Logic: (0.50 - 1.0) / 1.0 = -0.5

    // We need to inspect internal state or return value.
    // The hook returns `dischargeRate`

    expect(result.current.dischargeRate).toBeCloseTo(-0.5, 2);
  });
});
