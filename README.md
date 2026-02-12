# Aura Speaks AI 🗣️🚨

[![CI/CD Pipeline](https://github.com/RamonRiosJr/seizure-alert-app/actions/workflows/ci.yml/badge.svg)](https://github.com/RamonRiosJr/seizure-alert-app/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/package-json/v/RamonRiosJr/seizure-alert-app)](package.json)
[![Deploy Status](https://github.com/RamonRiosJr/seizure-alert-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/RamonRiosJr/seizure-alert-app/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/RamonRiosJr/seizure-alert-app/branch/main/graph/badge.svg)](https://codecov.io/gh/RamonRiosJr/seizure-alert-app)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Read in Spanish](https://img.shields.io/badge/Leer_en_Español-🇵🇷-red)](README.es.md)

<div align="center">
  <img src="public/Aura-Speaks-AI.png" alt="Aura Speaks AI Logo" width="400" />
</div>

> **"When I cannot speak, Aura speaks for me."**
>
> _This app was born from a moment of helplessness. I had a near seizure while eating a sandwich and coffee at the airport in Medellin. Suddenly, it hit me. I lost my ability to speak. I pulled out my phone, but to call who? My girlfriend, an hour away? I needed to communicate, but my mind was racing. I drank my coffee rapidly, and the symptoms faded. As I felt better, I opened my laptop right there in the airport and started prototyping this app. It wasn't about the coffee anymore; in that fraction of 'Aura' time, all we look for is a way to speak up._

**A simple, life-saving seizure diary and assistant. It alerts, logs, and speaks for you when you can't.**

🌐 **Click here to open the App:** [Launch Aura Speaks AI](https://ramonriosjr.github.io/seizure-alert-app/)

Developed by **[Coqui Cloud Dev Co.](https://coqui.cloud)** | [RamonRios.net](https://ramonrios.net)

---

## 📱 Key Features (Simple & Easy)

### 🆘 The "Big Red Button"

<img width="602" height="1127" alt="image" src="https://github.com/user-attachments/assets/8538a33a-df7c-4736-8268-b4ad098e05be" />

- **One-Tap Help:** Just press the big red button if you feel a seizure coming.
- **Safe:** You have to slide to cancel, so you don't call by accident.
- **Loud Alert:** It flashes the screen and makes a loud noise to get people's attention.
- **Automatic Call:** If you don't stop it, it calls your emergency contact automatically after 30 seconds.

### 🏥 Helping the Helpers (Bystanders)

<img width="604" height="1129" alt="image" src="https://github.com/user-attachments/assets/9bbe9509-b0a7-49f1-9d2e-548052609eaa" />
<img width="599" height="1135" alt="image" src="https://github.com/user-attachments/assets/be8e49b6-5b3d-4b18-a4c4-5f3fb033f113" />

- **Talks for You:** The phone speaks out loud, telling people exactly what to do (like "Turn them on their side").
- **Works Offline:** Even if you have no internet, the voice instructions still work.
- **Medical Info:** Shows your Name, Blood Type, and Allergies on the screen.

### 🤖 "Aura" - Your AI Helper

- **Ask Questions:** "Aura" is a smart assistant inside the app.
- **Voice or Text:** You or a helper can ask questions like "What do I do safely?" using your voice.
- **Note:** Aura needs an internet connection to work.

### ⚙️ Easy to Install (PWA)

- **No App Store Needed:** You can install this directly from your browser.
- **iPhone & Android:** Works on almost any phone.
- **Manual Install Button:** Go to **Settings** > **App Installation** to see a big "Install" button or instructions for your phone.

### 📡 New: Tap-to-Alert (NFC) & Quick Actions

- **Instant Start:** Program an NFC tag to trigger the alarm instantly.
- **Shake to Alert:** Shake your phone 3 times to activte the emergency countdown (Enable in Settings).
- **Quick Shortcuts:** Long-press the App Icon on your home screen to launch directly into Emergency Mode.

### 📉 New: Fall Detection Visualizer & Snooze

- **Test Mode:** Visualize your phone's sensor data in real-time to verify Fall Detection works without hurting yourself.
- **Smart Snooze:** Prevent "Alert Fatigue" by snoozing high heart rate alerts for 15 minutes if you are safe.

### ✅ "I'm Safe" Check-in Button

- **False Alarm? No Problem:** Quickly notify your emergency contact that you are okay.
- **One-Tap SMS:** Sends a pre-filled "I am safe" message with your location (via SMS app) to your primary contact.
- **Reduces Anxiety:** Helps prevent caregiver fatigue from accidental alerts.

---

## 🚧 Status: Mobile & PWA Compatibility (Active Fixes)

> **⚠️ IMPORTANT NOTE FOR MOBILE USERS:**
> Currently, the **"Install App" (PWA)** feature may not be working correctly on some mobile devices (iPhone/Android). We are investigating this ASAP.
>
> **Temporary Workaround:**
>
> 1. Open the link in your browser (Chrome/Safari).
> 2. **Bookmark the page** for quick access.
> 3. Type "Aura Speaks" in your browser bar to find it quickly.

**Current Status:**

- **✅ Desktop Chrome:** Fully Functional.
- **✅ Mobile Browsers:** PWA Installation fixed! You can now install the app to your home screen on iOS and Android.
- **✅ Multi-Language:** Full English and Spanish support.
- **Performance:** Tested on iPhone 11+ and modern Androids.

---

## 💻 Tech Stack

Built with modern, production-grade tools to ensure speed, safety, and scalability.

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide React (Icons)
- **State & Internationalization:** React Context API, i18next (English/Spanish)
- **PWA (Progressive Web App):** Vite PWA Plugin, Service Workers (Offline Capability)
- **Testing:** Playwright (E2E), Vitest (Unit), Testing Library
- **Quality:** ESLint (Strict), Prettier, Husky (Pre-commit hooks), Axe-Core (A11y)
- **Deployment:** GitHub Pages (CI/CD)

---

## 🏗️ Architecture & Standards

This project follows **Clean Architecture** principles and **Modern Git Flow**:

### 📂 Modular Structure

- `components/layout`: Global logic listeners (Shake, URL Params) detached from UI.
- `router`: dedicated `AppRouter` for screen management.
- `contexts`: State management via React Context (UI, Theme).

### 🛡️ Quality Assurance

- **CI/CD**: Enterprise-grade GitHub Actions pipeline runs `npm test`, `lint`, and `type-check` on every Pull Request.
- **Accessibility**: Built with **WCAG AA** standards in mind, verified by `axe-core`.
- **Unit Tests**: Critical logic (`useFallDetection`, `useHeartMonitor`, `useLocalStorage`) is fully tested.

---

---

## 🛠️ Instructions for Use

1. **Open the App**: Click the link above.
2. **Add Contacts**: Go to the **Settings (Gear Icon)** ⚙️ and add your specialized Doctor or Family member details.
3. **Install It**: Look for the "Install App" button in Settings to save it to your phone.
4. **Test It**: Press the Red Button to hear the alarm and instructions (Slide to cancel).

---

## 🔒 Privacy & Safety

**"Local First, Privacy Always."**

- **Your Data Stays With You:** All your contacts and medical info are saved **only on your phone**. We don't see it. We don't steal it.
- **No Tracking:** We don't track where you go or what you do.
- **HIPAA Friendly:** Since we don't store your data, your privacy is safe.

---

## ⚠️ Medical Disclaimer

**This is NOT a certified medical device.**
It is an information tool to help attract attention and guide people helping you. **Always call 911 (or your local emergency number)** in a real medical emergency.

---

## 🤝 Support My Mission

This project is a labor of love, but it costs money to keep online (servers, AI costs, and coffee!).

If this tool gives you peace of mind, please consider buying me a coffee to keep it going.

<a href="https://buymeacoffee.com/RamonRiosJr" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

**[☕ Click here to Buy Me a Coffee](https://buymeacoffee.com/RamonRiosJr)**

---

## ✨ Meet the Creator

<div align="center">
  <img src="public/Ramon Rios.png" alt="Ramon Rios" width="150" style="border-radius: 50%; border: 4px solid #b91c1c; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
  
  <br />
  <br />

> **"We cannot control the challenges we face, but we can control how we respond. Let this tool be your voice when you need it most."**
>
> — _Ramon Rios Jr_

</div>

<br />

---

## 📄 License

**GNU General Public License v3.0 (GPLv3)** © 2025 Ramon Rios @ Coqui Cloud
This project is free and open for everyone.
