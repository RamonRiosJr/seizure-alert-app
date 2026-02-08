
import { useState, useCallback, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTranslation } from 'react-i18next';
import type { ChatMessage, Language } from '../types';
import { getSystemPrompt } from '../constants';

export const useChat = (language: Language) => {
  const { t } = useTranslation();
  // Load initial state from localStorage or default to empty
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load chat history", e);
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize greeting ONLY if history is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: t('chatInitialGreeting') }]);
    }
  }, [t]); // Removed 'messages.length' from dependency to avoid loop, and removed 'language' to prevent auto-wipe

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const clearChat = useCallback(() => {
    const initialMsg: ChatMessage = { role: 'model', text: t('chatInitialGreeting') };
    setMessages([initialMsg]);
    localStorage.removeItem('chat_history');
    localStorage.setItem('chat_history', JSON.stringify([initialMsg]));
  }, [t]);

  const sendMessage = useCallback(async (userMessage: string, priority?: 'high' | 'medium' | 'low') => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setInput('');
    setError(null);

    setMessages(prev => [...prev, { role: 'user', text: userMessage, priority }]);

    let apiKey: string | null = null;
    try {
      const keyItem = localStorage.getItem('gemini_api_key');
      if (keyItem) {
        apiKey = JSON.parse(keyItem);
      }
    } catch (e) {
      console.error("Could not parse API Key from localStorage", e);
    }

    if (!apiKey) {
      const errorMsg = t('chatAPIKeyMissing') || "API Key not found. Please set it in the settings.";
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
      setIsLoading(false);
      return;
    }

    try {
      // Use the Browser-compatible SDK pattern
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: getSystemPrompt(language),
      });

      // Construct history for the API from previous messages
      // Filter out error messages or system greetings if needed, currently passing valid chat history
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'model') // Simple filter
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessageStream(userMessage);

      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === 'model') {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, text: lastMessage.text + chunkText },
            ];
          }
          return prevMessages;
        });
      }
    } catch (e: any) {
      console.error("Gemini API error:", e);
      let errorMessage = "Sorry, connection failed. Please check your API Key in Settings.";
      if (e.message?.includes('401') || e.message?.includes('API key')) {
        errorMessage = "Error: Invalid API Key. Please update it in Settings.";
      } else if (e.message?.includes('quota') || e.message?.includes('429')) {
        errorMessage = "Error: Usage limit exceeded. Please try again later.";
      }

      setError(errorMessage);
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'model' && lastMessage.text === '') {
          return [
            ...prev.slice(0, -1),
            { role: 'model', text: errorMessage }
          ];
        }
        return [...prev, { role: 'model', text: errorMessage }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, messages, t]); // Added messages as dependency for history context

  return { messages, input, setInput, sendMessage, isLoading, error, clearChat };
};