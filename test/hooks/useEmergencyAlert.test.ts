import { renderHook, act } from '@testing-library/react';
import { useEmergencyAlert } from '@/useEmergencyAlert';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock AudioContext and related nodes
class MockAudioNode {
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockOscillator extends MockAudioNode {
  start = vi.fn();
  stop = vi.fn();
  frequency = { value: 0 };
  type = 'sine';
}

class MockGain extends MockAudioNode {
  gain = {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
  };
}

class MockAudioContext {
  state = 'suspended';
  currentTime = 0;
  resume = vi.fn().mockResolvedValue(undefined);
  suspend = vi.fn().mockResolvedValue(undefined);
  createOscillator = vi.fn(() => new MockOscillator());
  createGain = vi.fn(() => new MockGain());
  destination = {};
}

describe('useEmergencyAlert', () => {
  // Setup global mocks
  beforeEach(() => {
    vi.stubGlobal('AudioContext', MockAudioContext);
    vi.stubGlobal('navigator', {
      vibrate: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('initializes and manages state correctly', () => {
    const { result } = renderHook(() => useEmergencyAlert());

    expect(result.current.hasAudioPermission).toBe(true);
    // Should NOT automatically start vibration/sound if autoStart is false (default)
    expect(navigator.vibrate).not.toHaveBeenCalled();
  });

  it('automatically starts when requested', () => {
    renderHook(() => useEmergencyAlert({ autoStart: true }));
    expect(navigator.vibrate).toHaveBeenCalled();
  });

  it('toggles sound (mute/unmute)', () => {
    const { result } = renderHook(() => useEmergencyAlert());

    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.isMuted).toBe(true);
  });

  it('starts and stops alert sequences', () => {
    const { result } = renderHook(() => useEmergencyAlert());

    act(() => {
      result.current.startAlert();
    });

    // Check vibration side effect
    expect(navigator.vibrate).toHaveBeenCalled();

    act(() => {
      result.current.stopAlert();
    });
  });

  it('resumes audio context manually', async () => {
    const { result } = renderHook(() => useEmergencyAlert());

    await act(async () => {
      await result.current.attemptResume();
    });

    expect(result.current.hasAudioPermission).toBe(true);
  });
});
