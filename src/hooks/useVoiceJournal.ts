import { useState, useEffect, useCallback, useRef } from 'react';
// Interfaces are now provided globally by speech-recognition.d.ts

export const useVoiceJournal = (language: 'en-US' | 'es-ES' = 'en-US') => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Check support synchronously to avoid useEffect state updates
  // With global types, we can access window properties directly if the environment supports them.
  // However, in SSR or non-browser envs, window might be undefined.
  const isSupported =
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [error, setError] = useState<string | null>(
    isSupported ? null : 'Speech recognition is not supported in this browser.'
  );

  // Ref to hold the SpeechRecognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    // If types are correct, this Ctor is newable.
    const recognition = new SpeechRecognitionCtor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Construct the full string from the event specific to this session.
      const results = event.results;
      let currentTranscript = '';
      for (let i = 0; i < results.length; i++) {
        // Ensure the result and the first alternative exist
        const result = results[i];
        if (result && result[0]) {
          currentTranscript += result[0].transcript;
        }
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isSupported]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        setTranscript(''); // Clear previous session
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
  };
};
