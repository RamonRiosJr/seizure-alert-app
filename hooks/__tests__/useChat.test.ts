import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChat } from '../useChat';
import { useSettings } from '../../contexts/SettingsContext';

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          startChat: () => ({
            sendMessageStream: async () => ({
              stream: (async function* () {
                yield { text: () => 'Hello' };
                yield { text: () => ' from AI' };
              })(),
            }),
          }),
        };
      }
    },
  };
});

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useContextAwarePrompt
vi.mock('../useContextAwarePrompt', () => ({
  useContextAwarePrompt: () => ({
    getContextString: () => 'Mock Context',
  }),
}));

// Mock useSettings
vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
}));

describe('useChat', () => {
  const mockGeminiApiKey = 'test-api-key';

  beforeEach(() => {
    vi.clearAllMocks();
    (useSettings as any).mockReturnValue({
      geminiApiKey: mockGeminiApiKey,
    });
  });

  it('should load initial greeting if no history', () => {
    const { result } = renderHook(() => useChat('en'));
    expect(result.current.messages[0].text).toBe('chatInitialGreeting');
  });

  it('should use API key from useSettings', async () => {
    const { result } = renderHook(() => useChat('en'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBeNull();
    const modelMessages = result.current.messages.filter((m) => m.role === 'model');
    expect(modelMessages.some((m) => m.text.includes('Hello from AI'))).toBe(true);
  });

  it('should show error if API key is missing', async () => {
    (useSettings as any).mockReturnValue({
      geminiApiKey: '',
    });

    const { result } = renderHook(() => useChat('en'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBe('chatAPIKeyMissing');
  });
});
