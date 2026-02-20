# Security Policy

We rely on the "Philosophy of the Invisible Adversary" — constant vigilance and proactive defense. Your safety and data privacy are paramount.

## Supported Versions

Please ensure you are using a supported version of the application for the most secure and reliable experience.

| Version | Supported          | Status             |
| ------- | ------------------ | ------------------ |
| > 0.3.x | :white_check_mark: | **Active Support** |
| < 0.3.0 | :x:                | **End of Life**    |

---

## Reporting a Vulnerability

**This application deals with health safety.** If you discover a security vulnerability, we ask that you treat it with the utmost urgency and discretion.

### ⚠️ Critical: Do NOT open a public issue

Publicly disclosing a vulnerability can put users at risk before a fix is available.

### How to Report

Please email the project maintainer directly at:

> 📧 **[info@coqui.cloud](mailto:info@coqui.cloud)**

_Ideally, please encrypt your message using our PGP key if available, or request a secure communication channel in your initial email._

### What to Include

Please include as much of the following as possible:

1. **Type of issue** (e.g., XSS, broken authentication, data leak).
2. **Full paths/URLs** or components involved.
3. **Step-by-step instructions** to reproduce the issue.
4. **Impact assessment** (how could this be exploited?).

---

## Response Timeline

We are committed to resolving security issues promptly.

- **Acknowledgment:** Within 24 hours.
- **Triage & Validation:** Within 48 hours.
- **Fix Implementation:** Priority scheduling (typically < 5 business days for critical issues).
- **Public Disclosure:** Coordinated release after the fix is verified and deployed.

---

## Scope

### ✅ In Scope

- Core application logic (`src/**`).
- Data handling and local storage mechanisms.
- API integrations (Gemini AI, etc.) implementation security.
- Deployment configurations (Github Actions CI/CD).

### ❌ Out of Scope

- Vulnerabilities in third-party libraries (unless actionable by updating).
- Theoretical vulnerabilities without a proof of concept.
- Social engineering or physical attacks.
- Denial of Service (DoS) attacks.

---

## Safe Harbor

We value the security research community. If you conduct your research in good faith and in accordance with this policy:

- We will **not** pursue legal action against you regarding your research.
- We will work with you to understand and resolve the issue quickly.
- We will acknowledge your contribution (with your permission) once the issue is resolved.

Thank you for helping keep our community safe.
