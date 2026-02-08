
import { useState, useCallback, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTranslation } from 'react-i18next';
import type { ChatMessage, Language } from '../types';
import { getSystemPrompt } from '../constants';

export const useChat = (language: Language) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([{ role: 'model', text: t('chatInitialGreeting') }]);
  }, [language, t]);

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
      const errorMsg = "API Key not found. Please set it in the settings.";
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

      const chat = model.startChat({
        history: [], // We could pass previous messages here if we wanted context
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
  }, [language]);

  return { messages, input, setInput, sendMessage, isLoading, error };
};