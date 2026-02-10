import { useEffect, useRef, useCallback, useState } from 'react';

export const useEmergencyAlert = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRefs = useRef<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(true);

  /* 
   * CRITICAL: Audio Context State Management
   * Web Audio API contexts are often suspended by the browser to save battery or enforce autoplay policies.
   * For a safety-critical application, we must ensure the siren continues even if the device is locked or idle.
   */

  // "Warm up" the audio context on user interaction to unlock it permanently
  const attemptResume = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        console.log("AudioContext resumed successfully by user interaction.");
        setHasAudioPermission(true);
      }).catch(err => {
        console.warn("Audio resume failed (autoplay policy):", err);
        setHasAudioPermission(false);
      });
    }
  }, []);

  const stopAlert = useCallback(() => {
    // Clear all keep-alive intervals
    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current = [];

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
    }

    // We do NOT close the context, we just suspend it or leave it open to avoid re-creation cost/latency
    // Closing it can sometimes make re-opening it harder on mobile Safari
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend().catch(e => console.error("Error suspending context", e));
    }

    oscillatorRef.current = null;
    gainRef.current = null;
    // Keep audioContextRef.current alive for re-use

    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(0);
    }
  }, []);

  const startAlert = useCallback(() => {
    // 1. Vibration effect (SOS Pattern-ish)
    if (typeof navigator.vibrate === 'function') {
      // Clear any existing pattern first
      navigator.vibrate(0);
      const vibrateInterval = window.setInterval(() => {
        navigator.vibrate([500, 200, 500, 200, 1000]); // Pulse... Pulse... Long Pause
      }, 2500);
      intervalRefs.current.push(vibrateInterval);
    }

    // 2. Siren sound effect
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

      // Reuse existing context if available to maintain "unlocked" status
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const context = audioContextRef.current;

      // Aggressive Resume: Force state to running
      if (context.state === 'suspended') {
        context.resume().then(() => {
          setHasAudioPermission(true);
        }).catch(() => {
          console.warn("Could not auto-resume audio context. Waiting for user interaction.");
          setHasAudioPermission(false);
        });
      }

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      gainRef.current = gain;

      // Use a "Sawtooth" or "Square" wave for more piercing/alarming sound than Sine
      oscillator.type = 'sawtooth';
      oscillator.connect(gain);
      gain.connect(context.destination);

      // Ramping for click-prevention
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(isMuted ? 0 : 1, context.currentTime + 0.1);

      oscillator.start(0);

      // Siren Modulation (High-Low)
      let isHigh = true;
      const baseFreq = 880; // A5
      const highFreq = 1100; // ~C#6

      const sirenInterval = window.setInterval(() => {
        if (!context) return;

        // CRITICAL: Keep-Alive Check
        // If OS suspended us, try to resume immediately
        if (context.state === 'suspended') {
          console.log("Context suspended by OS. Attempting aggressive resume...");
          context.resume();
        }

        if (context.state === 'running' && oscillator) {
          const targetFreq = isHigh ? highFreq : baseFreq;
          oscillator.frequency.cancelScheduledValues(context.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(targetFreq, context.currentTime + 0.1);
          isHigh = !isHigh;
        }
      }, 600); // Fast modulation for urgency

      intervalRefs.current.push(sirenInterval);
      oscillatorRef.current = oscillator;

    } catch (e) {
      console.error("Web Audio API failed to initialize.", e);
    }

  }, [isMuted]);

  useEffect(() => {
    startAlert();

    const enterFullscreen = async () => {
      try {
        // Fullscreen can help keep the app active on some Android versions
        const elem = document.documentElement as any;
        if (!document.fullscreenElement) {
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) {
            await elem.webkitRequestFullscreen();
          }
        }
      } catch (err: any) {
        console.log(`Fullscreen request denied/failed: ${err.message}`);
      }
    };

    enterFullscreen();

    return () => {
      stopAlert();
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