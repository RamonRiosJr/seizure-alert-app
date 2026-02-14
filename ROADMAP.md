# Project Roadmap: Aura Speaks AI

This document outlines the strategic technical progression and prioritized objectives for the Aura Speaks AI platform, focusing on clinical-grade reliability, regulatory compliance, and architectural excellence.

## 🛡️ Phase 1: Stability & Compliance (Immediate Priorities)

High-priority items focused on safety-critical requisites and regulatory readiness (e.g., GDPR, HIPAA, CE Mark/FDA guidelines).

- [x] **Secure API Integration**: Implemented a client-side guided setup ("Bring Your Own Key" model) with automated validation to ensure zero-cost infrastructure and maximum privacy.
- [x] **Precision Battery Telemetry**: Integrated discharge rate tracking and Wake Lock API to guarantee sensor continuity during monitoring.
- [x] **Localization (i18n) Hardening**: Standardized all UI and telemetry strings for multi-language support (English/Spanish).
- [ ] **Content Security Policy (CSP)**: Implementation of strict meta tags to mitigate XSS risks and enforce secure resource loading.
- [ ] **Global Error Boundary**: Top-level crash recovery UI to ensure "Safe Mode" availability during unexpected failures.

## 🏗️ Phase 2: Architectural Excellence

Enhancing the scalability, maintainability, and quality assurance thresholds of the platform.

- [ ] **Test Coverage Expansion**: Targeted increase of unit and integration test coverage from ~60% to **80%+**, focusing on complex hardware hooks.
- [x] **Architectural Documentation**: Technical deep-dives utilizing Mermaid diagrams for data-flow visualization (Sensor Data → Hook Processing → Local Storage → Alert Dispatch).
- [ ] **CI/CD Hardening**: Integration of Husky and lint-staged to enforce architectural standards at the commit level.
- [ ] **Automated Accessibility Checks**: Integration of Lighthouse CI to maintain "A" grade WCAG compliance.
- [ ] **Dashboard Transformation**: Transition from a button-heavy ReadyScreen to a modular **"Health Command Center"** with a Bottom Navigation Bar for primary app domains.
- [ ] **AI-Augmented Development (Jules Integration)**: Leverage the "Jules" AI agent for specialized task execution, focusing on rapid UX prototyping and test coverage expansion via curated Master Prompts.
- [x] **Settings UI Modularization**: Refactor the monolithic Settings view into a tabbed/hub-based architecture for improved scannability and future-proofing.
- [ ] **Mandatory PIN Infrastructure**: Implementation of a secure, local-only PIN/Biometric gate for sensitive health domains to satisfy FDA/HIPAA-grade privacy standards.

## ✨ Phase 3: Strategic Feature Set

Expansion of the platform's utility as a comprehensive medical-grade assistant.

- [ ] **Bio-Hands-Free Activation**: Voice-triggered ("Hey Aura") alert activation for users with significant motor control limitations.
- [ ] **Wearable Integration**: Synchronized monitoring for Apple Watch and WearOS to leverage wrist-based PPG and accelerometer data.
- [ ] **Clinical Dashboard**: Anonymized data visualization layer for seizure history and biometric trends to facilitate doctor-patient consultations.
- [ ] **Offline Synchronization UI**: Enhanced visual feedback for PWA service worker status and asset updates.
- [ ] **Voice Intelligence (Paid Tier)**:
  - **Audio Journaling**: One-tap voice recording for post-seizure notes or daily symptom logging using Web Speech API.
  - **Doctor Summaries**: AI-driven compilation of voice notes and telemetry into a concise "Clinical Handover" PDF.

## 🏥 Phase 4: Clinical Ecosystem & Caregiver Loop

Developing Aura into a holistic management platform for patient and caregiver synchronization.

- [ ] **Smart Medication Management**:
  - Offline-first medication schedules with high-priority "Critical Window" alarms.
  - Intelligent snooze and escalation protocols for missed doses.
- [ ] **Clinical Calendar Integration**:
  - Secure tracking of specialist appointments with automated pre-appointment biometric summaries.
- [ ] **Caregiver Alert System**:
  - Multi-channel notifications (Push, Email, SMS) for missed medication or emergency triggers, utilizing a secure, privacy-preserving bridge.
- [ ] **Compliance-First Email Infrastructure**:
  - Integration of a HIPAA-compliant email bridging service for general app notifications (e.g., weekly health summaries, system alerts).
  - End-to-end encryption for any PHI (Protected Health Information) delivered via automated internal mailers to ensure audit readiness.
- [ ] **Patient 360: Comprehensive Medical Background**:
  - Longitudinal medical history checklists (Conditions, Surgeries, Hereditary Risks).
  - Specialized Doctor Directory with full contact telemetry (Type, Address, Web, VoIP).
  - **Downloadable Health Records (DHR)**: Exportable, standardized PDF/JSON summaries for first-time doctor visits.
- [ ] **Proactive AI Care Coordination**:
  - The Aura AI assistant shifts from reactive (answering questions) to proactive (reminding of upcoming triggers or appointments based on historical trends).
  - "Knowledge Base" awareness: Aura can answer "Who is my neurologist?" or "What surgeries have I had?" using the secure Vault data.

## 🎨 Phase 5: Aura Design System (UX/UI Evolution)

Finalizing a premium, clinical-grade aesthetic that rivals top-tier medical PWA/Mobile apps.

- [ ] **Aura Command Center: Adaptive Grid UI**:
  - Implementation of a **Dynamic Module Engine** that scales from 3x3 to 4x4.
  - Guided "User-Friendly" Blocks:
    - **Block 1: Patient** (Secure Medical Vault/PIN Access)
    - **Block 2: Contacts** (Emergency Circles)
    - **Block 3: Safety** (Alert Trigger & Siren Controls)
    - **Block 4: Aura AI** (Gemini API Configuration & Intelligence)
    - **Block 5: Devices** (BLE Wearables & Watch Sync)
    - **Block 6: Phone Care** (Battery Telemetry & Low Power Mode)
    - **Block 7: Calendars** (Doctor Appointments)
    - **Block 8: Medication** (Dose Schedules & Reminders)
    - **Block 9: Doctors** (Rich Specialist Directory)
  - Auto-scaling heuristics: Maintain 44x44px minimum hit targets as new blocks (Pharmacy/Insurance) are added.
- [ ] **Modern Navigation Framework**: Implementation of a persistent Bottom Tab Bar (Dashboard, Meds, Calendar, Settings).
- [ ] **Adaptive "Panic" Interaction**: Moving the Emergency button to a high-visibility but non-obstructive location (e.g., Floating Action Button or dedicated Nav anchor).
- [ ] **Component Library Migration**: Leveraging **Shadcn/UI** or **Headless UI** for standardized, accessible, and themeable UI components (Modals, Tabs, Cards).
- [ ] **Glassmorphism & Micro-animations**: Enhancing the "Premium" feel with subtle depth, blur effects, and state-change animations to reduce patient anxiety.

## 💎 Phase 6: Commercial Infrastructure (Freemium Model)

Infrastructure to support the sustainability of the platform (Free Core + Paid Premium).

- [ ] **Subscription Gatekeeper**: Implementation of a lightweight entitlement engine (Free vs. Pro flags) managed locally with server-side validation.
- [ ] **Secure Cloud Backup (Paid Tier)**:
  - End-to-End Encrypted (E2EE) synchronization of patient history to secure cloud storage.
  - "Restore from Cloud" capability for device migration.
- [ ] **Payment Processing**: Integration of Stripe/RevenueCat for handling the $4.99/mo AI & Subscription model.

## 🏥 Phase 7: Institutional Ecosystem (Aura 360)

The transformation from a personal tool to a clinical standard.

- [ ] **Clinical Handshake Protocol**: Secure QR-based or ID-based data sharing. Doctors ask: _"Do you have an Aura account?"_ to instantly ingest validated patient history.
- [ ] **Caregiver Portals**: Multi-role access control (Admin/Caregiver/Viewer) with PIN-gate synchronization.
- [ ] **Data Interoperability**: Integration with FHIR/HL7 standards for seamless EMR (Electronic Medical Record) syncing.

## 💊 Phase 8: Strategic Partnerships (Pharmacy Integration)

Direct-to-patient service bridges.

- [ ] **Pharmacy Push Hub**: Selective integration with pharmacy APIs (Walgreens, CVS, etc.).
- [ ] **Automated Med-Ready Alerts**: Soft-push notifications when prescriptions are ready for pickup, integrated into the Aura Calendar.
- [ ] **Insurance Verification Bridge**: Secure vault for digital insurance cards and pharmacy benefit verification.

---

_Last Updated: February 2026_
