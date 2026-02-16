# Implementation Plan: Voice Activation ("Hey Aura") - v0.4.0

This phase implements hands-free emergency triggering for users with motor control loss or in high-stress medical situations where physically touching the phone is impossible.

## User Review Required

> [!IMPORTANT]
> **Privacy-First Design**: The "Hey Aura" feature will use **on-device** wake-word detection (Picovoice Porcupine). No audio data will be sent to the cloud for processing.
>
> **Limitations (PWA vs Native)**:
>
> - **In-App**: Always-on listening works perfectly while the app is open.
> - **Background**: On mobile (iOS/Android), OS restrictions may pause microphone access when the screen is locked unless specifically bridged via Capacitor native plugins. Phase 1 focuses on the in-app experience.

## Proposed Changes

### [Component Name] Core Hook

#### [NEW] [useWakeWord.ts](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/hooks/useWakeWord.ts)

Implement a robust hook that manages the Picovoice Porcupine engine.

- Initialize engine with "Hey Aura" model.
- Manage microphone permissions gracefully.
- Trigger the `useEmergencyAlert` flow upon detection.

### [Component Name] UI Integration

#### [MODIFY] [SafetyTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/SafetyTab.tsx)

- Add a "Voice Activation" section.
- Add a toggle for "Hey Aura" wake-word detection.
- Add a visual indicator for "Listening" status.

#### [MODIFY] [SettingsContext.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/contexts/SettingsContext.tsx)

- Add `voiceActivationEnabled` persistent state.

#### [MODIFY] [App.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/App.tsx)

- Add `GlobalWakeWordListener` to the top-level app structure to ensure monitoring across all screens.

## Verification Plan

### Automated Tests

- `hooks/__tests__/useWakeWord.test.ts`: Mocking the Porcupine engine and verifying detection triggers.
- `components/settings/__tests__/SafetyTab.test.tsx`: Verifying the toggle persistence.

### Manual Verification

- Testing the "Hey Aura" command in various environments (quiet vs noisy).
- Verifying that the emergency countdown starts immediately upon detection.
