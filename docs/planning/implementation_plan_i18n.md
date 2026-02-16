# Implementation Plan: Localization (i18n) Hardening

## Goal

Eliminate all hardcoded English strings in components, hooks, and utilities to ensure the application is fully internationalized and ready for regulatory compliance (CE Mark/FDA).

## User Review Required

> [!IMPORTANT]
> Some technical logs are kept in English for developer debugging, but all user-facing errors (via `alert()` or UI state) will be translated.

## Proposed Changes

### 🌎 Centralized Translations

#### [MODIFY] [translation.json](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/public/locales/en/translation.json)

#### [MODIFY] [translation.json](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/public/locales/es/translation.json)

- Add new keys for:
  - Settings error messages ("Name and Phone Number are required")
  - NFC status messages ("Success! Tag programmed", "Write failed")
  - Backup/Restore status ("Backup file generated", "Restore failed")
  - Battery health status ("Calculating discharge rate...")
  - UI Tooltips and Aria Labels ("Open settings", "Buy me a coffee")
  - Feature descriptions (Fall detection sensitivity tips)

---

### ⚛️ Components

#### [MODIFY] [SettingsScreen.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/SettingsScreen.tsx)

- Replace `alert('Message saved!')` with `alert(t('settingsSaveSuccess'))`
- Translate all validation errors.
- Externalize `placeholder` text for textareas.

#### [MODIFY] [ReadyScreen.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/ReadyScreen.tsx)

- Use `t('batteryHealth')` and others for the newly added Battery card (already partially used but needs hardening).

#### [MODIFY] [FallDetectionTestMode.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/FallDetectionTestMode.tsx)

- Externalize all "How to Test" steps and sensor labels.

---

### 🪝 Hooks & Utilities

#### [MODIFY] [Hooks](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/hooks/)

- Ensure `useHeartMonitor`, `useFallDetection`, and `useBLE` use `t()` where strings are emitted to the user (if any).
- Keep `console.log` in English for dev visibility but clarify if they are critical.

#### [MODIFY] [backupUtils.ts](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/utils/backupUtils.ts)

- Return localized status objects instead of just printing to console.

---

## Verification Plan

### Automated Tests

- `npm run test`: Ensure no breaking changes in logic.
- Verify `t()` calls have default values for safety.

### Manual Verification

- **Language Switch**: Toggle between English and Spanish in Settings.
- **Error States**: Trigger validation errors (e.g., save empty contact) and verify Spanish message.
- **NFC/Backup**: If possible, verify status messages during these operations.
- **Battery**: Hover/view the battery card in both languages.
