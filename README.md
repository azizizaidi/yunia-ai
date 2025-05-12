# Yunia AI – Smart Personal Assistant Dashboard (Frontend)

<div align="center">
 <svg viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
  <!-- Main AI icon - stylized neural network with brain-like appearance -->
  <g transform="translate(10, 10)">
    <!-- Background circle with gradient -->
    <defs>
      <radialGradient id="bgGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" style="stop-color:#667EEA;stop-opacity:0.1" />
        <stop offset="100%" style="stop-color:#667EEA;stop-opacity:0.03" />
      </radialGradient>
      <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667EEA" />
        <stop offset="100%" style="stop-color:#764AF1" />
      </linearGradient>
    </defs>
    
    <!-- Outer circle -->
    <circle cx="20" cy="20" r="18" fill="url(#bgGradient)" stroke="none"/>
    
    <!-- Neural network nodes -->
    <circle cx="15" cy="12" r="2.5" fill="url(#nodeGradient)"/>
    <circle cx="25" cy="12" r="2.5" fill="url(#nodeGradient)"/>
    <circle cx="20" cy="20" r="3" fill="url(#nodeGradient)"/>
    <circle cx="12" cy="28" r="2.5" fill="url(#nodeGradient)"/>
    <circle cx="28" cy="28" r="2.5" fill="url(#nodeGradient)"/>
    
    <!-- Connection lines -->
    <path d="M15,12 Q20,16 20,20" stroke="#667EEA" stroke-width="1.5" fill="none" opacity="0.8"/>
    <path d="M25,12 Q20,16 20,20" stroke="#667EEA" stroke-width="1.5" fill="none" opacity="0.8"/>
    <path d="M20,20 Q16,24 12,28" stroke="#667EEA" stroke-width="1.5" fill="none" opacity="0.8"/>
    <path d="M20,20 Q24,24 28,28" stroke="#667EEA" stroke-width="1.5" fill="none" opacity="0.8"/>
    
    <!-- Central pulse effect -->
    <circle cx="20" cy="20" r="1" fill="#F093FB" opacity="0.9"/>
  </g>
  
  <!-- Company name -->
  <text x="55" y="32" font-family="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="700" fill="#2D3748">Yunia</text>
  <text x="108" y="32" font-family="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="400" fill="#6B73FF">AI</text>
  
  <!-- Tagline -->
  <text x="55" y="47" font-family="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="400" fill="#718096" letter-spacing="0.5px">Personal Assistant AI</text>
</svg>
  
  <h3>✨ "Hi, I'm Yunia — your personal AI assistant." ✨</h3>
  
  <div align="center">
    <img alt="React" src="https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react&logoColor=white" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
  </div>
  
  <br />
  
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-folder-structure">Structure</a> •
  <a href="#-development-timeline">Timeline</a>
</div>

<br />

---

<div align="center">
  <h2>🎯 Overview</h2>
  <img src="https://github.com/user-attachments/assets/placeholder-dashboard" alt="Yunia AI Dashboard Preview" width="800" />
</div>

**Yunia AI** is a smart, contextual assistant web app designed to help users manage their daily habits, routines, environment, and productivity — powered by voice interaction, live data integration, and modular design.

- 🎯 Manage tasks, habits, and reminders
- 🌤️ Get context-aware insights (weather, traffic, time, location)
- 🎤 Use voice input/output
- 📅 Integrate Google Calendar
- 🤖 View AI-generated briefings
- 📱 Modular structure and SaaS-ready plan display

Built as part of a **14-day bootcamp frontend project**, this system is the foundation for a full-stack AI SaaS assistant.

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/login-rounded-right.png" width="60" />
        <br /><strong>Auth System</strong>
        <br />Login & Register
      </td>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/chat.png" width="60" />
        <br /><strong>AI Chat</strong>
        <br />Text + Voice Interface
      </td>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/habit.png" width="60" />
        <br /><strong>Habit Tracker</strong>
        <br />Track & Manage Habits
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/bell.png" width="60" />
        <br /><strong>Notifications</strong>
        <br />Smart Reminders
      </td>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-day.png" width="60" />
        <br /><strong>Live Data</strong>
        <br />Weather, Traffic, Location
      </td>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/google-calendar.png" width="60" />
        <br /><strong>Calendar</strong>
        <br />Google Integration
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/robot.png" width="60" />
        <br /><strong>Autopilot</strong>
        <br />AI Briefings
      </td>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/subscription.png" width="60" />
        <br /><strong>SaaS Plans</strong>
        <br />Free / Pro / Business
      </td>
      <td align="center">
        <img src="https://img.icons8.com/fluency/96/000000/responsive.png" width="60" />
        <br /><strong>Responsive</strong>
        <br />Desktop & Mobile
      </td>
    </tr>
  </table>
</div>

---

## 🛠 Tech Stack

<div align="center">
  <table>
    <tbody>
      <tr>
        <td align="center" width="120">
          <img src="https://img.icons8.com/color/96/000000/react-native.png" width="40" />
          <br /><strong>React 18</strong>
        </td>
        <td align="center" width="120">
          <img src="https://img.icons8.com/color/96/000000/vite.png" width="40" />
          <br /><strong>Vite</strong>
        </td>
        <td align="center" width="120">
          <img src="https://img.icons8.com/color/96/000000/tailwind_css.png" width="40" />
          <br /><strong>Tailwind</strong>
        </td>
        <td align="center" width="120">
          <img src="https://img.icons8.com/color/96/000000/javascript--v1.png" width="40" />
          <br /><strong>JavaScript</strong>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<details>
<summary><strong>📚 Complete Tech Stack</strong></summary>

| Layer        | Tools / Libraries                      |
|--------------|-----------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS            |
| Routing      | React Router DOM                        |
| State        | React Hooks (`useState`, `useEffect`)   |
| API Client   | Axios / Fetch                           |
| Voice Input  | Web Speech API                          |
| Voice Output | SpeechSynthesis API (TTS)               |
| Weather      | OpenWeather API                         |
| Location     | Geolocation API                         |
| Traffic      | Google Maps Directions API              |
| Calendar     | Google Calendar API                     |
| Deployment   | Vercel                                   |

</details>

---

## 📁 Folder Structure

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/folder-tree.png" width="80" />
</div>

```
yunia-ai/
├── docs/ # 📚 Documentation files
│   ├── flowchart.drawio # System flow diagram
│   ├── wireframe.png # UI layout plan
│   ├── module-list.md # Feature list & scope
│   ├── pseudocode.md # Logic plan before coding
│   ├── api-plan.md # API endpoint reference
│   └── dev-notes.md # Daily notes & progress
│
├── public/ # 🔓 HTML & static assets
│   └── index.html
│
├── src/ # 💻 React frontend
│   ├── assets/ # Icons, images, audio
│   ├── components/ # UI modules (ChatBox, HabitList, etc.)
│   ├── pages/ # Route-based views (Dashboard, Plan)
│   ├── layout/ # Sidebar, Header, layout shell
│   ├── services/ # API logic (weather, traffic, calendar)
│   ├── hooks/ # Custom hooks (useAuth, useTTS, etc.)
│   ├── context/ # Global context (AuthContext, AssistantContext)
│   ├── utils/ # Prompt builders, helpers
│   ├── styles/ # Tailwind & global styles
│   ├── App.jsx # App root
│   └── main.jsx # Entry point
│
├── db.json # 🔧 Mock data for development
├── vercel.json # ⚙️ Deployment configuration
├── README.md # 📘 This file
├── .gitignore # Git ignore rules
├── package.json # Project metadata & dependencies
├── vite.config.js # Vite bundler config
└── tailwind.config.js # Tailwind setup
```

---

## 📄 Documentation

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/document.png" width="60" />
  <br />
  <strong>All documentation is stored in the `/docs` folder:</strong>
</div>

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/workflow.png" />
        <br /><strong>flowchart.drawio</strong>
        <br />System flow
      </td>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/wireframe.png" />
        <br /><strong>wireframe.png</strong>
        <br />Screen layout plan
      </td>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/module.png" />
        <br /><strong>module-list.md</strong>
        <br />Frontend modules to build
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/source-code.png" />
        <br /><strong>pseudocode.md</strong>
        <br />Feature logic design
      </td>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/api.png" />
        <br /><strong>api-plan.md</strong>
        <br />Mock + real API endpoints
      </td>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/notepad.png" />
        <br /><strong>dev-notes.md</strong>
        <br />Developer progress log
      </td>
    </tr>
  </table>
</div>

---

## 📅 Development Timeline

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/timeline.png" width="80" />
</div>

| Day | Focus | Progress |
|-----|-------|----------|
| **1–2** | Planning: flowchart, wireframe, pseudocode | 📋 |
| **3–6** | Auth, Layout, Chat, Voice | 🔐 |
| **7–10** | Habit, Reminder, Weather, Memory | 📝 |
| **11–12** | Traffic, Google Calendar, Plan | 🚗 |
| **13** | Autopilot AI Briefing | 🤖 |
| **14** | UI Polish, Deployment, Final Docs | 🚀 |

---

## 📢 Acknowledgement

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/graduation-cap.png" width="60" />
  <br />
  <strong>This project is built as part of the</strong>
  <br />
  <strong>Adnexio Full-Stack Bootcamp (Frontend Phase – May 2025)</strong>
  <br />
  <em>by Muhammad Azizi bin Zaidi</em>
</div>

---

## 🌐 Live Demo

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/rocket.png" width="60" />
  <br />
  <strong>**Coming Soon:** Will be deployed to Vercel</strong>
</div>

---

<div align="center">
  <sub>Made with ❤️ by Muhammad Azizi bin Zaidi</sub>
  <br />
  <sub>© 2025 Yunia AI. All rights reserved.</sub>
</div>
