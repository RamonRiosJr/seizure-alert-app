# System Architecture

## Overview

The application follows a **Modular Monolith** architecture within a React/Vite ecosystem. The core philosophy is **"Local-First, Privacy-First"**, ensuring all critical logic functions without an internet connection. Aura 2.0 introduces the **"Medical Vault"** security layer and the **"Adaptive Command Center"** UI engine.

## Component Architecture

### Settings Module (`components/settings/`)

The Settings UI has been evolved from a monolithic `SettingsScreen.tsx` into a **Hub-and-Spoke** model, transitioning into an **Adaptive Command Center** for Aura 2.0.

#### 1. The Hub (`SettingsHub.tsx`)

- **Responsibility:** Acts as the central orchestrator for the settings domain.
- **State Management:** Consumes `SettingsContext` to manage the `activeTab`.
- **Adaptive Grid Heuristic:** Uses a `ModuleRegistry` to dynamically render high-affordance blocks based on screen size and feature flags (3x3 vs 4x4 scale).
- **Lazy Loading:** Supports code-splitting for heavy domains like Medical History.

#### 2. Atomic Tabs

Each tab is a self-contained component responsible for a specific domain.

- **`SafetyTab.tsx`**:
  - **Domain:** Emergency alert management, siren preview, and message configuration.
  - **Features:** Siren test engine, SOS message editor.
  - **Dependencies:** `useEmergencyAlert`, `useLocalStorage`.

- **`PeopleTab.tsx`**:
  - **Domain:** Circle of Care, patient profile, and emergency responders.
  - **Dependencies:** `useConfigContext` (Profiles), `SettingContacts`.

- **`DevicesTab.tsx`**:
  - **Domain:** Dedicated hardware home for wearables and peripherals.
  - **Features:** Smart Watch (Heart Rate) monitoring, NFC programming.
  - **Dependencies:** `DeviceManager`, `SettingNFC`.

- **`AIHubTab.tsx`**:
  - **Domain:** Aura Intelligence domain (Gemini API).
  - **Features:** API Key management (`ApiKeyWizard`), Voice Activation ("Hey Aura") placeholders.

- **`CareTab.tsx`**:
  - **Domain:** Phone care and environment settings.
  - **Features:** Battery health telemetry (`useBattery`), Wake Lock (`useWakeLock`), and Language selection.

#### 3. Shared UI Pattern (`components/ui/`)

We utilize atomic, reusable UI components to ensure consistency.

- **`Card`**: Container with standardized padding, glassmorphism effects, and border styles.
- **`Tabs`**: specialized navigation component using `framer-motion` for smooth layout transitions (`layoutId`).
- **`Switch`**: Accessible toggle input.
- **`Badge`**: Status indicator (e.g., "Pro", "Beta").

## Security & Privacy (Aura Vault)

To maintain FDA/HIPAA-ready standards, Aura 2.0 introduces a tiered access model.

### 1. The PIN Gate

- **Mechanism:** A mandatory local-only PIN protects sensitive domains (Medical Background, Doctor Directory).
- **Encryption:** (Future) Application-level encryption of `localStorage` segments using a PBKDF2-derived key from the user PIN.

### 2. Multi-Role Profiles

- **Clinical View:** A specialized UI mode for scanning by medical professionals (Caregiver/Doctor).
- **Owner View:** full administrative access to monitoring thresholds and alert logic.

### 1. Settings Persistence

- **Source of Truth:** `SettingsContext` (React Context).
- **Storage:** `localStorage` (via `useLocalStorage` hook).
- **Pattern:** Context provides `set` methods; components consume them. No prop drilling for global settings.

### 2. Hardware Telemetry

- **Pattern:** Custom React Hooks (`useBattery`, `useWakeLock`).
- **Mechanism:** Event listeners attached to `window` or `navigator` API.
- **Optimization:** Throttled updates for high-frequency events (e.g., accelerometer).

## Future Roadmap

- **State Management:** Migration to `zustand` for more complex global state if Context performance degrades.
- **Routing:** Integration with `react-router` if deep linking into specific settings tabs becomes a requirement.
- **Styling:** Full migration to Tailwind CSS v4 `@theme` variables for consistent theming.
