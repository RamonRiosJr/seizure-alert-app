# Settings UI Reorganization & Performance Fix

This plan outlines the restructuring of the Settings Hub to improve discoverability of power and connectivity settings and resolves a scrolling issue within tab panels.

## User Review Required

> [!IMPORTANT]
> **Tab Expansion**: We are moving from 4 tabs to 5 tabs to separate "Power" and "Connectivity" features. This provides clearer categorization but may require slightly more horizontal space on mobile.

## Proposed Changes

### [settings] Settings Component Reorganization

#### [NEW] [PowerTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/PowerTab.tsx)

Create a dedicated Power tab containing:

- Battery Health Card
- Low Power Mode Toggle
- Prevent Sleep Toggle
- System Language Toggle

#### [NEW] [ConnectivityTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/ConnectivityTab.tsx)

Create a dedicated Connectivity tab containing:

- Watch & Wearables (Device Manager integration)
- NFC Activation / Tap-to-Alert configuration

#### [DELETE] [SystemTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/SystemTab.tsx)

The monolithic system tab will be replaced by the two specialized tabs above.

#### [MODIFY] [SettingsHub.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/SettingsHub.tsx)

- Update `TabsList` to include 5 columns.
- Add icons for "Power" (Zap) and "Connectivity" (Activity or Link).
- Update `TabsContent` to render new specialized tabs.
- Ensure `overflow-y-auto` correctly handles the scroll area.

#### [MODIFY] [SettingsScreen.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/SettingsScreen.tsx)

- Double check container height constraints to ensure `SettingsHub` can correctly calculate its internal scroll height.

## Verification Plan

### Manual Verification

- Verify that scrolling works correctly on all 5 tabs (especially Profile and Alerts which tend to be long).
- Confirm that "Watch & Wearables" and "NFC" are correctly grouped under Connectivity.
- Confirm "Battery" and "Sleep" settings are under Power.
