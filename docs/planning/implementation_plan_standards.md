# Standards Hardening & Security (Phase 1 & 2)

This plan addresses lingering technical debt and security requirements identified in the project roadmap. We will fix accessibility (A11y) issues in core UI components, implement a strict Content Security Policy (CSP), and resolve all documentation and code lints to achieve a "production-ready" quality gate.

## Proposed Changes

### [A11y & UI Components]

#### [MODIFY] [Switch.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/ui/Switch.tsx)

- Ensure `aria-checked` is passed as a string OR verify why the linter flagged it.
- Add `aria-label` or `aria-labelledby` support since the button itself has no text.

#### [MODIFY] [Tabs.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/ui/Tabs.tsx)

- Add `role="tablist"` to `TabsList`.
- Ensure `aria-selected` is passed correctly.
- Add `aria-controls` to `TabsTrigger` and `id` to `TabsContent` to link them.

#### [MODIFY] [AIHubTab.tsx](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/components/settings/AIHubTab.tsx)

- Add `rel="noopener noreferrer"` to external links.

---

### [Security]

#### [MODIFY] [index.html](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/index.html)

- Add `<meta http-equiv="Content-Security-Policy" content="...">` to restrict resource loading to trusted sources.
- Allow `https://generativelanguage.googleapis.com` for Gemini.
- Allow `https://web-voice-processor.picovoice.ai` (if applicable) and necessary fonts.

---

### [Documentation & Cleanup]

#### [MODIFY] [CHANGELOG.md](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/CHANGELOG.md)

- Resolve duplicate [0.3.0] headings.

#### [MODIFY] [README.md](file:///c:/Users/localadmin/OneDrive%20-%20Coqui%20Cloud/Documents/GitHub/seizure-alert-app/README.md)

- Replace inline HTML with standard Markdown where possible or suppress specific lints if HTML is necessary for design.

## Verification Plan

### Automated Tests

- Run `npm run lint` to confirm all code lints are resolved.
- Run `npx tsc --noEmit` to ensure no regressions.
- Use a browser-based accessibility checker (e.g., Axe) via the browser tool to verify A11y improvements.

### Manual Verification

- Verify that the app still loads correctly with the new CSP (Gemini and Picovoice functionality).
- Check that tab switching and switches are still functional.
