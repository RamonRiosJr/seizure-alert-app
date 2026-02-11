# Architecture Documentation

## System Overview

**Aura Speaks AI** is a **Local-First, Progressive Web App (PWA)** designed for seizure safety. It prioritizes privacy, reliability, and offline capability.

### Core Principles

1. **Local First**: All data (contacts, logs, settings) is stored in the browser's `localStorage` or `IndexedDB`. No remote database.
2. **Privacy**: No PII is ever transmitted to a server.
3. **Resilience**: The app must function 100% offline (except for AI features).

## Component Architecture

```mermaid
graph TD
    User[User] --> GUI[React UI]

    subgraph "Presentation Layer"
        GUI --> Router[AppRouter]
        Router --> Home[HomeScreen]
        Router --> Alert[AlertScreen]
        Router --> Settings[SettingsScreen]
        Router --> Reports[ReportsScreen]
    end

    subgraph "State Management (Contexts)"
        Home & Alert & Settings --> ThemeCtx[ThemeContext]
        Home & Alert & Settings --> LangCtx[LanguageContext]
    end

    subgraph "Logic Layer (Hooks)"
        Alert --> useEmergency[useEmergencyAlert]
        Alert --> useTTS[useTTS]
        Alert --> useLocation[useLocation]

        Settings --> usePWA[usePWAInstall]
        Settings --> useBLE[useBLE]

        Reports --> useStorage[useLocalStorage]
    end

    subgraph "External Services"
        useTTS --> WebSpeech[Web Speech API]
        useLocation --> Geolocation[Geolocation API]
        useBLE --> WebBluetooth[Web Bluetooth API]
        GUI --> Gemini[Google Gemini API]
    end

    subgraph "Data Persistence"
        useStorage --> LocalStorage[(Browser LocalStorage)]
    end
```

## Data Flow

### Emergency Alert Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as AlertScreen
    participant Hook as useEmergencyAlert
    participant TTS as useTTS
    participant SMS as SMS/Call

    User->>UI: Presses "Emergency" Button
    UI->>Hook: triggerAlert()
    Hook->>TTS: speak("Help, seizure detected")
    Hook->>UI: Start Countdown (30s)

    alt User Cancels
        User->>UI: Slide to Cancel
        UI->>Hook: cancelAlert()
        Hook->>TTS: stop()
    else Countdown Finishes
        Hook->>SMS: triggerSystemCall()
        SMS-->>User: Opens Phone Dialer
    end
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

```mermaid
flowchart LR
    Push[Git Push] --> CI[CI Pipeline]

    subgraph "CI Jobs"
        CI --> Lint[Lint & Format]
        CI --> Test[Unit Tests]
        CI --> Build[Build App]
        CI --> Audit[Security Audit]
    end

    Test -->|Success| Deploy[Deploy (gh-pages)]
    Lint -->|Failure| Reject[Reject Commit]
```
