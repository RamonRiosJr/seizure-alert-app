# UI Polish Implementation Plan

## Goal

Clean up the main interface (`ReadyScreen`) and Top Navigation (`TopRightControls`) to improve usability and reduce visual clutter.

## User Review Required

- **Voice Trigger**: Moving this to the bottom footer means it will be less accessible for quick toggling. Is this desired? (User confirmed "down at the bottom").
- **Battery Widget**: Removing the large battery status entirely. Users will rely on the standard device status bar or a smaller indicator if needed.

## Proposed Changes

### Components

#### [MODIFY] [ReadyScreen.tsx](file:///c:/Users/localadmin/OneDrive - Coqui Cloud/Documents/GitHub/seizure-alert-app/components/ReadyScreen.tsx)

- **Remove**: The "Big Green Battery" widget (lines 114-197).
- **Remove**: The "Voice Trigger" toggle (lines 22-42).
- **Action**: Ensure the "Emergency Button" (Red Button) remains the focal point.

#### [MODIFY] [TopRightControls.tsx](file:///c:/Users/localadmin/OneDrive - Coqui Cloud/Documents/GitHub/seizure-alert-app/components/TopRightControls.tsx)

- **Modify**: Move the icons (Settings, etc.) to a bottom navigation bar or footer layout.
- **New Feature**: Add the "Voice Trigger" toggle to this new bottom area.
- **Logic**: Hide/Disable Voice Trigger if `picovoiceApiKey` is missing.

#### [NEW] [BottomNavigation.tsx](file:///c:/Users/localadmin/OneDrive - Coqui Cloud/Documents/GitHub/seizure-alert-app/components/BottomNavigation.tsx)

- **Create**: A new component to house the relocated icons and Voice Trigger.
- **Layout**: Flex row, centered or spaced evenly.

## Verification Plan

### Manual Verification

1. **Home Screen**: Verify the large battery widget is gone.
2. **Voice Trigger**: Verify it appears at the bottom.
3. **API Key Check**: Remove the API key from settings and verify the Voice Trigger is disabled/hidden.
