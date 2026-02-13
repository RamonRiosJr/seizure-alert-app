# System Architecture

## Overview

The application follows a **Modular Monolith** architecture within a React/Vite/Capacitor ecosystem. The core philosophy is **"Local-First, Privacy-First"**, ensuring all critical logic (seizure detection, logging, settings) functions without an internet connection.

## Component Architecture

### Settings Module (`components/settings/`)

The Settings UI has been refactored from a monolithic `SettingsScreen.tsx` into a **Hub-and-Spoke** model to improve maintainability and scalability.

#### 1. The Hub (`SettingsHub.tsx`)

- **Responsibility:** Acts as the central orchestrator for the settings domain.
- **State Management:** Consumes `SettingsContext` to manage the `activeTab`.
- **Layout:** Renders the persistent `Tabs` navigation and the active tab's content.
- **Lazy Loading:** (Future) Designed to support code-splitting for heavy tabs.

#### 2. Atomic Tabs

Each tab is a self-contained component responsible for a specific domain.

- **`ProfileTab.tsx`**:
  - **Domain:** User identity, medical profile, emergency contacts.
  - **Dependencies:** `useConfigContext` (Profiles), `lucide-react` (Icons).
  
- **`AlertsTab.tsx`**:
  - **Domain:** Notification preferences, siren configuration, fall detection sensitivity.
  - **Dependencies:** Local component state (for now), `useSettings` (Future).

- **`SystemTab.tsx`**:
  - **Domain:** Hardware telemetry and power management.
  - **Features:**
    - Real-time Battery Health & Discharge Rate (`useBattery`).
    - Wake Lock Toggle (`useWakeLock`).
    - Power Mode configuration.
  
- **`AIHubTab.tsx`**:
  - **Domain:** External AI integrations (Gemini API).
  - **Features:** API Key management (`ApiKeyWizard`), Voice Activation settings.

#### 3. Shared UI Pattern (`components/ui/`)

We utilize atomic, reusable UI components to ensure consistency.

- **`Card`**: Container with standardized padding, glassmorphism effects, and border styles.
- **`Tabs`**: specialized navigation component using `framer-motion` for smooth layout transitions (`layoutId`).
- **`Switch`**: Accessible toggle input.
- **`Badge`**: Status indicator (e.g., "Pro", "Beta").

## Data Flow

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
