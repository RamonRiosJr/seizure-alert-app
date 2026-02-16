# Restoration of Missing Settings (v0.3.1)

This plan outlines the recovery and re-integration of features lost during the Settings UI modularization.

## User Review Required

> [!IMPORTANT]
> **Data Migration**: I noticed a discrepancy in the local storage key for contacts (`emergency_contacts` vs `emergencyContacts`). I will unify these to ensure user data persists correctly.

## Proposed Changes

### [Component] Settings Hub & Tabs

#### [MODIFY] [ProfileTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/ProfileTab.tsx)

- [ ] Implement Patient Info fields (Name, Blood Type, Medical Conditions).
- [ ] Integrate `SettingContacts` component.
- [ ] Fix contact editing by ensuring the component is correctly wired to `useLocalStorage('emergency_contacts', [])`.

#### [MODIFY] [AlertsTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/AlertsTab.tsx)

- [ ] Integrate `SettingShake` component.
- [ ] Integrate `SettingFallDetection` component.
- [ ] Add "Custom Alert Message" editor logic recovered from the old `SettingsScreen.tsx`.

#### [MODIFY] [SystemTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/SystemTab.tsx)

- [ ] Add "Watch & Wearables" section.
- [ ] Add button to launch `DeviceManager` (Watch/BLE settings).
- [ ] [NEW] Create `SettingNFC.tsx` by extracting the NFC logic from the old `SettingsScreen.tsx`.
- [ ] Integrate `SettingNFC` into the tab.

#### [MODIFY] [SettingContacts.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/SettingContacts.tsx)

- [ ] Change storage key to `emergency_contacts` for backward compatibility.
- [ ] Ensure the UI is consistent with the new design system.

## Verification Plan

### Automated Tests

- [ ] Update `SettingsScreen.test.tsx` to verify presence of Shake, NFC, and Contact settings.
- [ ] Run `npm run test` to ensure no regressions.

### Manual Verification

- [ ] Verify that previously saved contacts appear in the Profile tab.
- [ ] Verify that NFC programming can be initiated.
- [ ] Verify that "Watch" settings (Heart Rate threshold) are adjustable.
