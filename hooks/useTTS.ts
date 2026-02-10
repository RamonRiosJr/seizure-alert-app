import { useState, useCallback } from 'react';
// import { GoogleGenAI, Modality } from '@google/genai'; // Removed for simplification
import type { Language } from '../types';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speakNative = useCallback((text: string, language: Language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setError('Text-to-speech not supported in this browser.');
      setIsSpeaking(false);
      return;
    }

    // Cancel any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US';

    // Attempt to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(language));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Native TTS Error:', e);
      setIsSpeaking(false);
      setError('Native text-to-speech failed.');
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  /*
   * SIMPLIFIED: Using Native Browser TTS for reliability and offline support.
   * Removing dependency on external AI SDKs for this critical feature.
   */
  const speak = useCallback(
    (text: string, language: Language) => {
      speakNative(text, language);
    },
    [speakNative]
  );

  return { speak, isSpeaking, error };
};
