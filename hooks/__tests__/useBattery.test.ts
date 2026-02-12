import { renderHook, act, waitFor } from '@testing-library/react';
import { useBattery } from '../useBattery';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useBattery', () => {
  // Define local BatteryManager interface if missing
  interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions
    ) => void;
    removeEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions
    ) => void;
  }

  interface MockBatteryManager extends Omit<
    Partial<BatteryManager>,
    'addEventListener' | 'removeEventListener'
  > {
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  }
  let mockBattery: MockBatteryManager;

  beforeEach(() => {
    let batteryLevel = 0.5;
    mockBattery = {
      get level() {
        return batteryLevel;
      },
      set level(v: number) {
        batteryLevel = v;
      },
      charging: true,
      chargingTime: 120,
      dischargingTime: Infinity,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const getBatteryMock = vi.fn(() => Promise.resolve(mockBattery));

    Object.defineProperty(navigator, 'getBattery', {
      value: getBatteryMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    delete navigator.getBattery;
  });

  it('should return initial battery state and support status', async () => {
    const { result } = renderHook(() => useBattery());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
      expect(result.current.level).toBe(0.5);
      expect(result.current.charging).toBe(true);
    });
  });

  it('should handles unsupported browser', async () => {
    // @ts-ignore
    delete navigator.getBattery;

    const { result } = renderHook(() => useBattery());

    expect(result.current.isSupported).toBe(false);
  });

  it.skip('should update state on battery events', async () => {
    const { result } = renderHook(() => useBattery());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    // Simulate event
    // We access the mock attached to the *specific* mockBattery instance in this test run
    const calls = mockBattery.addEventListener.mock.calls;
    const levelChangeCall = calls.find((call: unknown[]) => call[0] === 'levelchange');
    expect(levelChangeCall).toBeDefined();
    const levelChangeHandler = levelChangeCall![1];

    act(() => {
      mockBattery.level = 0.8;
      levelChangeHandler();
    });

    await waitFor(() => {
      expect(result.current.level).toBe(0.8);
    });
  });
});
