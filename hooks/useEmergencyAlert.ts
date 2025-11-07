import { useEffect, useRef, useCallback, useState } from 'react';

export const useEmergencyAlert = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRefs = useRef<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const stopAlert = useCallback(() => {
    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current = [];

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(e => console.error("Error closing AudioContext", e));
    }
    
    oscillatorRef.current = null;
    gainRef.current = null;
    audioContextRef.current = null;

    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(0);
    }
  }, []);

  const startAlert = useCallback(() => {
    // Vibration effect
    if (typeof navigator.vibrate === 'function') {
      const vibrateInterval = window.setInterval(() => {
        navigator.vibrate([500, 200, 500, 200]);
      }, 1400);
      intervalRefs.current.push(vibrateInterval);
    }

    // Siren sound effect
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;
      
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      
      gainRef.current = gain;
      
      oscillator.type = 'sine';
      oscillator.connect(gain);
      gain.connect(context.destination);
      gain.gain.setValueAtTime(isMuted ? 0 : 1, context.currentTime);
      
      oscillator.start(0);
      
      let freq = 800;
      const sirenInterval = window.setInterval(() => {
        if (context.state === 'running') {
            freq = freq === 800 ? 1000 : 800;
            oscillator.frequency.setValueAtTime(freq, context.currentTime);
        }
      }, 500);

      intervalRefs.current.push(sirenInterval);
      oscillatorRef.current = oscillator;

    } catch (e) {
      console.error("Web Audio API is not supported in this browser.", e);
    }

  }, [isMuted]);

  const toggleSound = useCallback(() => {
    if (gainRef.current && audioContextRef.current) {
        if(audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        gainRef.current.gain.exponentialRampToValueAtTime(
            newMutedState ? 0.0001 : 1.0,
            audioContextRef.current.currentTime + 0.1
        );
    }
  }, [isMuted]);

  useEffect(() => {
    startAlert();
    
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });

    return () => {
      stopAlert();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [startAlert, stopAlert]);

  return { isMuted, toggleSound };
};