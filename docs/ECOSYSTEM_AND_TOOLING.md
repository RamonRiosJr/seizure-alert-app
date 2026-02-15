# Enterprise Architecture & Tooling ecosystem

**Document Owner:** Chief Systems Architect
**Version:** 1.1.0
**Status:** Living Document

## 🏛️ Architectural Vision

Aura Speaks AI operates as a **Hybrid-Cloud Intelligent System**, ensuring local-first security while leveraging scalable cloud infrastructure for complex orchestration. This document defines the technical standards and tooling ecosystem.

### 1. The Core Application (Edge Layer)

- **Tech Stack**: React 19, Vite, TypeScript, TailwindCSS (v4).
- **Architecture**: Progressive Web App (PWA). Local-First.
- **Hosting**: **Render** (Static Site Hosting) / Azure Static Web Apps.
- **Role**: Patient-facing interface. Zero-latency, offline-capable.
- **Security**: "Medical Vault" encrypted storage using `sessionStorage` and PIN-derived keys.

### 2. The Orchestration Layer (Cloud/Logic)

- **Engine**: **n8n** (Containerized Workflow Automation).
- **Infrastructure**:
  - **Primary**: Azure Container Instances (ACI) or VPS-based Docker Swarm.
  - **Secondary**: Self-Hosted Proxmox (Data Sovereignty Fallback).
- **Role**: Asynchronous processing, EMR formatting, and multi-party alert dispatch.
  - _Use Case_: Parsing "Medical Journal" exports for clinical review.
  - _Use Case_: Webhook listener for "Fall Detection" SOS signals.

### 3. The CI/CD Pipeline (DevOps)

- **Version Control**: GitHub (Strict Feature Branch Workflow).
- **Validation**: **Jules** (Automated Environment & Quality Gate).
- **Strategy**:
  - `feature/*` -> Pull Request (Lint/Test) -> `main` -> Auto-Deploy.

---

## 🛠️ Tooling & Integration Strategy

### A. Automated Quality Assurance (Jules)

The environment must be deterministic to ensure build integrity.

**Setup Script Configuration:**

```bash
# 1. Install Dependencies
echo "📦 Installing Dependencies..."
npm install

# 2. Verify TypeScript (Quality Gate)
echo "🛡️ Verifying TypeScript..."
npx tsc --noEmit

# 3. Verify Formatting (Style Compliance)
echo "🎨 Checking Code Style..."
npm run format:check

echo "✅ Environment Ready."
```

**Environment Variables:**

- `VITE_GEMINI_API_KEY`: Integration testing credential (Secure).
- `CI`: `true` (Non-interactive mode).

### B. Production Deployment

_Continuous Delivery for High Availability._

- **Source**: GitHub `main` branch.
- **Build Protocol**: `npm run build` -> `dist` artifact.
- **Target**: Render / Azure Static Web Apps.

---

## 📅 Governance Model

1. **Documentation Driven Development (DDD)**:
   - Architectural changes require updated `docs/ARCHITECTURE.md` before implementation.

2. **Branching Strategy**:
   - **`main`**: Production-ready code only.
   - **`arch/*`**: Architectural POCs and structural refactors.
   - **`feat/*`**: New feature development.

3. **Release Management**:
   - Semantic Versioning (vX.Y.Z) tracked in `CHANGELOG.md`.

---

## 🚀 Strategic Roadmap

1. **Environment Stability**: Finalize Jules configuration for reproducible builds.
2. **Cloud Integration**: Provision Azure/VPS resources for the n8n logic layer.
3. **Visual Documentation**: Generate C4 model diagrams for system components.
