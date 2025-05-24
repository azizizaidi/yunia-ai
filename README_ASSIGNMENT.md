# Yunia AI - Personal Assistant Dashboard

## 🎯 Project Overview

**Domain Selected:** Personal Assistant SaaS Platform  
**Project Type:** Frontend Dashboard for AI-powered Personal Assistant

Yunia AI is a comprehensive personal assistant dashboard that helps users manage their daily tasks, reminders, and AI interactions. The platform serves as a central hub for productivity management with intelligent AI-generated suggestions and real-time assistance.

## ✨ Features Implemented

### 📋 Core Requirements (All Completed)

#### 1. **User Profile Panel** ✅
- Displays user name, email, and role information
- Logout functionality with confirmation modal
- Clean, professional profile display
- **API Integration:** Fetches user data from localStorage/API

#### 2. **Task/Item Overview Section** ✅
- Dynamic task list with AI-generated and manual tasks
- Status indicators: `completed`, `in-progress`, `pending`
- Priority levels: `high`, `medium`, `low`
- Category-based organization: health, work, personal, errands, learning, home
- AI-generated task indicators
- Due date tracking
- **API Integration:** Fetches from `/data/tasks.json`

#### 3. **Notifications/Reminders** ✅
- Real-time notification system in header
- Smart reminders with AI-generated suggestions
- Type-based categorization: health, work, planning
- Recurring reminder support
- Time-based scheduling
- **API Integration:** Fetches from `/data/notifications.json` and `/data/reminders.json`

#### 4. **Navigation & Layout** ✅
- Responsive sidebar navigation with collapsible design
- Clean dashboard layout with card-based components
- Mobile-responsive design using DaisyUI
- Sticky header with notification dropdown
- Professional color scheme and typography

#### 5. **API Integration** ✅
- Centralized API service in `src/services/api.js`
- Proper loading states with spinners
- Comprehensive error handling
- Mock data served from JSON files
- State management with React hooks

## 🏗️ Technical Architecture

### **Tech Stack**
- **Frontend:** React 18 with functional components and hooks
- **UI Library:** DaisyUI + Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** useState, useEffect, custom hooks
- **API Client:** Native Fetch API
- **Mock Data:** JSON files in `/public/data/`

### **Project Structure**
```
src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── UserProfile.jsx
│   │   ├── TaskList.jsx
│   │   ├── NotificationList.jsx
│   │   ├── ReminderList.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── auth/              # Authentication components
│   ├── chat/              # AI chat components
│   └── ui/                # Reusable UI components
├── pages/
│   └── Dashboard.jsx      # Main dashboard page
├── services/
│   └── api.js            # Centralized API service
├── hooks/
│   └── useAuth.js        # Authentication hook
└── layout/
    └── DashboardLayout.jsx # Layout wrapper
```

## 🎨 Domain-Specific Features

### **Personal Assistant Context**
- **AI-Generated Tasks:** Tasks created by Yunia AI based on user patterns
- **Smart Reminders:** Intelligent scheduling based on user behavior
- **Health Tracking:** Vitamin reminders, workout schedules
- **Work Management:** Meeting reminders, project deadlines
- **Personal Care:** Family calls, personal appointments
- **Learning Goals:** Language practice, skill development

### **SaaS Elements**
- Usage tracking and limits
- Subscription tier indicators
- AI interaction statistics
- Real-time status monitoring

## 📊 Mock Data Examples

### Tasks
- Morning workout routines (AI-generated)
- Work project reviews
- Personal family calls
- Grocery shopping with AI lists
- Health appointments (AI-detected)

### Reminders
- Daily vitamin intake
- Team meeting notifications
- Hydration reminders
- Schedule planning sessions

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/azizizaidi/yunia-ai.git

# Navigate to project directory
cd yunia-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your API keys (optional for basic functionality)
3. The dashboard works with mock data by default

## 🔧 API Endpoints

### Mock Data Sources
- `GET /data/tasks.json` - User tasks and to-dos
- `GET /data/reminders.json` - Smart reminders
- `GET /data/user.json` - User profile data
- `GET /data/notifications.json` - System notifications

### Error Handling
- Loading states for all API calls
- User-friendly error messages
- Graceful fallbacks for failed requests
- Retry mechanisms for network issues

## 📱 Responsive Design

- **Desktop:** Full sidebar with detailed information
- **Tablet:** Collapsible sidebar with optimized layout
- **Mobile:** Hidden sidebar with hamburger menu
- **Touch-friendly:** Large buttons and touch targets

## 🎯 Future Enhancements (SaaS Roadmap)

### Phase 1: Core MVP
- ✅ Dashboard with tasks and reminders
- ✅ User authentication
- ✅ Basic AI integration

### Phase 2: Advanced Features
- Real-time GPS tracking
- Weather integration
- Calendar synchronization
- Voice commands

### Phase 3: SaaS Platform
- Multi-user support
- Subscription management
- Advanced analytics
- Team collaboration

## 📸 Screenshots

### Dashboard Overview
![Dashboard](./screenshots/dashboard.png)

### Task Management
![Tasks](./screenshots/tasks.png)

### Notifications
![Notifications](./screenshots/notifications.png)

## 🔗 Live Demo

**Deployment:** [https://yunia-ai.vercel.app](https://yunia-ai.vercel.app)

### Test Credentials
- **User Login:** user@example.com / password123
- **Admin Login:** admin@example.com / admin123

## 👨‍💻 Developer

**Name:** Azizi Zaidi  
**Email:** azizikuis@gmail.com  
**GitHub:** [@azizizaidi](https://github.com/azizizaidi)

---

*This project demonstrates a complete frontend dashboard implementation with proper component architecture, API integration, and responsive design suitable for a commercial SaaS platform.*
