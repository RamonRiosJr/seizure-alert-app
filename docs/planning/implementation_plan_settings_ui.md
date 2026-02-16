# Implementation Plan: Settings UI Modularization

This plan details the architectural refactor of the monolithic `SettingsScreen.tsx` into a modular, scalable "Settings Hub" as the foundation for the upcoming Clinical Ecosystem features.

## 🎯 Objective

Transform the current list-based Settings screen into a **Tabbed Command Center** using "Atomic" UI components. This ensures:

1. **Scalability**: New features (Voice, Backup) get their own dedicated tabs.
2. **Maintainability**: Styles are encapsulated in reusable components.
3. **Performance**: Reduces re-renders by splitting state domains.

## 🏗️ Component Architecture

We will create a lightweight "Design System" folder `components/ui` containing Shadcn-inspired primitives built with Tailwind CSS v4.

### 1. New Atomic Components (`components/ui/`)

- `Card.tsx`: Standard container with glassmorphism support.
- `Tabs.tsx`: Accessible tab switcher (Headless UI logic or custom state).
- `Switch.tsx`: iOS-style toggle for boolean settings.
- `Badge.tsx`: Status indicators (e.g., "Beta", "Pro").
- `Button.tsx`: Standardized primary/secondary actions.

### 2. New Settings Modules (`components/settings/`)

- `SettingsHub.tsx`: The main container managing Tab state.
- `ProfileTab.tsx`: User info, Medical ID (placeholder), Emergency Contacts.
- `AlertsTab.tsx`: Siren volume, TTS voice selection, Fall Detection sensitivity.
- `SystemTab.tsx`: Battery optimization (Wake Lock), Language, Theme.
- `AIHubTab.tsx` (New): Placeholder for Gemini API Key & future Voice settings.

### 3. State Management

- Update `SettingsContext` to support "Active Tab" persistence (so the user returns to the same tab if they close/open settings).

## 📂 File Structure Changes

```text
src/
  components/
    ui/                 <-- [NEW] Reusable Primitives
      Card.tsx
      Tabs.tsx
      Switch.tsx
      ...
    settings/           <-- [NEW] Feature Modules
      SettingsHub.tsx   <-- Replaces SettingsScreen content
      ProfileTab.tsx
      AlertsTab.tsx
      ...
    SettingsScreen.tsx  <-- Becomes a wrapper for SettingsHub
```

## 📝 Implementation Steps

1. **Create Primitives**: Build the `components/ui` library.
2. **Refactor Context**: Ensure `SettingsContext` is ready for the split.
3. **Build Tabs**: Implement `ProfileTab`, `AlertsTab`, `SystemTab` by extracting code from the current `SettingsScreen.tsx`.
4. **Assemble Hub**: Create `SettingsHub.tsx` to orchestrate the tabs.
5. **Replace**: Update `SettingsScreen.tsx` to render `SettingsHub`.
6. **Verify**: Test all toggles and persistence.

## ✅ Verification Plan

### Automated Tests

- Verify Tab switching logic.
- Ensure Settings changes (e.g., Toggle Wake Lock) propagate to Context.

### Manual Verification

- Visual check of Glassmorphism on Cards.
- Accessibility check (Keyboard navigation between tabs).
