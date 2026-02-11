import { useEffect, useRef, useCallback, useState } from 'react';

export const useEmergencyAlert = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const mainOscillatorRef = useRef<OscillatorNode | null>(null);
  const lfoOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRefs = useRef<number[]>([]); // Keep specific intervals (vibration)
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(true);

  /*
   * CRITICAL: Audio Context State Management
   * We use an LFO (Low Frequency Oscillator) to modulate the siren pitch.
   * This ensures the siren sound is generated entirely within the Audio Thread,
   * so it continues even if the main JS thread is throttled or paused by the OS.
   */

  // "Warm up" the audio context on user interaction to unlock it permanently
  const attemptResume = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current
        .resume()
        .then(() => {
          console.log('AudioContext resumed successfully by user interaction.');
          setHasAudioPermission(true);
        })
        .catch((err) => {
          console.warn('Audio resume failed (autoplay policy):', err);
          setHasAudioPermission(false);
        });
    }
  }, []);

  // Handle visibility change to resume audio if app comes back to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden === false && audioContextRef.current) {
        // 'visible' state check
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const stopAlert = useCallback(() => {
    // Clear vibration intervals
    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current = [];

    // Stop and disconnect Web Audio nodes
    if (mainOscillatorRef.current) {
      try {
        mainOscillatorRef.current.stop();
        mainOscillatorRef.current.disconnect();
      } catch {
        /* ignore */
      }
    }
    if (lfoOscillatorRef.current) {
      try {
        lfoOscillatorRef.current.stop();
        lfoOscillatorRef.current.disconnect();
      } catch {
        /* ignore */
      }
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
    }

    // Do NOT close the context, just suspend to save battery when not in use
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend().catch((e) => console.error('Error suspending context', e));
    }

    mainOscillatorRef.current = null;
    lfoOscillatorRef.current = null;
    gainRef.current = null;

    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(0);
    }
  }, []);

  const startAlert = useCallback(() => {
    stopAlert(); // Ensure clean state

    // 1. Vibration effect (SOS Pattern-ish)
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(0);
      const vibrateInterval = window.setInterval(() => {
        navigator.vibrate([500, 200, 500, 200, 1000]); // Pulse... Pulse... Long Pause
      }, 2500);
      intervalRefs.current.push(vibrateInterval);
    }

    // 2. Siren sound effect (LFO Driven)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

      // Reuse existing context if available to maintain "unlocked" status
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const context = audioContextRef.current;

      // Aggressive Resume: Force state to running
      if (context.state === 'suspended') {
        context
          .resume()
          .then(() => setHasAudioPermission(true))
          .catch(() => {
            console.warn('Could not auto-resume audio context. Waiting for user interaction.');
            setHasAudioPermission(false);
          });
      }

      // Create Nodes
      const mainOsc = context.createOscillator();
      const lfoOsc = context.createOscillator();
      const lfoGain = context.createGain();
      const masterGain = context.createGain();

      gainRef.current = masterGain;
      mainOscillatorRef.current = mainOsc;
      lfoOscillatorRef.current = lfoOsc;

      // Config: Siren wail between ~880Hz and ~1100Hz
      // Center = 990Hz. +/- 110Hz.
      const centerFreq = 990;
      const depth = 110;
      const speed = 4; // Hz (Wails per second)

      mainOsc.type = 'sawtooth'; // Piercing sound
      mainOsc.frequency.value = centerFreq;

      lfoOsc.type = 'sine';
      lfoOsc.frequency.value = speed;

      lfoGain.gain.value = depth;

      // Connect LFO -> LFO Gain -> Main Osc Frequency
      lfoOsc.connect(lfoGain);
      lfoGain.connect(mainOsc.frequency);

      // Connect Main Osc -> Master Gain -> Destination
      mainOsc.connect(masterGain);
      masterGain.connect(context.destination);

      // Ramping volume
      masterGain.gain.setValueAtTime(0, context.currentTime);
      masterGain.gain.linearRampToValueAtTime(isMuted ? 0 : 0.8, context.currentTime + 0.1);

      mainOsc.start();
      lfoOsc.start();
    } catch (e) {
      console.error('Web Audio API failed to initialize.', e);
    }
  }, [isMuted, stopAlert]);

  useEffect(() => {
    // Dynamic volume adjustment without restarting
    if (gainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      gainRef.current.gain.cancelScheduledValues(now);
      gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
      gainRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : 0.8, now + 0.1);
    }
  }, [isMuted]);

  useEffect(() => {
    // Start alert on mount
    startAlert();

    const enterFullscreen = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elem = document.documentElement as any;
        if (!document.fullscreenElement) {
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) {
            await elem.webkitRequestFullscreen();
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    toggleSound: () => setIsMuted((prev) => !prev),
    stopAlert,
    startAlert,
    hasAudioPermission,
    attemptResume,
  };
};
