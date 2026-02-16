# Implementation Plan: Clinical Ecosystem & UI Modularization

This plan outlines the technical and design strategy for evolving Aura Speaks AI into a comprehensive health management platform while maintaining a professional, "Senior Architect" standard.

## 🏗️ Architectural Strategy: The Caregiver Loop

To maintain our **Local-First, Privacy-Always** mandate while adding email/caregiver alerts:

1. **Privacy-Preserving Proxy**: Utilize a secure serverless function (e.g., Vercel/Netlify Functions) to dispatch emails. The app sends only an anonymized `triggerCode` and configured `recipientHash`; the proxy resolves these to human-readable alerts without storing patient data.
2. **HIPAA/FDA Compliant Email Architecture**:
   - **Zero-PHI Policy**: Emails will never contain raw biometric data or specific diagnosis text. Instead, they will link to a secure, locally-authenticated view within the PWA.
   - **Audit Logging**: Implement strictly scoped, anonymized logs of notification delivery to meet FDA post-market surveillance requirements.
   - **Encrypted Internal Mailers**: All communication between the app and the internal email system will use TLS 1.3 and pre-shared session tokens.
3. **Offline-Ready Schedules**: Medication and appointment data will be stored in indexedDB, managed by a dedicated `useEcosystem` hook.
4. **Local Notifications API**: Leverage native PWA notifications for "Snooze/Missed" alerts to ensure functionality without constant internet dependency.

## 🎨 UI Refactor: The Settings Hub

The Settings view is currently a monolithic list. We will transition to a **Tabbed/Category Hub** inspired by modern iOS/Android system settings:

### Proposed Layout

- **Navigation**: Bottom navigation for main app areas (Monitor, Dashboard, Settings).
- **Settings Categories**:
  - **👤 Health Profile**: Medical info, emergency contacts, medicine schedule.
  - **🔔 Alerts & Audio**: Siren tuning, TTS settings, Hey Aura activation.
  - **🧠 AI & Connectivity**: Gemini API key wizard, profile switching.
  - **🔋 Power & Performance**: Battery telemetry, Wake Lock, Low Power Mode.

> [!TIP]
> **Template Strategy**: We will utilize **Tailwind UI / Headless UI** patterns for "Command Palette" style navigation within settings, allowing users to quickly search for specific controls (e.g., "Snooze" or "Gemini").

## 🏥 Feature Breakdown: Medication & Appointments

1. **Medicine Schedule**:
   - **UI**: A timeline view showing "Taken", "Upcoming", and "Missed".
   - **Logic**: Persistent background timers with exponential backoff for snooze alerts.
2. **Clinical Calendar**:
   - **Integration**: iCal/Google Calendar link-out or internal secure tracking.
   - **Pre-Appointment Logic**: 24 hours before a doctor visit, Aura generates a "Biometric Summary" PDF based on the last 30 days of sensor data.

## 🎨 UI/UX Evolution: The Health Command Center

To address the "Crowded Main Screen" issue, we will move away from the current vertical stack:

### 1. Navigation Shell

- **Bottom Tab Bar**: (Dashboard | Medication | Calendar | Settings).
- **Sticky Emergency Trigger**: A dedicated, high-contrast Floating Action Button (FAB) or a permanent center-tab for "Panic/Alert."

### 2. The Dashboard (Home)

- **Primary Hero**: A large "Safe Mode" indicator (e.g., "Aura is Protecting You - All Systems Green").
- **Dynamic Grid**: Modular cards for:
  - **Battery & Sensors**: Real-time telemetry.
  - **Next Med**: "Aspirin in 45m".
  - **Upcoming Appointment**: "Dr. Rios @ 10:00 AM".
- **Interaction**: Tap any card to jump to its specific tab or a detailed modal.

### 3. Design System

- **Framework**: Integrate **Shadcn/UI (Tailwind CSS)** for enterprise-grade components.
- **Micro-Interactions**: Use `framer-motion` for smooth layout transitions between tabs to maintain a "Single Screen" native app feel.

## 🎙️ Voice Intelligence & Paid Tier Architecture

### 1. Audio Journaling & AI Summaries

- **Input**: Use `window.SpeechRecognition` (Web Speech API) for privacy-first, on-device transcription where supported. Fallback to server-side Whisper (via proxy) for older devices, **only** with explicit consent.
- **Processing**:
  1. Patient records voice note: _"Felt dizzy after lunch, took extra meds."_
  2. App transcribes to text locally.
  3. AI (Gemini) correlates text with sensor data (Heart Rate, Motion).
  4. **Output**: A "Doctor Readiness Report" highlighting patterns (e.g., _Dizziness correlates with HR spikes at 1 PM_).

### 2. Secure Cloud Backup (Premium)

- **Architecture**: Zero-Knowledge Encryption.
- **Flow**: data encrypted on device key → Uploaded to Blob Storage (AWS S3/Firebase).
- **Key Management**: User holds the recovery phrase; server cannot read the data (MITM protection).

### 3. Entitlement System

- **Approach**: Feature Flags (`canAccessAI`, `canCloudBackup`).
- **State**: Persisted deeply in `IndexedDB` and validated against a signed JWT from the payment processor on app launch.

## ✅ Verification Plan

### Automated Tests

- Mocking `Notification API` triggers during missed-dose simulations.
- Validating the `recipientHash` logic to ensure no PII (Personally Identifiable Information) leaves the device.

### Manual Verification

- Verifying the "Native Feel" of the new tabbed Settings UI on iOS/Android.
- Testing Snooze/Alert persistence after a browser refresh.
