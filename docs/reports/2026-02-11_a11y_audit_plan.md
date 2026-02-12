# Accessibility Audit - Implementation Plan

## Goal

Conduct a comprehensive WCAG AA accessibility audit and fix all issues to ensure the app is usable by people with disabilities.

## Already Fixed (During Standards Upgrade)

- ✅ Added `aria-label` to close button in `ApiKeyHelpModal.tsx`

## Audit Scope

### 1. Automated Testing

- Install and run `axe-core` or `eslint-plugin-jsx-a11y`
- Generate accessibility report
- Fix all automated issues

### 2. Manual Checks (WCAG AA Requirements)

#### Color Contrast

- [ ] Check all text against backgrounds (4.5:1 for normal text, 3:1 for large text)
- [ ] Verify Dark Mode contrast ratios
- [ ] Check button states (hover, focus, disabled)

#### Keyboard Navigation

- [ ] All interactive elements reachable via Tab
- [ ] Focus indicators visible
- [ ] Modal trapping (Escape to close)
- [ ] Skip links for main content

#### Screen Reader Support

- [ ] All images have `alt` text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text/aria-labels
- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] ARIA landmarks (main, nav, complementary)

#### Focus Management

- [ ] Focus moves to modal when opened
- [ ] Focus returns to trigger when modal closes
- [ ] No keyboard traps

### 3. Component-Specific Checks

#### High Priority Components

1. `AlertScreen.tsx` - Emergency UI must be accessible
2. `SettingsScreen.tsx` - Configuration must be accessible
3. `ReportsScreen.tsx` - Data entry must be accessible
4. All modals (Patient Info, API Key Help, etc.)

## Implementation Steps

1. **Install Tools**

   ```bash
   npm install --save-dev eslint-plugin-jsx-a11y
   npm install --save-dev @axe-core/react
   ```

2. **Update ESLint Config**
   - Add `jsx-a11y` plugin
   - Enable recommended rules

3. **Run Automated Audit**
   - Fix all ESLint warnings
   - Run axe-core in dev mode

4. **Manual Testing**
   - Keyboard-only navigation test
   - Screen reader test (NVDA/JAWS/VoiceOver)
   - Color contrast verification

5. **Document Findings**
   - Create issue for each problem
   - Prioritize by severity
   - Fix critical issues first

## Success Criteria

- [ ] Zero ESLint jsx-a11y warnings
- [ ] All interactive elements keyboard accessible
- [ ] All text meets WCAG AA contrast ratios
- [ ] Screen reader announces all important information
- [ ] Focus management works correctly in all modals
