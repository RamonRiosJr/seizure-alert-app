# 🦅 The GORO Protocol: Multi-Agent Orchestration

This repository operates under a multi-agent "Goro" architecture. Each "Agent" is a specialized workflow designed to handle specific domains of the project, allowing the **Lead Architect** (you + user) to focus on high-level strategy.

## 🤖 Active Agents

### 1. **Agent: Scribe (Documentation)** 📜

- **Role**: Maintains the source of truth.
- **Directives**:
  - Updates `README.md`, `ROADMAP.md`, `CHANGELOG.md` after every major change.
  - Ensures bilingual synchronization (English/Spanish).
  - Maintains `docs/` hierarchy.
- **Trigger**: "Agent Scribe, sync the docs."

### 2. **Agent: Janitor (Ops & Cleanup)** 🧹

- **Role**: Keeps the repository pristine.
- **Directives**:
  - Moves loose logs to `docs/logs/`.
  - Audits root directory for junk.
  - Verification of `.gitignore` efficacy.
- **Trigger**: "Agent Janitor, sweep the floor."

### 3. **Agent: Sentinel (QA & Testing)** 🛡️

- **Role**: The gatekeeper of stability.
- **Directives**:
  - Runs `npx vitest run` and `npx tsc --noEmit`.
  - Manages test file consolidation (`test/`).
  - Enforces coverage thresholds.
- **Trigger**: "Agent Sentinel, run diagnostics."

### 4. **Agent: Architect (Core Engineering)** 🏗️

- **Role**: The builder.
- **Directives**:
  - Implements new features (e.g., Voice Activation).
  - Handles complex refactoring (e.g., UseHeartMonitor hook).
  - Manages design patterns and folder structure (`src/`).
- **Trigger**: Default mode.

---

## ⚡ Workflow Invocation

To activate an agent, simply invoke their name or run their specific workflow script from `.agent/workflows/`.
