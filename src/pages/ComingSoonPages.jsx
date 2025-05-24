import DashboardLayout from "../layout/DashboardLayout";
import ComingSoon from "../components/ui/ComingSoon";

// Chat History Page
export const ChatHistory = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Chat History</h1>
        <p className="text-base-content/70">
          View and manage your conversation history with Yunia AI
        </p>
      </div>
      <ComingSoon
        title="Chat History Coming Soon"
        description="Access and manage all your conversations with Yunia AI:"
        icon="history"
        features={[
          { text: "Search through conversation history" },
          { text: "Export chat conversations" },
          { text: "Organize chats by topics" },
          { text: "Bookmark important conversations" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Task Manager Page
export const TaskManager = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
        <p className="text-base-content/70">
          AI-powered task management with smart prioritization and scheduling
        </p>
      </div>
      <ComingSoon
        title="Smart Task Manager Coming Soon"
        description="Our AI-powered task management system will help you stay organized and productive:"
        icon="task_alt"
        features={[
          { text: "AI-powered task prioritization" },
          { text: "Smart deadline suggestions" },
          { text: "Automatic task categorization" },
          { text: "Progress tracking & insights" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Google Calendar Integration Page
export const GoogleCalendar = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Google Calendar</h1>
        <p className="text-base-content/70">
          Seamless integration with your Google Calendar for smart scheduling
        </p>
      </div>
      <ComingSoon
        title="Google Calendar Integration Coming Soon"
        description="Connect your Google Calendar for enhanced productivity features:"
        icon="calendar_today"
        features={[
          { text: "Two-way calendar sync" },
          { text: "AI meeting scheduling" },
          { text: "Smart conflict detection" },
          { text: "Automated reminders" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Live Data Page
export const LiveData = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Live Data</h1>
        <p className="text-base-content/70">
          Real-time data monitoring and insights for your daily life
        </p>
      </div>
      <ComingSoon
        title="Live Data Dashboard Coming Soon"
        description="Monitor real-time data that matters to you:"
        icon="sensors"
        features={[
          { text: "Real-time weather updates" },
          { text: "Traffic & transportation data" },
          { text: "News & market updates" },
          { text: "Personal metrics tracking" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Weather & Traffic Page
export const WeatherTraffic = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Weather & Traffic</h1>
        <p className="text-base-content/70">
          Smart weather and traffic insights for better planning
        </p>
      </div>
      <ComingSoon
        title="Weather & Traffic Intelligence Coming Soon"
        description="Get intelligent weather and traffic insights:"
        icon="cloud"
        features={[
          { text: "Hyperlocal weather forecasts" },
          { text: "Real-time traffic updates" },
          { text: "Route optimization" },
          { text: "Weather-based recommendations" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// GPS Tracking Page
export const GPSTracking = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">GPS Tracking</h1>
        <p className="text-base-content/70">
          Smart location tracking for enhanced personal assistance
        </p>
      </div>
      <ComingSoon
        title="GPS Tracking Coming Soon"
        description="Location-aware features for better assistance:"
        icon="location_on"
        features={[
          { text: "Location-based reminders" },
          { text: "Travel time predictions" },
          { text: "Geofenced notifications" },
          { text: "Location history insights" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Memory Storage Page
export const MemoryStorage = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Memory Storage</h1>
        <p className="text-base-content/70">
          AI-powered memory system that remembers what matters to you
        </p>
      </div>
      <ComingSoon
        title="AI Memory Storage Coming Soon"
        description="Your AI assistant will remember and learn from your interactions:"
        icon="psychology"
        features={[
          { text: "Conversation memory" },
          { text: "Personal preferences learning" },
          { text: "Context-aware responses" },
          { text: "Long-term relationship building" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Daily Schedule Page
export const DailySchedule = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Daily Schedule</h1>
        <p className="text-base-content/70">
          AI-optimized daily scheduling for maximum productivity
        </p>
      </div>
      <ComingSoon
        title="Smart Daily Schedule Coming Soon"
        description="Let AI optimize your daily schedule:"
        icon="schedule"
        features={[
          { text: "AI-optimized time blocks" },
          { text: "Energy level consideration" },
          { text: "Automatic buffer time" },
          { text: "Productivity insights" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Wake-up Assistant Page
export const WakeupAssistant = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Wake-up Assistant</h1>
        <p className="text-base-content/70">
          Intelligent wake-up system that adapts to your sleep patterns
        </p>
      </div>
      <ComingSoon
        title="Smart Wake-up Assistant Coming Soon"
        description="Wake up refreshed with AI-powered sleep optimization:"
        icon="alarm"
        features={[
          { text: "Sleep cycle optimization" },
          { text: "Weather-based wake times" },
          { text: "Personalized morning briefings" },
          { text: "Gentle wake-up sequences" }
        ]}
      />
    </div>
  </DashboardLayout>
);

// Analytics Page
export const Analytics = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-base-content/70">
          Comprehensive insights into your productivity and habits
        </p>
      </div>
      <ComingSoon
        title="Advanced Analytics Coming Soon"
        description="Get deep insights into your productivity patterns:"
        icon="analytics"
        features={[
          { text: "Productivity trends" },
          { text: "Habit formation tracking" },
          { text: "Goal achievement metrics" },
          { text: "Personalized recommendations" }
        ]}
      />
    </div>
  </DashboardLayout>
);


