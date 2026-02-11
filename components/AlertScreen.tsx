import React, { useState, useEffect, useRef } from 'react';
import type { EmergencyContact, AlertReport } from '../types';
import { useEmergencyAlert } from '../hooks/useEmergencyAlert';
import { useTTS } from '../hooks/useTTS';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  TriangleAlert,
  Volume2,
  VolumeX,
  Loader2,
  Battery,
  BatteryCharging,
  X,
  Info,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { useTranslation } from 'react-i18next';

// Silent audio MP3 base64 (approx 0.5s of silence)
const SILENT_AUDIO =
  'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////wAAAP//OEAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAABHAAAARwAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAABHAAAARwAAAAAAAAAAAAAA';

// --- Battery Status Hook ---
interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions
  ): void;
}

const useBatteryStatus = () => {
  const [batteryStatus, setBatteryStatus] = useState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isSupported: typeof navigator !== 'undefined' && 'getBattery' in (navigator as any),
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const AlertScreen: React.FC = () => {
  const { setScreen } = useUI();
  const { language } = useLanguage();
  const { isMuted, toggleSound, hasAudioPermission, attemptResume } = useEmergencyAlert();
  const { speak, isSpeaking } = useTTS();
  const { t } = useTranslation();
  const [contacts] = useLocalStorage<EmergencyContact[]>('emergency_contacts', []);
  const [reports, setReports] = useLocalStorage<AlertReport[]>('alert_reports', []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patientInfo] = useLocalStorage<any>('patient_info', {});

  const [timer, setTimer] = useState(0);
  const { level, charging, isSupported } = useBatteryStatus();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Stop audio when app is backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.speechSynthesis?.cancel();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.speechSynthesis?.cancel(); // Safety cleanup
    };
  }, []);

  const [statusMessage] = useLocalStorage<string>(
    `seizure_alert_status_message_${language}`,
    t('alertStatus')
  );

  const primaryContact = contacts.length > 0 ? contacts[0] : null;
  const [autoCallCountdown, setAutoCallCountdown] = useState(30);
  const [isAutoCallPending, setIsAutoCallPending] = useState(!!primaryContact);

  const countdownIntervalRef = useRef<number | null>(null);
  const callTimeoutRef = useRef<number | null>(null);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
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
        setAutoCallCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => {
        if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      };
    }
  }, [isAutoCallPending, primaryContact]);

  const cancelAutoCall = () => {
    setIsAutoCallPending(false);
  };

  const formattedTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSpeak = () => {
    const instructions = t('instructions', { returnObjects: true }) as string[];
    const textToRead = `${t('ttsIntro')} ${instructions.join('. ')}`;
    speak(textToRead, language);
  };

  const wasCallInitiated = !isAutoCallPending && autoCallCountdown === 0;
  const wasCallCancelled = !isAutoCallPending && autoCallCountdown > 0;

  const handleDeactivate = () => {
    const newReport: AlertReport = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: timer,
      notes: '',
    };
    setReports([newReport, ...reports]);
    setScreen('ready');
  };

  // Auto-mute siren when speaking starts
  useEffect(() => {
    if (isSpeaking && !isMuted) {
      toggleSound();
    }
  }, [isSpeaking, isMuted, toggleSound]);

  // Global click listener for audio resume (replaces onClick on main div to avoid nesting issues)
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!hasAudioPermission) attemptResume();
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [hasAudioPermission, attemptResume]);

  return (
    <>
      <div className="h-[100dvh] w-screen alert-active flex flex-col box-border cursor-pointer overflow-hidden">
        <audio autoPlay loop src={SILENT_AUDIO} className="hidden">
          <track kind="captions" src="" label="Silence" />
        </audio>
        <header className="relative text-center p-2 flex-shrink-0">
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSound();
              }}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40"
              aria-label={isMuted ? t('sirenUnmute') : t('sirenMute')}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
          <TriangleAlert className="w-12 h-12 mx-auto mb-1" />
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none">
            {t('alertTitle')}
          </h1>

          {/* Status Message - Responsive, no editing */}
          <div className="w-full max-w-4xl mx-auto mt-2 px-4 relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsInfoModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 mx-auto bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors mb-2 backdrop-blur-sm border border-white/10"
            >
              <Info className="w-5 h-5 text-sky-300" />
              <span className="text-lg md:text-xl font-bold text-sky-200 underline decoration-sky-400/50 underline-offset-4">
                {patientInfo.name || t('settingsPatientName') || 'Patient Info'}
              </span>
            </button>
            <p className="text-lg md:text-2xl font-medium text-center leading-tight break-words line-clamp-3 opacity-90">
              {statusMessage || t('alertStatus')}
            </p>
          </div>
        </header>

        {/* Patient Info Modal */}
        {isInfoModalOpen && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsInfoModalOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsInfoModalOpen(false);
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-700"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="w-6 h-6 text-sky-500" />
                  {t('settingsPatientInfo')}
                </h2>
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('settingsPatientName')}
                  </label>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {patientInfo.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('settingsBloodType')}
                  </label>
                  <p className="text-2xl font-bold text-red-500">
                    {patientInfo.bloodType || 'N/A'}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                  <label className="text-sm font-semibold text-red-800 dark:text-red-300 uppercase tracking-wider mb-1 block">
                    {t('settingsMedicalConditions')}
                  </label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                    {patientInfo.medicalConditions || 'None listed'}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-end">
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-grow flex flex-col items-center justify-start px-4 py-2 w-full overflow-y-auto min-h-0">
          <div className="flex items-center justify-center gap-4 my-2 w-full max-w-2xl bg-black bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-3 border-r border-white/20 pr-4">
              <span className="text-sm font-semibold opacity-80 uppercase tracking-wider">
                {t('durationLabel')}
              </span>
              <span className="text-4xl md:text-5xl font-mono font-bold tracking-widest">
                {formattedTime(timer)}
              </span>
            </div>

            {isSupported && level !== null && (
              <div className="flex items-center gap-2 pl-2">
                {charging ? (
                  <BatteryCharging className="w-6 h-6 md:w-8 md:h-8" />
                ) : (
                  <Battery className="w-6 h-6 md:w-8 md:h-8" />
                )}
                <span className="text-xl md:text-2xl font-mono font-bold">{level}%</span>
              </div>
            )}
          </div>

          {primaryContact && (
            <div className="text-center bg-black bg-opacity-20 rounded-lg p-3 my-2 w-full max-w-2xl">
              {isAutoCallPending && (
                <div>
                  <p className="text-lg">
                    {t('autoCalling')} {primaryContact.name} ({primaryContact.relation}){' '}
                    {t('inSeconds')}{' '}
                    <span className="font-bold text-xl">
                      {autoCallCountdown}
                      {t('secondsShort')}
                    </span>
                  </p>

                  {/* Slide to Cancel UI */}
                  <div className="relative w-full max-w-xs h-14 bg-gray-700 rounded-full mt-4 overflow-hidden select-none mx-auto touch-none">
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none uppercase tracking-wider opacity-50 text-sm">
                      {t('slideToCancel')}
                    </div>
                    <div
                      className="absolute left-1 top-1 bottom-1 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing"
                      style={{ transform: `translateX(${dragX}px)` }}
                      onPointerDown={(e) => {
                        (e.target as HTMLElement).setPointerCapture(e.pointerId);
                        setIsDragging(true);
                      }}
                      onPointerMove={(e) => {
                        if (isDragging) {
                          const containerWidth = (e.currentTarget.parentElement as HTMLElement)
                            .offsetWidth;
                          const maxDrag = containerWidth - 56; // width - padding - button width
                          let newX =
                            e.clientX -
                            (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
                              .left -
                            24; // center offset
                          newX = Math.max(0, Math.min(newX, maxDrag));
                          setDragX(newX);
                          if (newX >= maxDrag * 0.9) {
                            cancelAutoCall();
                            setIsDragging(false);
                            setDragX(0);
                          }
                        }
                      }}
                      onPointerUp={(e) => {
                        setIsDragging(false);
                        setDragX(0);
                        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                      }}
                      onPointerLeave={() => {
                        if (isDragging) {
                          setIsDragging(false);
                          setDragX(0);
                        }
                      }}
                    >
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              )}
              {wasCallCancelled && <p className="text-lg opacity-70">{t('callCancelled')}</p>}
              {wasCallInitiated && <p className="text-lg text-green-400">{t('callInitiated')}</p>}
            </div>
          )}

          <div className="w-full max-w-2xl bg-black bg-opacity-20 rounded-lg p-6 my-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-bold">{t('instructionsTitle')}</h2>
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Read instructions aloud"
              >
                {isSpeaking ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>
            <ol className="space-y-3 list-decimal list-inside text-lg md:text-xl">
              {(t('instructions', { returnObjects: true }) as string[])?.map(
                (inst: string, index: number) => (
                  <li key={index}>{inst}</li>
                )
              )}
            </ol>
          </div>

          <div className="w-full max-w-2xl bg-black bg-opacity-20 rounded-lg my-2 p-4">
            <h3 className="text-2xl font-bold mb-3">{t('emergencyContacts')}</h3>
            {contacts.length > 0 ? (
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex justify-between items-center text-lg">
                    <div>
                      <span className="font-semibold">{contact.name}</span>
                      <span className="opacity-80"> ({contact.relation})</span>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-mono bg-white/20 px-3 py-1 rounded-md hover:bg-white/30"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg opacity-80 text-center py-2">{t('noContactsMessage')}</p>
            )}
          </div>
        </main>

        <footer className="p-4 sm:p-6 flex-shrink-0">
          <button
            onClick={handleDeactivate}
            className="w-full text-3xl font-bold py-4 px-8 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition-colors"
          >
            {t('imOkButton')}
          </button>
        </footer>
      </div>
    </>
  );
};

export default AlertScreen;
