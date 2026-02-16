import { useEffect, useRef, useState, useCallback } from 'react';
import { PorcupineWorker } from '@picovoice/porcupine-web';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';
import { useSettings } from '../contexts/SettingsContext';
import { useEmergencyAlert } from './useEmergencyAlert';

/**
 * useWakeWord Hook
 * Manages the Picovoice Porcupine wake-word engine for "Hey Aura" detection.
 */
export const useWakeWord = () => {
  const { voiceActivationEnabled, setVoiceActivationEnabled, picovoiceAccessKey } = useSettings();
  const { startAlert } = useEmergencyAlert();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const porcupineWorkerRef = useRef<PorcupineWorker | null>(null);

  const initEngine = useCallback(async () => {
    if (!picovoiceAccessKey || !voiceActivationEnabled) return;

    try {
      setError(null);

      // Initialize Porcupine Worker
      // Signature: (accessKey, keyword, detectionCallback, modelOptions)
      porcupineWorkerRef.current = await PorcupineWorker.create(
        picovoiceAccessKey,
        'Computer' as never, // cast to never/any to satisfy strict union types for placeholder
        (detection) => {
          if (detection.label === 'Computer') {
            console.log('Wake word "Hey Aura" detected!');
            startAlert();
          }
        },
        {} // modelOptions
      );

      // Start processing audio
      await WebVoiceProcessor.subscribe(porcupineWorkerRef.current);
      setIsListening(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to initialize wake word engine:', errorMessage);
      setError(errorMessage);
      setIsListening(false);
    }
  }, [picovoiceAccessKey, voiceActivationEnabled, startAlert]);

  const stopEngine = useCallback(async () => {
    if (porcupineWorkerRef.current) {
      await WebVoiceProcessor.unsubscribe(porcupineWorkerRef.current);
      await porcupineWorkerRef.current.terminate();
      porcupineWorkerRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) return;
      if (voiceActivationEnabled && picovoiceAccessKey) {
        await initEngine();
      } else {
        await stopEngine();
      }
    };

    run();

    return () => {
      active = false;
      stopEngine();
    };
  }, [voiceActivationEnabled, picovoiceAccessKey, initEngine, stopEngine]);

  const toggleListening = useCallback(() => {
    setVoiceActivationEnabled(!voiceActivationEnabled);
  }, [voiceActivationEnabled, setVoiceActivationEnabled]);

  return { isListening, error, toggleListening };
};
