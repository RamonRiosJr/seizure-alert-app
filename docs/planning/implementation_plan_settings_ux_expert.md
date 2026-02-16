# Senior-Centric Settings UI Reorganization (Expert UX)

This plan transforms the current technical settings into a safety-first, senior-friendly experience. It addresses information architecture gaps, technical terminology friction, and the reported scrolling issues.

## User Review Required

> [!IMPORTANT]
> **New Feature: Siren Preview**: We are adding a "Test Siren" button to the Safety tab. This allows users to hear the alarm volume without triggering a full emergency sequence.
> **Navigation Change**: Replacing "System" and "Profile" with more intuitive labels like "Phone Care" and "My People".

## Proposed Changes

### [settings] Information Architecture Reorganization

We will reorganize the settings into 5 clear, action-oriented tabs:

#### 1. **Safety First** (Tab: `safety`)

- **Move Everyting Related to Emergency Here**:
  - Siren Toggle
  - **[NEW]** "Test Siren Sound" Button (Previews the Web Audio siren)
  - Shake to Alert (SettingShake)
  - Fall Detection (SettingFallDetection)
  - Custom Alert Message (AlertMessageEditor)

#### 2. **My People** (Tab: `people`)

- **Focus on the "Emergency Circle"**:
  - Patient Profile (Name, Blood Type, Medical Conditions)
  - Emergency Contacts (SettingContacts)

#### 3. **My Devices** (Tab: `devices`)

- **Hardware Connectivity**:
  - Watch & Wearables (Device Manager)
  - Heart Rate Monitoring
  - NFC Activation (SettingNFC)

#### 4. **Aura Brain** (Tab: `aura`)

- **Intelligent Assistance**:
  - AI Assistant Settings (Aura AI Wizard)
  - Voice / TTS Settings

#### 5. **Phone Care** (Tab: `care`)

- **Device Maintenance**:
  - Battery Saver (formerly Low Power Mode)
  - Stay Awake (formerly Prevent Sleep)
  - Language Settings (English/Spanish)

---

### [UI/UX] Components & Layout Fixes

#### [MODIFY] [SettingsHub.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/SettingsHub.tsx)

- Update `TabsList` to use the 5 new tabs with senior-friendly icons.
- **Scroll Fix**: Refactor the container to use a robust `flex-1 overflow-y-auto` structure. Ensure that only the content area scrolls, keeping the tab bar sticky at the top.
- Add `max-h-full` to tab contents to prevent them from pushing the modal boundaries incorrectly.

#### [MODIFY] [AlertsTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/AlertsTab.tsx) -> Rename to [SafetyTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/SafetyTab.tsx)

- Add "Siren Preview" button utilizing `useEmergencyAlert` hooks.
- Simplify descriptions to be more conversational ("Keep me safe if I fall" vs "Enable Fall Detection").

#### [NEW] [ConnectivityTab.tsx] -> [DevicesTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/DevicesTab.tsx)

- Dedicated home for Wearables and NFC.

#### [NEW] [CareTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/CareTab.tsx)

- Dedicated home for Power and Language.

## Verification Plan

### Automated Tests

- Verify `SettingsHub.test.tsx` works with the 5 new tab IDs.
- Smoke test the Siren Preview button (mocking AudioContext).

### Manual Verification

- **Senior UX Check**: Ensure text sizes and icons are distinct.
- **Scroll Check**: Verify that long lists (Emergency Contacts) scroll correctly and "Save" buttons are always accessible.
- **Siren Preview**: Verify the "Test" button plays sound and stops correctly.
