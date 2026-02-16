# Task: Release v2.0 Candidate

- [x] Create dedicated `release/v2.0-candidate` branch (formerly `arch/aura-2.0-vision`)
- [x] Scrub strategic updates from old/unrelated fix branches

- [x] Integrate "Medical Vault" vision into `ROADMAP.md`
- [x] Expand `BACKLOG.md` with PIN security and doctor directories
- [x] Define "Adaptive Blocks" Settings UI (Command Center Heuristics)
- [x] Integrate "AI Health Journaling" and "Emergency Logic" into Strategy
- [x] Draft "Top 10 Strategic Use Cases" in `docs/USE_CASES.md`
- [x] Align `ROADMAP.md` and `BACKLOG.md` with Use Case milestones
- [x] Synchronize `arch/aura-2.0-vision` with Jules's fixes (Rebase onto main)
- [x] TypeScript Emergency Recovery:
  - [x] Restore `geminiApiKey` to `SettingsContext.tsx`
  - [x] Implement secure `useSessionStorage` hook
  - [x] Update test mocks (`SettingsScreen`, `CareTab`, `SafetyTab`, `AIHubTab`, `useFallDetection`, `useHeartMonitor`)
  - [x] Fix `any` lints in `useShake.test.ts`
  - [x] Fix code formatting issues in `AIHubTab.tsx` and `SettingsContext.tsx`.
- [x] Verify project-wide formatting with `npm run format:check`.
- [x] Emergency Git Branch Recovery:
  - [x] Abort stuck `git merge` and `git rebase` processes.
  - [x] Restore deleted remote branch `arch/aura-2.0-vision`.
  - [x] Delete stale/broken local branches (`docs/...`, `refactor/...`).
- [x] Finalize recovery and unblock development.
- [x] Elaborate Health Journaling UI flow (Voice-to-Vault)
  - [x] Create `components/medical/JournalingFAB.tsx` (Microphone Interface)
  - [x] Implement `hooks/useVoiceJournal.ts` (Speech-to-Text Logic)
  - [x] Design `components/medical/JournalEntryCard.tsx` (Structured Review)
  - [ ] Integrate Gemini Extraction Logic (Unstructured Voice -> JSON)
  - [ ] Connect to `MedicalVaultContext` (Encrypted Storage)
- [ ] Research local encryption libraries for PIN-locked storage (Phase 2)

## Phase 3: Hybrid-Cloud Infrastructure & Orchestration

- [x] Define System Architecture & Tooling Strategy (`docs/ECOSYSTEM_AND_TOOLING.md`)
- [x] Configure CI/CD Environment (Jules) with deterministic Setup Script
- [ ] Deploy Logic Layer (Azure ACI / VPS Docker) - _Strategy Only_
- [ ] Configure Production Deployment (Render / Azure Static Web Apps)
- [ ] Establish Strict Branching Governance (Main vs. Staging)

## Phase 4: UI Polish & User Experience (Current)

- [x] Remove "Big Green Battery" Button from Home Screen
- [x] Relocate Top-Right Icons to Bottom Navigation/Footer
- [x] Move "Voice Trigger" Toggle to Bottom & Disable if API Key missing
- [x] Verify Mobile Responsiveness for new layouts
- [x] Fix TypeScript build errors after refactor
- [x] Verified and Updated Dependencies (ran `npm update` to supersede Dependabot)
- [x] Individually rebased Dependabot branches onto `release/v2.0-candidate`:
  - `lucide-react`: Recreated from `release/v2.0-candidate` (Clean & Merge-Ready)
  - `jsdom`: Recreated from `release/v2.0-candidate` (Clean & Merge-Ready)
  - `types/node`: Recreated from `release/v2.0-candidate` (Clean & Merge-Ready)
  - `i18next` & `i18n-browser-detector`: Failed (Lockfile Conflict) - Manual Merge Required
  - `eslint`: Failed (Major v10 Conflict) - Manual Merge Required
