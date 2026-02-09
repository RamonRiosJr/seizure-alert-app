import { useEffect, useRef, useCallback, useState } from 'react';

export const useEmergencyAlert = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRefs = useRef<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(true);

  const attemptResume = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        setHasAudioPermission(true);
      }).catch(err => {
        console.warn("Audio resume failed (autoplay policy):", err);
        setHasAudioPermission(false);
      });
    }
  }, []);

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
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      audioContextRef.current = context;

      // Check for autoplay policy
      if (context.state === 'suspended') {
        context.resume().then(() => {
          setHasAudioPermission(true);
        }).catch(() => {
          setHasAudioPermission(false);
        });
      }
      // Default is true, so no need to set synchronously if running.


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
      if (audioContextRef.current.state === 'suspended') {
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

    const enterFullscreen = async () => {
      try {
        const elem = document.documentElement as any;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          await elem.msRequestFullscreen();
        }
      } catch (err: any) {
        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      }
    };

    enterFullscreen();

    return () => {
      stopAlert();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    };
  }, [startAlert, stopAlert]);

  return {
    isMuted,
    toggleSound: () => setIsMuted(prev => !prev),
    stopAlert,
    startAlert,
    hasAudioPermission,
    attemptResume
  };
};