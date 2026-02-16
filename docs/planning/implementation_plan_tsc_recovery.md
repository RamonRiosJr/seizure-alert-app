# Implementation Plan: TypeScript Emergency Recovery

Fixing the build blockage caused by the mismatch between `SettingsContextType` and test mocks after the branch synchronization.

## Proposed Changes

### [Hooks]

#### [NEW] [useSessionStorage.ts](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/hooks/useSessionStorage.ts)

Implement a secure `useSessionStorage` hook to handle sensitive API keys, mirroring Jules's security architecture.

### [Contexts]

#### [MODIFY] [SettingsContext.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/contexts/SettingsContext.tsx)

- Add `geminiApiKey` and `setGeminiApiKey` to `SettingsContextType`.
- Implement state management using `useSessionStorage`.

### [Tests]

#### [MODIFY] Multiple Test Files

Update mock objects in the following files to include the missing Gemini properties:

- [SettingsScreen.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/__tests__/SettingsScreen.test.tsx)
- [CareTab.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/__tests__/CareTab.test.tsx)
- [SafetyTab.test.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/__tests__/SafetyTab.test.tsx)
- [useFallDetection.test.ts](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/hooks/__tests__/useFallDetection.test.ts)
- [useHeartMonitor.test.ts](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/hooks/__tests__/useHeartMonitor.test.ts)
- [useChat.test.ts](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/hooks/__tests__/useChat.test.ts) (Fix undefined error)

## Verification Plan

### Automated Tests

- Run `npx tsc --noEmit` to verify type safety.
- Run `npm test` to ensure all tests pass.
