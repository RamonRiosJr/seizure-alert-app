# Enterprise Architecture & Tooling Ecosystem

**Document Owner:** Chief Systems Architect (Ramon Rios Jr.)
**Version:** 1.0.0
**Status:** Living Document

## 🏛️ Architectural Vision

To achieve "Huge Impact," Aura Speaks AI operates as a **Hybrid-Cloud Intelligent System**, leveraging local-first security with enterprise-grade orchestration. This document defines the tools and standards that elevate the project from a "coding experiment" to a professional platform.

### 1. The Core Application (Frontend)

- **Tech Stack**: React 19, Vite, TypeScript, TailwindCSS (v4).
- **Architecture**: Progressive Web App (PWA). Local-First.
- **Hosting**: **Render** (Static Site Hosting).
- **Role**: The patient-facing interface. Zero-latency, works offline.
- **Key Differentiator**: "Medical Vault" encrypted storage using `sessionStorage` and PIN-derived keys.

### 2. The Orchestration Layer (Backend Logic)

- **Engine**: **n8n** (Self-Hosted on **Proxmox**).
- **Role**: Handles complex, asynchronous workflows that shouldn't burden the phone app.
  - _Example_: Parsing "Medical Journal" exports and formatting them for EMR systems.
  - _Example_: Hosting a webhook listener for the "Fall Detection" SOS signal to relay to multiple caregivers.
- **Infrastructure**: Proxmox container (LXC) or VM ensuring data sovereignty (HIPAA equivalent privacy).

### 3. The AI Workforce (Agentic CI/CD)

- **Primary Agent**: **Antigravity** (Code Generation & Strategy).
- **Environment**: **Jules** (Automated Environment & Validation).
- **Role**: "Jules" acts as the automated Quality Assurance engineer, ensuring no broken code reaches production.

---

## 🛠️ Tooling & Integration Strategy

### A. Jules (The Agentic Environment)

To "act as a pro," the environment must be deterministic. The settings shown in your screenshot should be configured as follows:

**1. Setup Script**
This script runs every time the environment starts, ensuring a clean slate.

```bash
# Install dependencies
echo "📦 Installing Dependencies..."
npm install

# Run Type Checking (Gatekeeper)
echo "🛡️ Verifying TypeScript..."
npx tsc --noEmit

# Verify Formatting
echo "🎨 Checking Code Style..."
npm run format:check

# Snapshot validation
echo "✅ Environment Ready."
```

**2. Environment Variables**

- `VITE_GEMINI_API_KEY`: (Optional) For running integration tests that hit the AI.
- `CI`: `true` (To ensure tests run in non-interactive mode).

### B. Render (Production Deployment)

_Continuous Delivery for High Availability._

- **Source**: Connected to GitHub `main` branch.
- **Auto-Deploy**: Enabled on merge to `main`.
- **Build Command**: `npm run build`.
- **Publish Directory**: `dist`.
- **Impact**: Provides a publicly accessible URL (e.g., `aura-speaks.onrender.com`) that you can show to recruiters instantly on their own phones.

### C. MCP (Model Context Protocol)

_Future Expansion for Proxmox Integration._

- **Concept**: Use MCP servers to allow your AI agents to securely connect to your Proxmox/n8n instance.
- **Use Case**: You could ask the AI, "Check the n8n logs for failed workflows," and it would query your Proxmox server directly without you opening the terminal.

---

## 📅 Governance Model (The "Chief Architect" Workflow)

To differentiate yourself from a junior developer, follow this governance model:

1. **Documentation Driven Development (DDD)**:
   - Never write code before the `docs/USE_CASES.md` and `implementation_plan.md` are signed off.
   - _Status_: **Active**. We are doing this now.

2. **Strict Branching Strategy**:
   - **`main`**: The "Gold Standard". Always deployable. No direct edits.
   - **`arch/aura-2.0-vision`** (or feature branches): Staging area.
   - **Merge Protocol**: Pull Requests must pass the "Jules" checks (TypeScript & Format) before merging to `main`.

3. **The "Release" Mindset**:
   - Don't just "push code." Create **Releases** (v0.1, v0.2) with Changelogs.
   - This shows recruiters you understand product lifecycles.

---

## 🚀 Next Strategic Steps

1. **Configure Jules**: Copy the Setup Script above into your Jules settings.
2. **Connect Render**: Set up the free static site hosting to point to your repo.
3. **Visualize the Architecture**: Create a diagram (MermaidJS) showing the App <-> n8n <-> Proxmox relationship.
