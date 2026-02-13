import { useState, useCallback, useEffect } from 'react';

export const useWakeLock = () => {
    const [isLocked, setIsLocked] = useState(false);
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
    const [error, setError] = useState<string | null>(null);

    const requestLock = useCallback(async () => {
        if ('wakeLock' in navigator) {
            try {
                const lock = await navigator.wakeLock.request('screen');
                setWakeLock(lock);
                setIsLocked(true);
                setError(null);

                lock.addEventListener('release', () => {
                    setIsLocked(false);
                    setWakeLock(null);
                });
            } catch (err: unknown) {
                console.error('[useWakeLock] Failed to request wake lock:', err);
                const errorMessage = err instanceof Error ? err.name : 'Unknown Error';
                setError(errorMessage === 'NotAllowedError' ? 'Wake Lock permission denied' : 'Wake Lock failed');
                setIsLocked(false);
            }
        } else {
            setError('Wake Lock API not supported');
        }
    }, []);

    const releaseLock = useCallback(async () => {
        if (wakeLock) {
            try {
                await wakeLock.release();
                setWakeLock(null);
                setIsLocked(false);
            } catch (err: unknown) {
                console.error('[useWakeLock] Failed to release lock:', err);
            }
        }
    }, [wakeLock]);

    // Re-acquire lock when visibility changes (e.g. tab switch)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !isLocked && wakeLock === null) {
                // Ideally we only re-request if we INTENDED to be locked. 
                // For now, this hook is manual. The consumer (App.tsx) should handle re-requesting if needed.
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Clean up lock on unmount
            if (wakeLock) wakeLock.release().catch(() => console.error('WakeLock release failed'));
        };
    }, [wakeLock, isLocked]);

    return { isLocked, requestLock, releaseLock, error };
};
