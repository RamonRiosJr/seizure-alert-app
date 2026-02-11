import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useBLE } from '../useBLE';
import { BleClient } from '@capacitor-community/bluetooth-le';

// Mock the Capacitor BLE Client
vi.mock('@capacitor-community/bluetooth-le', () => ({
  BleClient: {
    initialize: vi.fn(),
    requestDevice: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    startNotifications: vi.fn(),
  },
  numberToUUID: vi.fn((n) => n.toString()),
}));

// Mock Capacitor core to simulate native platform when needed
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => true), // Default to true to test native logic
  },
}));

describe('useBLE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize BLE on mount', async () => {
    renderHook(() => useBLE());
    expect(BleClient.initialize).toHaveBeenCalled();
  });

  it('should handle scanning success', async () => {
    const mockDevice = { deviceId: 'test-dev', name: 'Polar H10' };
    (BleClient.requestDevice as any).mockResolvedValue(mockDevice);

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      await result.current.scan();
    });

    expect(BleClient.requestDevice).toHaveBeenCalledWith({
      services: ['0000180d-0000-1000-8000-00805f9b34fb'],
      optionalServices: [],
    });
    expect(result.current.isScanning).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle scanning failure', async () => {
    (BleClient.requestDevice as any).mockRejectedValue(new Error('User cancelled'));

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      await result.current.scan();
    });

    expect(result.current.error).toBe('User cancelled');
    expect(result.current.isScanning).toBe(false);
  });

  it('should connect to a device', async () => {
    const mockDevice = { deviceId: 'test-dev', name: 'Polar H10' };
    (BleClient.connect as any).mockImplementation((_id: string, cb: (value: string) => void) =>
      cb('test-dev')
    ); // Mock disconnect callback registration
    (BleClient.startNotifications as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      await result.current.connect(mockDevice);
    });

    expect(BleClient.connect).toHaveBeenCalledWith('test-dev', expect.any(Function));
    expect(result.current.connectedDevice).toEqual(mockDevice);
    expect(BleClient.startNotifications).toHaveBeenCalled();
  });

  it('should disconnect from a device', async () => {
    const mockDevice = { deviceId: 'test-dev', name: 'Polar H10' };

    // Setup initial connected state
    const { result } = renderHook(() => useBLE());
    await act(async () => {
      // Manually set state via connect first to purely test disconnect flow?
      // Or we can just mock the hook logic. The hook doesn't expose setConnectedDevice.
      // So we must call connect first.
      (BleClient.connect as any).mockResolvedValue(undefined);
      (BleClient.startNotifications as any).mockResolvedValue(undefined);
      await result.current.connect(mockDevice);
    });

    await act(async () => {
      await result.current.disconnect();
    });

    expect(BleClient.disconnect).toHaveBeenCalledWith('test-dev');
    expect(result.current.connectedDevice).toBeNull();
    expect(result.current.heartRate).toBeNull();
  });

  it('should handle heart rate data notifications', async () => {
    const mockDevice = { deviceId: 'test-dev' };
    let notificationCallback: (value: DataView) => void = () => {};

    (BleClient.connect as any).mockResolvedValue(undefined);
    (BleClient.startNotifications as any).mockImplementation(
      (_id: string, _svc: string, _char: string, cb: (value: DataView) => void) => {
        notificationCallback = cb;
        return Promise.resolve();
      }
    );

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      await result.current.connect(mockDevice);
    });

    // Simulate HR Data (Flags: 0, HR: 75)
    // Format: [Flags, HR]
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint8(0, 0); // 8-bit format
    view.setUint8(1, 75); // 75 BPM

    act(() => {
      notificationCallback(view);
    });

    expect(result.current.heartRate).toBe(75);
  });

  it('should handle 16-bit heart rate data', async () => {
    const mockDevice = { deviceId: 'test-dev' };
    let notificationCallback: (value: DataView) => void = () => {};

    (BleClient.connect as any).mockResolvedValue(undefined);
    (BleClient.startNotifications as any).mockImplementation(
      (_id: string, _svc: string, _char: string, cb: (value: DataView) => void) => {
        notificationCallback = cb;
        return Promise.resolve();
      }
    );

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      await result.current.connect(mockDevice);
    });

    // Simulate HR Data (Flags: 1 (16-bit), HR: 120)
    const buffer = new ArrayBuffer(3);
    const view = new DataView(buffer);
    view.setUint8(0, 1); // 16-bit format flag
    view.setUint16(1, 120, true); // 120 BPM, little-endian

    act(() => {
      notificationCallback(view);
    });

    expect(result.current.heartRate).toBe(120);
  });
});
