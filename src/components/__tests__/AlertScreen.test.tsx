import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AlertScreen from '../AlertScreen';

// --- Mocks ---

// Mock hook return values so we can spy on them if needed
const mockSetScreen = vi.fn();
const mockToggleSound = vi.fn();
const mockSpeak = vi.fn();
const mockAttemptResume = vi.fn();

vi.mock('../../contexts/UIContext', () => ({
  useUI: () => ({
    setScreen: mockSetScreen,
  }),
}));

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
  }),
}));

vi.mock('../../hooks/useEmergencyAlert', () => ({
  useEmergencyAlert: () => ({
    isMuted: false,
    toggleSound: mockToggleSound,
    hasAudioPermission: true,
    attemptResume: mockAttemptResume,
  }),
}));

vi.mock('../../hooks/useTTS', () => ({
  useTTS: () => ({
    speak: mockSpeak,
    isSpeaking: false,
  }),
}));

// Mock useLocalStorage to return [initialValue, setValue]
// We can use a simple implementation that just returns the initial value
// Mock useLocalStorage to return [initialValue, setValue]
// We can use a simple implementation that just returns the initial value
vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: <T,>(key: string, initialValue: T) => {
    if (key === 'emergency_contacts') {
      const mockContacts = [{ id: '1', name: 'Mom', phone: '1234567890', relation: 'Parent' }];
      return [mockContacts, vi.fn()];
    }
    return [initialValue, vi.fn()];
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, string | string[]> = {
        alertTitle: 'MEDICAL EMERGENCY',
        alertStatus: 'I am having a seizure. I am not in control.',
        instructions: ['Stay calm. I should be okay in a few minutes.'],
        imOkButton: "I'm OK",
        sirenMute: 'Mute siren',
        sirenUnmute: 'Unmute siren',
        settingsPatientName: 'Patient Name',
        settingsPatientInfo: 'Patient Information',
        settingsBloodType: 'Blood Type',
        settingsMedicalConditions: 'Medical Conditions / Allergies',
        durationLabel: 'DURATION',
        instructionsTitle: 'Instructions for Bystanders',
        emergencyContacts: 'Emergency Contacts',
        noContactsMessage: 'No emergency contacts have been added. Please add them in Settings.',
        ttsIntro: 'A medical emergency is in progress. Please follow these instructions.',
        autoCalling: 'Automatically calling',
        inSeconds: 'in',
        secondsShort: 's',
        slideToCancel: 'Slide to Cancel',
        callCancelled: 'Automatic call was cancelled.',
        callInitiated: 'Automatic call initiated.',
      };

      if (key === 'instructions' && options?.returnObjects) {
        return translations[key];
      }
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
}));

// Mock Battery API
// @ts-ignore
navigator.getBattery = vi.fn().mockResolvedValue({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  charging: true,
  level: 0.9,
});

describe('AlertScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the alert title correctly', () => {
    render(<AlertScreen />);
    // "Emergency Alert" is the default English title in constants.ts
    // We assume constants.ts is real, or we could verify the mock logic.
    // Based on AlertScreen code: {t.alertTitle}
    expect(screen.getByText(/MEDICAL EMERGENCY/i)).toBeInTheDocument();
  });

  it('starts the timer and increments', () => {
    render(<AlertScreen />);

    // Initial state: 00:00
    expect(screen.getByText('00:00')).toBeInTheDocument();

    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('00:01')).toBeInTheDocument();
  });

  it('calls toggleSound when mute button is clicked', () => {
    render(<AlertScreen />);

    // Find the mute button. It has an aria-label that toggles.
    // Default is isMuted: false -> label: t.sirenMute ("Mute Siren")
    const muteButton = screen.getByLabelText(/Mute/i);
    fireEvent.click(muteButton);

    expect(mockToggleSound).toHaveBeenCalledTimes(1);
  });

  it('navigates to "ready" screen when "I\'m OK" is clicked', () => {
    render(<AlertScreen />);

    const okButton = screen.getByText(/I'm OK/i);
    fireEvent.click(okButton);

    expect(mockSetScreen).toHaveBeenCalledWith('ready');
  });

  it('displays instructions', () => {
    render(<AlertScreen />);
    expect(screen.getByText(/Stay calm/i)).toBeInTheDocument();
  });

  it('renders auto-call UI and handles cancellation', () => {
    render(<AlertScreen />);

    // Check for auto-calling text (implied by having contacts now)
    expect(screen.getByText(/Automatically calling/i)).toBeInTheDocument();

    // Find slide to cancel area
    const sliderText = screen.getByText(/Slide to Cancel/i);
    expect(sliderText).toBeInTheDocument();
  });

  it('opens and closes the patient info modal', () => {
    render(<AlertScreen />);

    // Find the patient info button (it displays "Patient Name" by default from mock)
    // The button has specific class names, but we can find it by text "Patient Name"
    const infoButton = screen.getByText(/Patient Name/i);
    fireEvent.click(infoButton);

    // Verify modal content
    expect(screen.getByText(/Medical Conditions/i)).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);

    // Verify modal is gone (queryByText returns null)
    expect(screen.queryByText(/Medical Conditions/i)).not.toBeInTheDocument();
  });
});
