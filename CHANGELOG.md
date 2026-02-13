# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Battery Telemetry & Wake Lock**:
  - `useBattery` hook now tracks discharge rate (%/hour).
  - `useWakeLock` hook ensures screen stays awake during active monitoring.
  - **Settings UI**: New "Power & Performance" section with Battery Health card and "Prevent Sleep" toggle.
  - **ReadyScreen**: Added prominent Battery Status Card showing level, charging status, discharge rate, estimated time remaining, and active features (Low Power Mode, Wake Lock).
  - **Battery Testing Documentation**: Added comprehensive `docs/BATTERY_TESTING.md` with test scenarios, measurement methods, troubleshooting guide, and battery health tips.
- **Strict TypeScript Mode**: Enforced `no-explicit-any` across critical hooks (`useShake`, `useEmergencyAlert`) and components for robust type safety.
- **API Key Wizard**: Added a guided "Bring Your Own Key" setup flow with auto-validation for Google Gemini (Zero Cost for Devs).
- **Runtime Profile Switching**: Users can now switch between "Aura Seizure" and "Aura Senior" modes in Settings.
- **Aura Senior Profile**: A new configured profile optimized for Fall Detection with simplified UI and terminology.
- `ConfigContext`: Global state management for active profiles.

### Changed

- **PWA Installation**: Distinct improvements for mobile:
  - **iOS**: Displays platform-specific "Add to Home Screen" instructions.
  - **Android**: Shows native install prompt or manual button.
- **Settings UI**: Replaced raw API Key input with "Connect Aura AI" workflow; added clear "Connected/Disconnected" status.
- Refactored `ReportsScreen` and `pdfGenerator` to use dynamic terminology from the active profile.
- Updated `SettingsScreen` to include the "Application Mode" dropdown.
- **Migrated to Tailwind CSS v4**: Improved build performance and simplified configuration.
- **Dependency Updates**: Upgraded `typescript`, `vite`, `capacitor`, `i18next`, and `actions` to latest versions.

### Fixed

- **Linting**: Resolved hundreds of ESLint errors and removed unnecessary suppressions.
- Resolved regression in `useHeartMonitor` causing incorrect localStorage key usage.
- Fixed `DeviceManager` toggle for "Workout Mode".

## [0.1.0] - 2026-02-11

### Added

- Initial PWA Release with Offline support.
- "Big Red Button" emergency alert logic.
- Fall Detection algorithm using device accelerometer.
- Heart Rate monitoring via Bluetooth (BLE).
- AI Assistant ("Aura") integration for context-aware help.
- English and Spanish localization.
