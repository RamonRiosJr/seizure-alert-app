import { renderHook, act } from '@testing-library/react';
import { useBLE } from '../useBLE';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn().mockReturnValue(true),
  },
}));

vi.mock('@capacitor-community/bluetooth-le', () => ({
  BleClient: {
    initialize: vi.fn(),
    requestDevice: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    startNotifications: vi.fn(),
  },
}));

describe('useBLE Auto-Reconnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should attempt reconnect if disconnected accidentally', async () => {
    // Setup Mock for Controlled Resolution
    let resolveConnect: (value?: unknown) => void = () => {};
    let captureDisconnectCallback = (_id: string) => {};

    (BleClient.connect as Mock).mockImplementation((_id, cb) => {
      captureDisconnectCallback = cb; // Capture the callback passed to connect
      return new Promise((resolve) => {
        resolveConnect = resolve;
      });
    });

    const { result } = renderHook(() => useBLE());

    // 1. Initial Connect
    const mockDevice = { deviceId: '123', name: 'TestHR' };

    // Start connect
    await act(async () => {
      await result.current.connect(mockDevice);
    });

    // Resolve the initial connection immediately
    await act(async () => {
      resolveConnect();
    });

    expect(result.current.connectedDevice).toEqual(mockDevice);

    // 2. Trigger "Accidental" Disconnect
    console.log('Simulating disconnect...');

    // We expect attemptReconnect to start. It will call BleClient.connect again.
    // That call will return a NEW promise that hangs until we resolve it.

    await act(async () => {
      captureDisconnectCallback('123'); // Fire onDisconnect
    });

    // 3. Verify Reconnect State (Pending)
    // attemptReconnect -> setIsReconnecting(true) -> await BleClient.connect (HUNG)
    expect(result.current.isReconnecting).toBe(true);
    expect(BleClient.connect).toHaveBeenCalledTimes(2);

    // 4. Resolve the Reconnect
    await act(async () => {
      resolveConnect(); // Resolve the pending reconnect call
    });

    // 5. Verify Connected State (Success)
    // attemptReconnect -> finishes -> setIsReconnecting(false)
    expect(result.current.isReconnecting).toBe(false);
    expect(result.current.connectedDevice).toEqual(mockDevice);
  });

  it('should NOT attempt reconnect if disconnected manually', async () => {
    // Setup Mock for Controlled Resolution
    let resolveConnect: (value?: unknown) => void = () => {};
    let captureDisconnectCallback = (id: string) => {};

    (BleClient.connect as Mock).mockImplementation((id, cb) => {
      captureDisconnectCallback = cb;
      return new Promise((resolve) => {
        resolveConnect = resolve;
      });
    });

    const { result } = renderHook(() => useBLE());
    const mockDevice = { deviceId: '123', name: 'TestHR' };

    // 1. Connect
    await act(async () => {
      await result.current.connect(mockDevice);
    });
    await act(async () => {
      resolveConnect();
    });

    // 2. Manual Disconnect
    await act(async () => {
      await result.current.disconnect();
    });

    // Simulate callback firing (which happens in real life after disconnect)
    await act(async () => {
      captureDisconnectCallback('123');
    });

    // 3. Verify NO Reconnect
    expect(result.current.isReconnecting).toBe(false);
    expect(BleClient.connect).toHaveBeenCalledTimes(1); // Only initial
  });
});
