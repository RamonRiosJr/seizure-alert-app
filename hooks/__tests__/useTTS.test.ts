
import { renderHook, act } from '@testing-library/react';
import { useTTS } from '../useTTS';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useTTS', () => {
    let originalSpeechSynthesis: any;
    let mockResume: any;

    beforeEach(() => {
        originalSpeechSynthesis = window.speechSynthesis;
        mockResume = vi.fn();

        Object.defineProperty(window, 'speechSynthesis', {
            value: {
                speak: vi.fn(),
                cancel: vi.fn(),
                getVoices: vi.fn().mockReturnValue([]),
                paused: false,
                resume: mockResume,
            },
            writable: true
        });

        // Mock AudioContext
        Object.defineProperty(window, 'AudioContext', {
            value: vi.fn().mockImplementation(() => ({
                resume: vi.fn().mockResolvedValue(undefined),
                close: vi.fn().mockResolvedValue(undefined),
            })),
            writable: true
        });

        // Mock visibilityState
        Object.defineProperty(document, 'visibilityState', {
            value: 'visible',
            writable: true
        });
    });

    afterEach(() => {
        window.speechSynthesis = originalSpeechSynthesis;
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useTTS());
        expect(result.current.isSpeaking).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should attempt to resume audio context on visibility change to visible', () => {
        // Setup initial state
        Object.defineProperty(window.speechSynthesis, 'paused', { value: true });

        renderHook(() => useTTS());

        // Simulate visibility change
        act(() => {
            Object.defineProperty(document, 'visibilityState', { value: 'visible' });
            document.dispatchEvent(new Event('visibilitychange'));
        });

        expect(mockResume).toHaveBeenCalled();
    });

    it('should NOT attempt to resume if visibility changes to hidden', () => {
        Object.defineProperty(window.speechSynthesis, 'paused', { value: true });

        renderHook(() => useTTS());

        act(() => {
            Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
            document.dispatchEvent(new Event('visibilitychange'));
        });

        expect(mockResume).not.toHaveBeenCalled();
    });
});
