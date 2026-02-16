# Implementation Plan: Medical Vault & Patient 360

This plan elaborates on the user's vision for a secure, comprehensive medical background section within Aura Speaks AI.

## 🛡️ Core Infrastructure: The PIN Gate

To ensure FDA and HIPAA "goodie" status (compliance-ready design), we will implement a mandatory PIN layer.

- **Local Vault Encryption**: Use a derived key from the user's PIN to encrypt sensitive `localStorage` keys.
- **Auth Component**: A sleek, num-pad overlay that triggers when accessing "Medical Background" or "Doctor Directory".
- **Session Timeout**: Vault automatically locks after 5 minutes of inactivity.

## 🏥 Module 1: Patient 360 History

A "full-blown medical background" designed to replicate the "first-time at the doctor" experience.

- **Condition Checklist**:
  - Hierarchical list (Neurological, Cardiovascular, Respiratory, etc.).
  - "Specify Other" text inputs for rare conditions.
- **Surgical Registry**:
  - List of past surgeries with dates and notes.
- **Export Engine**:
  - Generate a "Patient Health Record" (PHR) as a clean, printable PDF or a JSON file for sharing with clinics.

## 👨‍⚕️ Module 2: The Specialist Directory

A rich contact management system for the clinical loop.

- **Data model**:

  ```typescript
  interface Doctor {
    id: string;
    type: 'Neurologist' | 'GP' | 'Cardiologist' | 'Specialist';
    name: string;
    address: string;
    email: string;
    website: string;
    phone: string;
    lastAppointment?: Date;
  }
  ```

- **Action UI**: Instant "Call", "Email", or "Open Website" triggers for each doctor profile.

## 🤖 Module 3: Aura "Health Agent" Awareness

Transitioning Aura from a general assistant to a personal health coordinator.

- **Context Injection**: The AI context will include a sanitized summary of the Medical Vault (only while unlocked).
- **Competencies**:
  - "Aura, who is my neurologist?" -> "Your neurologist is Dr. Smith at 555-0123."
  - "List my conditions." -> "You have Epilepsy (Grand Mal) and Hypertension."
- **Appointment Guidance**: Help user draft emails to their doctor or prepare for a visit.

## 📅 Future Scope: Integrated Ecosystem

- **Medicines Sub-tab**: linked to conditions (e.g., Epilepsy -> Keppra 500mg).
- **Calendar**: Automated reminders for follow-ups stored in the Vault.

## 🎨 Aura Command Center: Adaptive Grid Architecture

The user vision demands a transition from traditional tabs to a high-impact, expandable clinical grid.

### 📐 Dynamic Grid Heuristics (Scalable & Non-Hardcoded)

Instead of a fixed 3x3, we will implement a **Responsive Grid Engine**:

- **Baseline (Standard)**: 3-column layout for typical mobile widths.
- **Expansion (Massive Mode)**: As modules (Pharmacy, Claims, Insurance) are added, the grid shifts to a 4-column layout or scrollable vertical groups.
- **Group Affinity**: Blocks are logically tethered to "Domains" (Life, Tech, Clinical) rather than fixed coordinates.

### 🏗️ Technical Implementation

- **Module Discovery**: The UI renders blocks based on a central `ModuleRegistry`.
- **Visual Balance**: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(100px, 1fr))` to ensure the UI feels "full" regardless of block count.
- **Glassmorphism & Depth**: Each block features subtle micro-animations (scale on hover/tap) and depth-based shadows to maintain the premium medical feel.

## 📓 Clinical Memory & AI Journaling

Solves the "90% symptoms forgotten" problem during doctor consultations.

### 🎙️ The Journaling Engine

- **Voice Interface**:
  - **Floating Action Button (FAB)**: A prominent microphone icon available on the main dashboard.
  - **Live Transcription**: Real-time text feedback as the user speaks (using `react-speech-recognition` or native Web Speech API).
  - **Review Card**: A structured preview of the extracted data (Symptom, Severity, Time) before saving.
- **Aura Processing**:
  - User: _"I woke up today with sinus, headache, and vomits."_
  - Aura (Internal): _"Time: Feb 14, 08:30. Entry: Patient reporting sinus congestion, moderate headache, and nausea/emesis. Probable seasonal trigger or migraine."_
- **Clinical Summary**: A specialized view for doctors that groups entries by symptom type and frequency.

### 🚨 Emergency Intelligence

- **Context Awareness**: Aura scans voice entries for "Danger Keywords" (Fall, Stroke Symptoms, Severe Pain).
- **Proactive Assist**:
  - User: _"I fell off today."_
  - Aura: _"I have recorded the fall. Your sensor data shows a likely impact. Would you like me to call 911 or alert your Emergency Contacts now?"_
- **Auto-Log**: Every emergency suggestion is automatically logged as a "High Priority Incident" for medical review.

The bold goal of pharmacy and doctor integration.

- **Push Handlers**: Implementation of external notification hooks for pharmacy partners (Walgreens/CVS).
- **EMR "Fast Pass"**: A specialized clinician-view QR code that authorized providers can scan to pull data directly into their systems (EMR integration).
- **Multi-Role Admin**: PIN-gate separates "Patient" view from "Caregiver/Admin" view for sensitive records.

---

**Verification Plan**:

1. Unit test the PIN hashing and storage encryption logic.
2. Verify PDF generation output for compliance formatting.
3. Mock AI interactions to ensure context awareness works without data leaks.
