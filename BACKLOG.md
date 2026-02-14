# Project Backlog: Medical-Grade Seizure Alert App

_Focus: Maximum Value, Safety-Critical Reliability, and "Shine"_

## 🚨 Critical Priority (The "Colonel's" Demands)

_Items identified as "You're Fired" risks or Regulatory Requirements._

1. [x] **API Key UX Overhaul**:
   - **Current State**: User has to generate their own Google Gemini Key.
   - **Goal**: Implement a backend proxy or a secure, user-friendly onboarding flow. Should not burden the patient.
2. **Battery Telemetry & Management**:
   - [x] Front-and-center battery impact monitoring.
   - [x] Battery testing documentation and guidelines.
3. [x] **Localization (i18n) Hardening**:
   - **Audit**: Eliminate all hardcoded English strings (Error messages, logs).
   - **Goal**: Regulatory compliance (CE Mark/FDA readiness). (Done)
4. [x] **Content Security Policy (CSP)**:
   - **Action**: Add strict CSP meta tags to `index.html` to prevent XSS. (Done)
5. **Medical Vault PIN**:
   - **Action**: Implement a secure gate for medical history and doctor data to ensure HIPAA-ready local privacy.

## 🏗️ Architecture & Standards (The "Real Architect" Standard)

1. [ ] **Test Coverage Expansion**:
   - **Goal**: Increase coverage from ~60% to **80%**.
   - **Focus**: `hooks/` and critical logic paths.
2. [x] **Architecture Documentation**:
   - **Action**: Create `ARCHITECTURE.md` with Mermaid diagrams showing data flow (Sensor -> Hook -> Storage -> Alert).
3. [x] **Global Error Boundary**:
   - **Action**: Implement a top-level Error Boundary to catch crashes and offer a graceful "Safe Mode" UI. (Done)
4. [ ] **Husky & Lint-Staged**:
   - **Action**: Enforce linting and type-checking on `git commit`.

## ✨ Features & "Wow" Factor

1. [x] **Voice Activation ("Hey Aura")**:
   - **Goal**: Hands-free trigger for users with motor control loss.
2. [ ] **Smart Watch Integration**:
   - **Goal**: Companion app for Apple Watch / WearOS for heart rate and fall detection.
3. [ ] **Patient 360 & Doctor Directory**:
   - **Goal**: Full medical history checklist + rich doctor contact profiles.
4. [ ] **Guided Blocks UI (3x3 Grid)**:
   - **Goal**: "Command Center" navigation for Patient/Contacts/Safety, Aura AI/Devices/Phone Care, etc.
5. [ ] **Pharmacy Integration MVP**:
   - **Goal**: Mock notifications for Walgreens/CVS "Med Ready" status.
6. [ ] **Clinical Pulse (Doctor Porta)**:
   - **Goal**: Secure PIN-admin access for data sharing with medical professionals.
7. [ ] **AI "Health Agent" Integration**:
   - **Goal**: Aura answers on behalf of medical data ("When is my next surgery?").
8. [ ] **Smart Calendar & Medicines**:

- **Goal**: Integrated scheduler for appointments and pill reminders with notifications.

## 🔧 Technical Debt & Clean Up

1. [ ] **Stale Branch Cleanup**:
   - Review `feat/dashboard-enhancements` and `feat/smart-watch-integration`.
2. [ ] **Accessibility (A11y)**:
   - **Action**: Maintain the "A" grade. Add Lighthouse CI checks.

---

_Derived from:_

- _Hiring Manager Audit (Feb 11)_
- _Architecture Audit (Feb 11)_
