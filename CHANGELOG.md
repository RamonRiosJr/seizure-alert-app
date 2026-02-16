# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.0-candidate] - 2026-02-16

### 🏗️ Architectural Restructure (The Great Migration)

- **Changed**: Moved all application source code (`components`, `hooks`, `contexts`, `utils`) to `src/`.
- **Changed**: Renamed entry point from `index.tsx` to `src/main.tsx`.
- **Changed**: Updated `vite.config.ts` and `tsconfig.json` to use strict `@/` path aliases pointing to `src/`.
- **Changed**: Consolidated all unit tests into `test/` directory.

### 🧹 Housekeeping

- **Removed**: Deleted `test-results/` and other temporary build artifacts from root.
- **Removed**: Deleted duplicate `ARCHITECTURE.md` and `ROADMAP.md` from root (consolidated to `docs/`).
- **Added**: Created `.editorconfig` for consistent coding standards.

## [v1.5.0] - 2026-02-14

### Added

- **UI**: Added `BottomNavigation` component for better mobile navigation.
- **Feature**: Implemented "Health Command Center" grid layout.
- **Docs**: Added `WALKTHROUGH.md` and updated `README.md`.

## [v1.0.0] - 2026-01-01

### Added

- Initial Release of Aura Speaks AI.
