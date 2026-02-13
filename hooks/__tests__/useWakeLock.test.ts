import { renderHook, act } from '@testing-library/react';
import { useWakeLock } from '../useWakeLock';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useWakeLock', () => {
    let wakeLockMock: { release: ReturnType<typeof vi.fn>; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> };
    let requestMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        wakeLockMock = {
            release: vi.fn().mockResolvedValue(undefined),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        requestMock = vi.fn().mockResolvedValue(wakeLockMock);

        // Robust mocking for JSDOM
        Object.defineProperty(navigator, 'wakeLock', {
            value: {
                request: requestMock,
            },
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize as unlocked', () => {
        const { result } = renderHook(() => useWakeLock());
        expect(result.current.isLocked).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should request lock successfully', async () => {
        const { result } = renderHook(() => useWakeLock());

        await act(async () => {
            await result.current.requestLock();
        });

        expect(requestMock).toHaveBeenCalledWith('screen');
        expect(result.current.isLocked).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('should handle request failure', async () => {
        requestMock.mockRejectedValue(new Error('Failed'));
        const { result } = renderHook(() => useWakeLock());

        await act(async () => {
            await result.current.requestLock();
        });

        expect(result.current.isLocked).toBe(false);
        expect(result.current.error).toBe('Wake Lock failed');
    });

    it('should handle NotAllowedError specifically', async () => {
        const error = new Error('Permission denied');
        error.name = 'NotAllowedError';
        requestMock.mockRejectedValue(error);
        const { result } = renderHook(() => useWakeLock());

        await act(async () => {
            await result.current.requestLock();
        });

        expect(result.current.error).toBe('Wake Lock permission denied');
    });

    it('should release lock successfully', async () => {
        const { result } = renderHook(() => useWakeLock());

        // Lock first
        await act(async () => {
            await result.current.requestLock();
        });

        // Then release
        await act(async () => {
            await result.current.releaseLock();
        });

        expect(wakeLockMock.release).toHaveBeenCalled();
        expect(result.current.isLocked).toBe(false);
    });
});
