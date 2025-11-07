
import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
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

  const speak = useCallback(async (text: string, language: Language) => {
    setIsSpeaking(true);
    setError(null);
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
    }
    
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
        setError("API Key not found. Please set it in the settings.");
        setIsSpeaking(false);
        return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: language === 'es' ? 'Puck' : 'Kore' },
              },
          },
        },
      });
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('No audio data received from API.');
      }

      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;
      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        outputAudioContext,
        24000,
        1,
      );

      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputNode);
      source.start();

      source.onended = () => {
        setIsSpeaking(false);
        if (outputAudioContext.state !== 'closed') {
          outputAudioContext.close();
        }
      };

    } catch (e: any) {
      console.error('TTS Error:', e);
      setError('Failed to generate audio.');
      setIsSpeaking(false);
    }
  }, []);

  return { speak, isSpeaking, error };
};
