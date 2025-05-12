# Yunia AI – Smart Personal Assistant Dashboard (Frontend)

<div align="center">
  <img src="https://github.com/user-attachments/assets/placeholder-logo" alt="Yunia AI Logo" width="120" height="120" />
  
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
