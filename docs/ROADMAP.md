# Project Roadmap: Aura Speaks AI

This document outlines the strategic technical progression and prioritized objectives for the Aura Speaks AI platform, focusing on clinical-grade reliability, regulatory compliance, and architectural excellence.

## 🛡️ Phase 1: Stability & Compliance (Immediate Priorities)

High-priority items focused on safety-critical requisites and regulatory readiness (e.g., GDPR, HIPAA, CE Mark/FDA guidelines).

- [x] **Secure API Integration**: Implemented a client-side guided setup ("Bring Your Own Key" model) with automated validation to ensure zero-cost infrastructure and maximum privacy.
- [x] **Precision Battery Telemetry**: Integrated discharge rate tracking and Wake Lock API to guarantee sensor continuity during monitoring.
- [x] **Localization (i18n) Hardening**: Standardized all UI and telemetry strings for multi-language support (English/Spanish).
- [ ] **Global Medical ID (Traveler’s Safety Net)**: Multi-language (English/Spanish) "Helper Cards" and emergency contacts for foreign responders.
- [ ] **Bystander Life-Line (Immediate Education)**: Implementation of real-time voice instructions during SOS to tell bystanders exactly how to help (Use Case #3).
- [ ] **Content Security Policy (CSP)**: Implementation of strict meta tags to mitigate XSS risks and enforce secure resource loading.
- [ ] **Global Error Boundary**: Top-level crash recovery UI to ensure "Safe Mode" availability during unexpected failures.

## 🏗️ Phase 2: Architectural Excellence

Enhancing the scalability, maintainability, and quality assurance thresholds of the platform.

- [ ] **Test Coverage Expansion**: Targeted increase of unit and integration test coverage from ~60% to **80%+**, focusing on complex hardware hooks.
- [x] **Source Code Migration**: Consolidated all application logic into a standard `src/` directory structure.
- [x] **Test Suite Consolidation**: Unified unit tests into `test/` with strict `@/` path aliases.
- [x] **Architectural Documentation**: Technical deep-dives utilizing Mermaid diagrams for data-flow visualization (Sensor Data → Hook Processing → Local Storage → Alert Dispatch).
- [ ] **CI/CD Hardening**: Integration of Husky and lint-staged to enforce architectural standards at the commit level.
- [ ] **Automated Accessibility Checks**: Integration of Lighthouse CI to maintain "A" grade WCAG compliance.
- [x] **Dashboard Transformation**: Transition from a button-heavy ReadyScreen to a modular **"Health Command Center"** with a Bottom Navigation Bar for primary app domains.
- [ ] **AI-Augmented Development (Jules Integration)**: Leverage the "Jules" AI agent for specialized task execution, focusing on rapid UX prototyping and test coverage expansion via curated Master Prompts.
- [x] **Settings UI Modularization**: Refactor the monolithic Settings view into a tabbed/hub-based architecture for improved scannability and future-proofing.
- [ ] **Mandatory PIN Infrastructure**: Implementation of a secure, local-only PIN/Biometric gate for sensitive health domains to satisfy FDA/HIPAA-grade privacy standards.

## ✨ Phase 3: Strategic Feature Set

Expansion of the platform's utility as a comprehensive medical-grade assistant.

- [ ] **Bio-Hands-Free Activation**: Voice-triggered ("Hey Aura") alert activation for users with significant motor control limitations.
- [ ] **Wearable Integration**: Synchronized monitoring for Apple Watch and WearOS to leverage wrist-based PPG and accelerometer data.
- [ ] **Clinical Dashboard**: Anonymized data visualization layer for seizure history and biometric trends to facilitate doctor-patient consultations.
- [ ] **Offline Synchronization UI**: Enhanced visual feedback for PWA service worker status and asset updates.
- [ ] **Aura Health Journaling (Clinical Memory)**:
  - **Voice-to-Journal**: One-tap (or voice-triggered) entry for symptom logging ("I woke up with sinus and headache").
  - **Clinical Translation**: AI automatically "cleans up" entries for doctors, adding context and time-stamping.
  - **Emergency Heuristics**: If the user logs a fall or severe symptom, Aura suggests immediate 911/SOS escalation.
- [ ] **Doctor Summaries (Aura 360)**:
  - AI-driven compilation of the last 30 days of journaling and telemetry into a concise "Clinical Handover" PDF.
  - Solves the "90% Memory Loss" problem for doctor visits.

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
- [ ] **Patient 360 & Paperless Intake (Clinical Efficiency)**:
  - Longitudinal medical history checklists (Conditions, Surgeries, Hereditary Risks).
  - Specialized Doctor Directory with full contact telemetry (Type, Address, Web, VoIP).
  - **Downloadable Health Records (DHR)**: Exportable PDF/JSON summaries to eliminate 15-20 minutes of paper intake (Use Case #1).
  - **Email-to-Office Bridge**: Direct delivery of patient history to medical providers before the appointment.
- [ ] **AI Health Consultant (Local Q&A)**: Aura answers "Who is my neurologist?" or "What surgeries have I had?" using the secure Vault data (Use Case #7).
- [ ] **Caregiver Peace of Mind (Remote Check-in)**: One-tap status notification with GPS location to reduce caregiver fatigue (Use Case #9).

## 🎨 Phase 5: Aura Design System (UX/UI Evolution)

Finalizing a premium, clinical-grade aesthetic that rivals top-tier medical PWA/Mobile apps.

- [x] **Aura Command Center: Adaptive Grid UI**:
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
- [x] **Modern Navigation Framework**: Implementation of a persistent Bottom Tab Bar (Dashboard, Meds, Calendar, Settings).
- [x] **Adaptive "Panic" Interaction**: Moving the Emergency button to a high-visibility but non-obstructive location (e.g., Floating Action Button or dedicated Nav anchor).
- [x] **Component Library Migration**: Leveraging **Shadcn/UI** or **Headless UI** for standardized, accessible, and themeable UI components (Modals, Tabs, Cards).
- [x] **Glassmorphism & Micro-animations**: Enhancing the "Premium" feel with subtle depth, blur effects, and state-change animations to reduce patient anxiety.

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
- [ ] **The "Un SOLO" Standard (Global Unity)**: Direct onboarding kits for clinics to educate patients on using Aura as their primary record (Use Case #4).
- [ ] **Data Interoperability (Research-Ready)**: Integration with FHIR/HL7 standards for research-fidelity symptom exports (Use Case #10).

## 💊 Phase 8: Strategic Partnerships (Pharmacy Integration)

Direct-to-patient service bridges.

- [ ] **Pharmacy Push Hub**: Selective integration with pharmacy APIs (Walgreens, CVS, etc.).
- [ ] **Automated Med-Ready Alerts**: Soft-push notifications when prescriptions are ready for pickup, integrated into the Aura Calendar.
- [ ] **Insurance Verification Bridge**: Secure vault for digital insurance cards and pharmacy benefit verification.

---

_Last Updated: February 2026_
