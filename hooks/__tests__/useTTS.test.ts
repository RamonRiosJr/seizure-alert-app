import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTTS } from '../useTTS';

describe('useTTS', () => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockGetVoices = vi.fn(
    () =>
      [
        { lang: 'en-US', name: 'English Voice' },
        { lang: 'es-ES', name: 'Spanish Voice' },
      ] as SpeechSynthesisVoice[]
  );

  beforeEach(() => {
    // Mock window.speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: mockGetVoices,
        paused: false,
        resume: vi.fn(),
      },
      writable: true,
    });

    // Mock SpeechSynthesisUtterance as a class
    global.SpeechSynthesisUtterance = class {
      text: string;
      lang: string = '';
      voice: SpeechSynthesisVoice | null = null;
      onstart: ((event: any) => void) | null = null;
      onend: ((event: any) => void) | null = null;
      onerror: ((event: any) => void) | null = null;

      constructor(text: string) {
        this.text = text;
      }
    } as any;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should speak text in English', () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak('Hello', 'en');
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();

    // Check if the utterance was configured correctly
    const utteranceInstance = mockSpeak.mock.calls[0][0] as any;
    expect(utteranceInstance.text).toBe('Hello');
    expect(utteranceInstance.lang).toBe('en-US');
    expect(utteranceInstance.voice.name).toBe('English Voice');
  });

  it('should speak text in Spanish', () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak('Hola', 'es');
    });

    const utteranceInstance = mockSpeak.mock.calls[0][0] as any;
    expect(utteranceInstance.text).toBe('Hola');
    expect(utteranceInstance.lang).toBe('es-ES');
    expect(utteranceInstance.voice.name).toBe('Spanish Voice');
  });

  it('should update isSpeaking state', () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak('Test', 'en');
    });

    const utterance = mockSpeak.mock.calls[0][0] as any;

    // Simulate start
    act(() => {
      if (utterance.onstart) utterance.onstart(new Event('start'));
    });
    expect(result.current.isSpeaking).toBe(true);

    // Simulate end
    act(() => {
      if (utterance.onend) utterance.onend(new Event('end'));
    });
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should handle errors', () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak('Test', 'en');
    });

    const utterance = mockSpeak.mock.calls[0][0] as any;

    act(() => {
      if (utterance.onerror) utterance.onerror(new Event('error'));
    });

    expect(result.current.error).toBe('Native text-to-speech failed.');
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should set error if speechSynthesis is not available', () => {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined });

    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak('Test', 'en');
    });

    expect(result.current.error).toBe('Text-to-speech not supported in this browser.');
  });
});
