# Coverage Recovery Plan: Senior-Centric Settings

This plan addresses the coverage threshold failures (Lines: 62.42% / Threshold: 70%) by implementing missing tests for the new settings infrastructure and the critical emergency alert engine.

## User Review Required

> [!NOTE]
> This is a verification-focused task. No functional changes will be made to the app code; however, the test suite will be significantly expanded to ensure stability and meet release quality gates.

## Proposed Changes

### [TESTS] Settings Component Coverage

We will create dedicated test files for each of the new senior-centric tabs to ensure their logic and rendering are fully verified.

#### [NEW] [SafetyTab.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/__tests__/SafetyTab.test.tsx)

- Verify rendering of Siren, Shake, and Fall detection cards.
- **[CRITICAL]**: Test the "Siren Preview" button logic (calls `startAlert`/`stopAlert`).
- Verify the Custom Alert Message editor saves correctly to local storage.

#### [NEW] [PeopleTab.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/__tests__/PeopleTab.test.tsx)

- Verify profile fields (Name, Blood Type, Medical Conditions) interact with `useLocalStorage`.
- Verify the Profile selection dropdown updates the `ConfigContext`.

#### [NEW] [CareTab.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/__tests__/CareTab.test.tsx)

- Verify "Stay Awake" and "Battery Saver" toggles.
- Verify language switching button (EN/ES) calls `i18n.changeLanguage`.

#### [NEW] [DevicesTab.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/__tests__/DevicesTab.test.tsx)

- Verify "Manage Devices" button calls the `onOpenDeviceManager` prop.
- Verify NFC and Heart Rate sections render correctly.

---

### [TESTS] Hook & Core Logic Coverage

#### [NEW] [useEmergencyAlert.test.ts](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/hooks/__tests__/useEmergencyAlert.test.ts)

- Currently at **0.9%** coverage.
- Mock `AudioContext` and `OscillatorNode`.
- Verify `startAlert()` creates nodes and starts oscillators.
- Verify `stopAlert()` disconnects nodes and suspends context.

#### [MODIFY] [SettingsScreen.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/__tests__/SettingsScreen.test.tsx)

- Update mock to include verification of the 5-tab structure in `SettingsHub`.

## Verification Plan

### Automated Tests

- Run `npm run test` and verify all 61+ tests pass.
- Run `npm run coverage` and verify Line Coverage is >70% and Functions >60%.

### CI Integration

- Ensure the `quality-gate` job in CI passes after these changes.
