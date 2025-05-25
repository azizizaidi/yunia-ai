# Yunia AI - Project Structure

## 📁 Organized File Structure

This document outlines the reorganized and improved file structure for better maintainability and easier navigation.

### 🗂️ Pages Organization

```
src/pages/
├── index.js                 # Main export file for all pages
├── ComingSoonPages.jsx      # Coming soon placeholder pages
├── auth/                    # Authentication pages
│   ├── index.js            # Auth pages exports
│   ├── Login.jsx           # User login page
│   └── Register.jsx        # User registration page
├── admin/                   # Admin-specific pages
│   ├── index.js            # Admin pages exports
│   ├── AdminLogin.jsx      # Admin login page
│   └── AdminDashboard.jsx  # Admin dashboard
└── dashboard/               # User dashboard pages
    ├── index.js            # Dashboard pages exports
    ├── Dashboard.jsx       # Main dashboard (AI Chat)
    ├── MemoryManager.jsx   # AI memory management
    ├── ReminderPanel.jsx   # Smart reminders
    ├── HabitTracker.jsx    # Habit tracking
    ├── DailyBriefings.jsx  # Daily AI briefings
    └── Subscription.jsx    # Subscription management
```

### 🧩 Components Organization

```
src/components/
├── index.js                 # Main export file for all components
├── auth/                    # Authentication components
│   ├── index.js            # Auth components exports
│   ├── ProtectedRoute.jsx  # Route protection
│   └── PublicRoute.jsx     # Public route handling
├── chat/                    # Chat-related components
│   ├── index.js            # Chat components exports
│   ├── ChatDashboard.jsx   # Main chat interface
│   ├── ChatHistory.jsx     # Chat history display
│   ├── ChatInterface.jsx   # Chat input/output
│   ├── ChatMessage.jsx     # Individual message
│   └── VoiceInput.jsx      # Voice input handling
├── dashboard/               # Dashboard components
│   ├── index.js            # Dashboard components exports
│   ├── Footer.jsx          # Dashboard footer
│   ├── Header.jsx          # Dashboard header
│   ├── NotificationList.jsx # Notifications display
│   ├── ReminderList.jsx    # Reminders display
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── TaskList.jsx        # Tasks display
│   └── UserProfile.jsx     # User profile component
├── ui/                      # Reusable UI components
│   ├── index.js            # UI components exports
│   ├── Button.jsx          # Custom button component
│   ├── Card.jsx            # Card wrapper component
│   ├── ComingSoon.jsx      # Coming soon placeholder
│   ├── ErrorMessage.jsx    # Error display component
│   ├── Input.jsx           # Custom input component
│   └── Loader.jsx          # Loading spinner
└── ai/                      # AI-specific components
    ├── index.js            # AI components exports
    └── YuniaPersonalityDemo.jsx # AI personality demo
```

### 🏗️ Layout Organization

```
src/layout/
├── index.js                 # Layout exports
├── AuthLayout.jsx          # Authentication pages layout
└── DashboardLayout.jsx     # Dashboard pages layout
```

## 📦 Import Examples

### Using the new organized structure:

```javascript
// Pages imports
import { Login, Register } from './pages/auth';
import { AdminLogin, AdminDashboard } from './pages/admin';
import { Dashboard, MemoryManager, HabitTracker } from './pages/dashboard';

// Components imports
import { ProtectedRoute, PublicRoute } from './components/auth';
import { ChatDashboard, ChatInterface } from './components/chat';
import { Button, Card, Loader } from './components/ui';
import { Sidebar, Header, Footer } from './components/dashboard';

// Layout imports
import { AuthLayout, DashboardLayout } from './layout';
```

## ✅ Benefits of This Organization

1. **Clear Separation**: Pages are organized by functionality (auth, admin, dashboard)
2. **Easy Navigation**: Related files are grouped together
3. **Scalable Structure**: Easy to add new features in appropriate folders
4. **Clean Imports**: Index files provide clean import statements
5. **Maintainable**: Easier to find and modify specific functionality
6. **Type Safety**: Better organization supports TypeScript migration
7. **Team Collaboration**: Clear structure for multiple developers

## 🔄 Migration Notes

- All import paths have been updated to reflect the new structure
- Index files provide convenient exports for each folder
- No functionality has been changed, only organization
- All existing routes and functionality remain intact

## 📋 Folder Conventions

- **auth/**: Authentication-related pages and components
- **admin/**: Admin-specific functionality
- **dashboard/**: User dashboard features
- **ui/**: Reusable UI components
- **chat/**: Chat and AI interaction components
- **layout/**: Page layout templates

This structure follows React best practices and makes the codebase more professional and maintainable.
