import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceJournalState {
    isRecording: boolean;
    transcript: string;
    error: string | null;
}

export const useVoiceJournal = (language: 'en-US' | 'es-ES' = 'en-US') => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Ref to hold the SpeechRecognition instance
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        // Basic browser support check
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
            setIsRecording(true);
            setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Combine previous final transcript (handled by state in a real app or accumulation) 
            // For this simple version, we mainly just want the current stream. 
            // Note: React state updates might be tricky with closures here if we append.
            // A simple approach is just setting the latest "session" transcript.
            setTranscript((prev) => prev + finalTranscript + interimTranscript);
            // Correction: The above logic duplicates text because onresult fires repeatedly. 
            // Better strategy: Just construct the full string from the event specific to this session.

            const currentTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
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
    }, [language]);

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
        resetTranscript
    };
};

// Polyfill types for TypeScript if not globally available
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        start(): void;
        stop(): void;
        abort(): void;
        onstart: (event: Event) => void;
        onresult: (event: SpeechRecognitionEvent) => void;
        onerror: (event: SpeechRecognitionErrorEvent) => void;
        onend: (event: Event) => void;
    }

    interface SpeechRecognitionEvent extends Event {
        resultIndex: number;
        results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionResultList {
        length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionResult {
        isFinal: boolean;
        [index: number]: SpeechRecognitionAlternative;
    }

    interface SpeechRecognitionAlternative {
        transcript: string;
        confidence: number;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
        message: string;
    }
}
