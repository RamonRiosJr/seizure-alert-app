# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-02-13

### Added

- **Architecture Documentation**:
  - Published `docs/ARCHITECTURE.md` detailing the Hub-and-Spoke component model and data flow.
  - Linked architecture standards directly in `README.md`.
- **Settings UI Modularization**:
  - Refactored monolithic `SettingsScreen` into `SettingsHub` with atomic tabs (`SystemTab`, `ProfileTab`, `AlertsTab`).
  - Implemented scalable tab navigation architecture.

## [0.2.0] - 2026-02-13

### Added

- **Localization (i18n) Hardening**:
  - Implemented comprehensive internationalization framework across the platform.
  - Hardened `ReadyScreen` and `FallDetectionTestMode` for global regulatory readiness.
  - Standardized error handling and telemetry alerts with localized string resources.
- **Battery Telemetry & Power Management**:
  - `useBattery` hook offering high-precision discharge rate tracking (%/hour).
  - `useWakeLock` integration to ensure sensor continuity during critical monitoring.
  - Dedicated **Power & Performance** telemetry dashboard in Settings.
- **API Key Security & UX Overhaul**:
  - Implemented a "Guided Wizard" for secure, client-side Google Gemini integration.
  - Automated key validation via the platform's AI middleware logic.
- **Multi-Profile Runtime Support**:
  - Added support for "Aura Seizure" and "Aura Senior" profiles with runtime terminology injection.
  - Unified configuration management via `ConfigContext`.

### Changed

- **PWA Deployment Optimization**:
  - Refined installation heuristics for iOS (manual flow) and Android (native prompt).
- **Core Strategy**: Migrated to Tailwind CSS v4 for optimized build pipelines and simplified theme architecture.
- **Infrastructure**: Updated TypeScript, Vite, and i18next to the latest stable versions to leverage modern engine performance.

### Fixed

- **Platform Integrity**: Resolved regression in `useHeartMonitor` localStorage persistence.
- **Accessibility**: Standardized ARIA labels and focus management across all power-intensive views.
- **Linting & Type Safety**: Achieved zero-tolerance strict typing and resolved all legacy ESLint technical debt.

## [0.1.0] - 2026-02-11

### Added

- Initial PWA Release with Offline support.
- "Big Red Button" emergency alert logic.
- Fall Detection algorithm using device accelerometer.
- Heart Rate monitoring via Bluetooth (BLE).
- AI Assistant ("Aura") integration for context-aware help.
- English and Spanish localization.
