
import { useState, useCallback, useEffect } from 'react';
// import { GoogleGenAI, Modality } from '@google/genai'; // Removed for simplification
import type { Language } from '../types';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to resume AudioContext if suspended (e.g., by OS or browser policy)
  const resumeAudioContext = useCallback(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      // Basic "resume" attempt for Web Audio API if we were using it directly.
      // For SpeechSynthesis, checking paused state help.
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  }, []);

  // Handle visibility change to resume audio if app comes back to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resumeAudioContext();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resumeAudioContext]);

  // Set Media Session Metadata to allow background control/display
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Seizure Alert',
        artist: 'Aura Speaks AI',
        album: 'Emergency Alert',
        artwork: [
          { src: '/seizure-alert-logo.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      });
    }
  }, []);

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

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Ensure screen lock doesn't kill it immediately (best effort)
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
      }
    };
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
