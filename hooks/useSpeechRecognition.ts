import { useState, useEffect, useRef, useCallback } from 'react';
// Interfaces are now provided globally by speech-recognition.d.ts

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const hasRecognitionSupport =
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!hasRecognitionSupport) return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      if (results && results.length > 0) {
        // Legacy logic check
        const result = results[0];
        if (result && result.length > 0) {
          const primary = result[0];
          if (primary) {
            setTranscript(primary.transcript);
          }
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // This effect runs on mount and sets up the recognition *instance*
    // but doesn't start it yet.
  }, [hasRecognitionSupport]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition', err);
      }
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    hasRecognitionSupport,
  };
};
