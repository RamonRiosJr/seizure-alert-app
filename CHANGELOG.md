# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Runtime Profile Switching**: Users can now switch between "Aura Seizure" and "Aura Senior" modes in Settings.
- **Aura Senior Profile**: A new configured profile optimized for Fall Detection with simplified UI and terminology.
- `ConfigContext`: Global state management for active profiles.
- **Strict Mode**: Enforced `no-explicit-any` in ESLint (In Progress).

### Changed

- Refactored `ReportsScreen` and `pdfGenerator` to use dynamic terminology from the active profile.
- Updated `SettingsScreen` to include the "Application Mode" dropdown.

## [0.1.0] - 2026-02-11

### Added

- Initial PWA Release with Offline support.
- "Big Red Button" emergency alert logic.
- Fall Detection algorithm using device accelerometer.
- Heart Rate monitoring via Bluetooth (BLE).
- AI Assistant ("Aura") integration for context-aware help.
- English and Spanish localization.
