import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChat } from '../useChat';

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockImplementation(() => ({
        startChat: vi.fn().mockImplementation(() => ({
          sendMessageStream: vi.fn().mockImplementation(() => ({
            stream: (async function* () {
              yield { text: () => 'Hello' };
              yield { text: () => ' from AI' };
            })(),
          })),
        })),
      })),
    })),
  };
});

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('useChat', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should load initial greeting if no history', () => {
    const { result } = renderHook(() => useChat('en'));
    // Use non-null assertion for messages[0] as we expect it to be initialized
    expect(result.current.messages[0]!.text).toBe('chatInitialGreeting');
  });

  it('should use API key from sessionStorage', async () => {
    const apiKey = 'test-api-key';
    window.sessionStorage.setItem('gemini_api_key', JSON.stringify(apiKey));

    const { result } = renderHook(() => useChat('en'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBeNull();
    const modelMessages = result.current.messages.filter((m) => m.role === 'model');
    expect(modelMessages.some((m) => m.text.includes('Hello from AI'))).toBe(true);
  });

  it('should migrate API key from localStorage to sessionStorage', async () => {
    const apiKey = 'legacy-api-key';
    window.localStorage.setItem('gemini_api_key', JSON.stringify(apiKey));

    const { result } = renderHook(() => useChat('en'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(window.sessionStorage.getItem('gemini_api_key')).toBe(JSON.stringify(apiKey));
    expect(window.localStorage.getItem('gemini_api_key')).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should show error if API key is missing', async () => {
    const { result } = renderHook(() => useChat('en'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBe('chatAPIKeyMissing');
  });
});
