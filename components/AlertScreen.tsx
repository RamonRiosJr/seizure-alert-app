import React, { useState, useEffect, useRef } from 'react';
import type { Language, EmergencyContact } from '../types';
import { translations } from '../constants';
import { useEmergencyAlert } from '../hooks/useEmergencyAlert';
import { useTTS } from '../hooks/useTTS';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WarningIcon, SpeakerIcon, SpeakerOffIcon, LoadingSpinner, BatteryIcon, PencilIcon, CloseIcon, CheckIcon } from '../assets/icons';

// --- Battery Status Hook ---
interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
}

const useBatteryStatus = () => {
  const [batteryStatus, setBatteryStatus] = useState({
    isSupported: typeof navigator !== 'undefined' && 'getBattery' in navigator,
    level: null as number | null,
    charging: null as boolean | null,
  });

  useEffect(() => {
    if (!batteryStatus.isSupported) {
      return;
    }

    let batteryManager: BatteryManager | null = null;

    const updateBatteryStatus = () => {
      if (batteryManager) {
        setBatteryStatus({
          isSupported: true,
          level: Math.round(batteryManager.level * 100),
          charging: batteryManager.charging,
        });
      }
    };

    (navigator as any).getBattery().then((manager: BatteryManager) => {
      batteryManager = manager;
      updateBatteryStatus();

      batteryManager.addEventListener('levelchange', updateBatteryStatus);
      batteryManager.addEventListener('chargingchange', updateBatteryStatus);
    });

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', updateBatteryStatus);
        batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
      }
    };
  }, [batteryStatus.isSupported]);

  return batteryStatus;
};
// --- End Battery Status Hook ---

interface AlertScreenProps {
  language: Language;
  onDeactivateAlert: (duration: number) => void;
}

const AlertScreen: React.FC<AlertScreenProps> = ({ language, onDeactivateAlert }) => {
  const { isMuted, toggleSound } = useEmergencyAlert();
  const { speak, isSpeaking } = useTTS();
  const [contacts] = useLocalStorage<EmergencyContact[]>('emergency_contacts', []);
  const t = translations[language];
  const [timer, setTimer] = useState(0);
  const { level, charging, isSupported } = useBatteryStatus();
  
  const [statusMessage, setStatusMessage] = useState(t.alertStatus);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState('');

  const primaryContact = contacts.length > 0 ? contacts[0] : null;
  const [autoCallCountdown, setAutoCallCountdown] = useState(30);
  const [isAutoCallPending, setIsAutoCallPending] = useState(!!primaryContact);

  const countdownIntervalRef = useRef<number | null>(null);
  const callTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const STATUS_MESSAGE_KEY = `seizure_alert_status_message_${language}`;
    const savedMessage = localStorage.getItem(STATUS_MESSAGE_KEY);
    const initialMessage = savedMessage || t.alertStatus;
    setStatusMessage(initialMessage);
  }, [language, t.alertStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (isAutoCallPending && primaryContact) {
      callTimeoutRef.current = window.setTimeout(() => {
        window.location.href = `tel:${primaryContact.phone}`;
        setIsAutoCallPending(false); 
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      }, 30000);

      countdownIntervalRef.current = window.setInterval(() => {
        setAutoCallCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => {
        if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      };
    }
  }, [isAutoCallPending, primaryContact]);

  const handleSaveStatus = () => {
    const STATUS_MESSAGE_KEY = `seizure_alert_status_message_${language}`;
    localStorage.setItem(STATUS_MESSAGE_KEY, statusInput);
    setStatusMessage(statusInput);
    setIsEditingStatus(false);
  };

  const handleStartEditing = () => {
    setStatusInput(statusMessage);
    setIsEditingStatus(true);
  };

  const handleCancelEditing = () => {
    setIsEditingStatus(false);
  };

  const cancelAutoCall = () => {
    setIsAutoCallPending(false);
  };

  const formattedTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSpeak = () => {
    const textToRead = `${t.ttsIntro} ${t.instructions.join('. ')}`;
    speak(textToRead, language);
  };

  const wasCallInitiated = !isAutoCallPending && autoCallCountdown === 0;
  const wasCallCancelled = !isAutoCallPending && autoCallCountdown > 0;

  return (
    <>
      <div className="h-screen w-screen alert-active flex flex-col box-border">
        <header className="relative text-center p-4 sm:p-6 flex-shrink-0">
           <div className="absolute top-4 right-4">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40"
              aria-label={isMuted ? t.sirenUnmute : t.sirenMute}
            >
              {isMuted ? <SpeakerOffIcon className="w-8 h-8" /> : <SpeakerIcon className="w-8 h-8" />}
            </button>
          </div>
          <WarningIcon className="w-16 h-16 mx-auto mb-2" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{t.alertTitle}</h1>
          <div className="flex items-center justify-center flex-wrap gap-2 mt-2 px-4 min-h-[56px]">
            {isEditingStatus ? (
              <div className="flex items-center gap-2 w-full max-w-md mx-auto">
                <input
                  type="text"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="flex-grow bg-black/10 text-current text-xl md:text-2xl font-medium text-center rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-current"
                  aria-label="Edit status message input"
                />
                <button
                  onClick={handleSaveStatus}
                  className="p-2 rounded-full bg-green-500/50 hover:bg-green-500/80"
                  aria-label="Save status message"
                >
                  <CheckIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleCancelEditing}
                  className="p-2 rounded-full bg-red-500/50 hover:bg-red-500/80"
                  aria-label="Cancel editing status message"
                >
                  <CloseIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-medium text-center">{statusMessage}</p>
                <button
                  onClick={handleStartEditing}
                  className="flex-shrink-0 p-2 rounded-full bg-black/20 hover:bg-black/40"
                  aria-label="Edit status message"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center px-4 overflow-y-auto pb-4">
          <div className="flex items-stretch justify-center gap-4 flex-wrap my-4">
            <div className="text-center bg-black bg-opacity-20 rounded-lg p-4">
              <div className="text-lg font-semibold opacity-80 uppercase tracking-wider">{t.durationLabel}</div>
              <div className="text-7xl md:text-8xl font-mono font-bold tracking-widest">{formattedTime(timer)}</div>
            </div>
            
            {isSupported && level !== null && (
              <div className="text-center bg-black bg-opacity-20 rounded-lg p-4 flex flex-col justify-center">
                <div className="text-lg font-semibold opacity-80 uppercase tracking-wider">Battery</div>
                <div className="flex items-center justify-center text-4xl md:text-5xl font-bold gap-2 mt-1">
                  <BatteryIcon className="w-10 h-10 md:w-12 md:h-12" isCharging={!!charging} />
                  <span className="font-mono">{level}%</span>
                </div>
              </div>
            )}
          </div>

          {primaryContact && (
            <div className="text-center bg-black bg-opacity-20 rounded-lg p-3 my-2 w-full max-w-2xl">
              {isAutoCallPending && (
                <div>
                  <p className="text-lg">
                    Automatically calling {primaryContact.name} ({primaryContact.relation}) in <span className="font-bold text-xl">{autoCallCountdown}s</span>...
                  </p>
                  <button
                    onClick={cancelAutoCall}
                    className="mt-2 bg-white/20 px-4 py-1 rounded-md hover:bg-white/30 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {wasCallCancelled && (
                <p className="text-lg opacity-70">
                  Automatic call to {primaryContact.name} was cancelled.
                </p>
              )}
              {wasCallInitiated && (
                <p className="text-lg text-green-400">
                  Automatic call to {primaryContact.name} initiated.
                </p>
              )}
            </div>
          )}

          <div className="w-full max-w-2xl bg-black bg-opacity-20 rounded-lg p-6 my-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-bold">{t.instructionsTitle}</h2>
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Read instructions aloud"
              >
                {isSpeaking ? <LoadingSpinner className="w-6 h-6"/> : <SpeakerIcon className="w-6 h-6" />}
              </button>
            </div>
            <ol className="space-y-3 list-decimal list-inside text-xl">
              {t.instructions.map((inst: string, index: number) => (
                <li key={index}>{inst}</li>
              ))}
            </ol>
          </div>
          
          <div className="w-full max-w-2xl bg-black bg-opacity-20 rounded-lg my-2 p-4">
            <h3 className="text-2xl font-bold mb-3">{t.emergencyContacts}</h3>
            {contacts.length > 0 ? (
              <div className="space-y-2">
                {contacts.map(contact => (
                  <div key={contact.id} className="flex justify-between items-center text-lg">
                    <div>
                      <span className="font-semibold">{contact.name}</span>
                      <span className="opacity-80"> ({contact.relation})</span>
                    </div>
                    <a href={`tel:${contact.phone}`} className="font-mono bg-white/20 px-3 py-1 rounded-md hover:bg-white/30">{contact.phone}</a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg opacity-80 text-center py-2">{t.noContactsMessage}</p>
            )}
          </div>
        </main>

        <footer className="p-4 sm:p-6 flex-shrink-0">
          <button
            onClick={() => onDeactivateAlert(timer)}
            className="w-full text-3xl font-bold py-4 px-8 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition-colors"
          >
            {t.imOkButton}
          </button>
        </footer>
      </div>
    </>
  );
};

export default AlertScreen;