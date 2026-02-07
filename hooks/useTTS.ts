
import { useState, useCallback, useRef } from 'react';
// import { GoogleGenAI, Modality } from '@google/genai'; // Removed for simplification
import type { Language } from '../types';

// Helper functions for audio decoding
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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
    const matchingVoice = voices.find(v => v.lang.startsWith(language));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Native TTS Error:", e);
      setIsSpeaking(false);
      setError('Native text-to-speech failed.');
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  /* 
   * SIMPLIFIED: Using Native Browser TTS for reliability and offline support.
   * Removing dependency on external AI SDKs for this critical feature.
   */
  const speak = useCallback((text: string, language: Language) => {
    speakNative(text, language);
  }, [speakNative]);

  return { speak, isSpeaking, error };
};