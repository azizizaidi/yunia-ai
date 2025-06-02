# Yunia AI - Personal Assistant Monorepo

Yunia AI is a comprehensive personal assistant application designed to help users manage their daily tasks, habits, and productivity. This monorepo contains both the Next.js frontend and Laravel backend, providing a complete full-stack solution.

## 🏗️ Architecture

This project follows a **monorepo structure** with separate frontend and backend applications:

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and DaisyUI
- **Backend**: Laravel 12 with PHP, providing REST API endpoints
- **Database**: SQLite (development) / PostgreSQL (production)
- **Deployment**: Separate deployment for frontend and backend

## 📁 Project Structure

```
yunia-ai/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Laravel Backend Application
│   ├── app/                 # Laravel application code
│   ├── database/            # Migrations and seeders
│   ├── routes/              # API routes
│   └── composer.json        # Backend dependencies
├── docs/                    # Documentation
├── package.json             # Root workspace configuration
└── README.md               # This file
```

## 🌟 Features

### Core Features
- **AI Chat Interface**: Intelligent conversation with memory retention
- **Voice Input**: RimeAI integration for voice-to-text functionality
- **Habit Tracker**: Track and monitor daily habits with visual progress
- **Memory Manager**: Store and organize personal information and preferences
- **Daily Briefings**: Personalized daily summaries and insights
- **Reminder Panel**: Smart reminder system with notifications
- **Google Calendar Integration**: Seamless calendar management
- **Live Data Dashboard**: Real-time data visualization

### Authentication & User Management
- **Dual Authentication System**: Separate login for users and admins
- **Role-based Access Control**: Different dashboards for different user types
- **Secure Registration**: User registration without Terms of Service requirement
- **JWT Authentication**: Secure API authentication with Laravel Sanctum

### Subscription & Payments
- **Tiered Subscription Plans**: Multiple subscription levels without unlimited tiers
- **Stripe Integration**: Secure payment processing with test environment
- **Subscription Management**: Cancel subscriptions with deferred termination
- **Data Retention Options**: Extended data retention beyond standard limits

## 🛠️ Technology Stack

### Frontend (Next.js)
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind CSS
- **Chart.js**: Data visualization with react-chartjs-2
- **Stripe**: Payment processing integration

### Backend (Laravel)
- **Laravel 12**: PHP framework for web applications
- **Laravel Sanctum**: API authentication
- **Eloquent ORM**: Database abstraction layer
- **SQLite/PostgreSQL**: Database options
- **Laravel Pail**: Real-time log monitoring

### Development Tools
- **ESLint**: Code linting and formatting
- **Concurrently**: Run multiple commands simultaneously
- **Composer**: PHP dependency management
- **NPM Workspaces**: Monorepo package management

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PHP** (v8.2 or higher)
- **Composer** (latest version)
- **npm** (v8 or higher)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/azizizaidi/yunia-ai.git
   cd yunia-ai
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup backend environment**
   ```bash
   npm run setup:backend
   ```

4. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

5. **Access the applications**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

### Manual Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## 📜 Available Scripts

### Root Level Scripts
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies
- `npm run setup` - Complete setup including backend
- `npm run clean` - Remove all node_modules and vendor folders

### Frontend Scripts
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
cd backend
php artisan serve    # Start development server
php artisan migrate  # Run database migrations
php artisan test     # Run tests
composer install     # Install dependencies
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Backend (.env)
```env
# Database Configuration
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# API Configuration
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Stripe Configuration
STRIPE_KEY=your_stripe_secret_key_here
STRIPE_SECRET=your_stripe_secret_key_here
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend Deployment (Laravel)
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📝 API Documentation

The Laravel backend provides RESTful API endpoints for:
- User authentication and management
- AI chat conversations
- Habit tracking
- Memory management
- Subscription handling
- Payment processing

API documentation will be available at `http://localhost:8000/api/documentation` when the backend is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Yunia AI** - Your intelligent personal assistant for enhanced productivity and organization.
