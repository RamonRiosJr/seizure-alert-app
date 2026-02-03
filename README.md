# Seizure Alert App 🚨

![Seizure Alert App Logo](https://coqui.cloud/web/image/6174-48fd9fa0/LogoSeizuresAlertApp.svg)

**A life-saving PWA tool to help individuals alert bystanders during a seizure, providing clear instructions and an AI assistant for first-aid information.**

🌐 **Live App:** [https://ramonriosjr.github.io/seizure-alert-app/](https://ramonriosjr.github.io/seizure-alert-app/)

---

## 📱 Features

### 🆘 Emergency Response

* **One-Tap Activation:** Large, pulsing emergency button for instant access.
* **Slide-to-Cancel:** Prevent accidental calls with a secure slide gesture.
* **Auto-Call Protocol:** Automatically calls your designated emergency contact after a 30-second countdown (customizable).
* **Multi-Sensory Alert:** Flashes screen, sounds a loud siren, and vibrates to attract immediate attention.

### 🏥 Bystander Support

* **Clear Instructions:** Step-by-step first aid guide (e.g., "Cushion head", "Time the seizure").
* **Text-to-Speech:** Reads instructions aloud for hands-free guidance.
* **Bilingual:** Switch purely between **English** and **Spanish** with a single tap.

### 🤖 AI Health Assistant "Aura"

* **Gemini-Powered:** Ask voice or text questions about seizure safety (e.g., "Is swallowing tongue a myth?").
* **Voice Interaction:** Speak directly to the app during an emergency.

### ⚡ PWA & Offline

* **Installable:** Works like a native app on iOS and Android (Add to Home Screen).
* **Offline-First:** Core alert features work without internet.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS (Dark Mode supported)
* **AI:** Google Gemini API (`gemini-2.0-flash-exp`)
* **PWA:** `vite-plugin-pwa` (Service Workers, Manifest)
* **State:** LocalStorage for privacy (Zero backend).

---

## 🚀 Installation (Mobile)

1. Open the website in Chrome (Android) or Safari (iOS).
2. Tap **Share** (iOS) or **Menu** (Android).
3. Select **"Add to Home Screen"**.
4. Launch from your home screen for the full app experience.

---

## ⚠️ Medical Disclaimer

This application is **NOT a certified medical device**. It is intended as an informational tool to assist in attracting attention and providing guidance to bystanders during a potential medical event. It should not be solely relied upon for emergency situations. In case of a medical emergency, always call your local emergency services immediately. The developer assumes no liability for the use or misuse of this application.
