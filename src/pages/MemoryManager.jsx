import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getMemoryStatistics,
  getConversations,
  getUserReminders,
  getUserPreferences,
  saveConversation,
  saveReminder,
  saveUserPreference,
  saveEnvironmentalData,
  updateReminderStatus,
  exportMemoryData,
  clearAllUserMemory
} from "../services/api";
import Loader from "../components/ui/Loader";

/**
 * Memory Manager - Manage actual user memory data
 */
const MemoryManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [memoryStats, setMemoryStats] = useState({});
  const [conversations, setConversations] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [preferences, setPreferences] = useState({});

  // Form states
  const [newConversation, setNewConversation] = useState({ title: '', content: '', aiType: 'gemini' });
  const [newReminder, setNewReminder] = useState({ title: '', time: '', note: '', type: 'personal' });
  const [newPreference, setNewPreference] = useState({ key: '', value: '' });

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, convs, rems, prefs] = await Promise.all([
        getMemoryStatistics(),
        getConversations(),
        getUserReminders(),
        getUserPreferences()
      ]);

      setMemoryStats(stats);
      setConversations(convs);
      setReminders(rems);
      setPreferences(prefs);
    } catch (err) {
      setError('Failed to load memory data');
      console.error('Error loading memory data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConversation = async (e) => {
    e.preventDefault();
    try {
      await saveConversation({
        title: newConversation.title,
        content: newConversation.content,
        aiType: newConversation.aiType,
        type: 'user_created'
      });

      setNewConversation({ title: '', content: '', aiType: 'gemini' });
      await loadMemoryData();
    } catch (err) {
      setError('Failed to save conversation');
    }
  };

  const handleSaveReminder = async (e) => {
    e.preventDefault();
    try {
      await saveReminder({
        title: newReminder.title,
        time: newReminder.time,
        note: newReminder.note,
        type: newReminder.type
      });

      setNewReminder({ title: '', time: '', note: '', type: 'personal' });
      await loadMemoryData();
    } catch (err) {
      setError('Failed to save reminder');
    }
  };

  const handleSavePreference = async (e) => {
    e.preventDefault();
    try {
      await saveUserPreference(newPreference.key, newPreference.value);
      setNewPreference({ key: '', value: '' });
      await loadMemoryData();
    } catch (err) {
      setError('Failed to save preference');
    }
  };

  const handleUpdateReminderStatus = async (reminderId, status) => {
    try {
      await updateReminderStatus(reminderId, status);
      await loadMemoryData();
    } catch (err) {
      setError('Failed to update reminder');
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = await exportMemoryData();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yunia-memory-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const handleClearAllMemory = async () => {
    if (window.confirm('Are you sure you want to clear all memory data? This action cannot be undone.')) {
      try {
        await clearAllUserMemory();
        await loadMemoryData();
      } catch (err) {
        setError('Failed to clear memory');
      }
    }
  };

  const handleAddSampleEnvironmentalData = async () => {
    try {
      await saveEnvironmentalData({
        weather: {
          temperature: 28,
          condition: 'sunny',
          humidity: 65,
          location: 'Kuala Lumpur'
        },
        location: {
          city: 'Kuala Lumpur',
          country: 'Malaysia',
          coordinates: { lat: 3.139, lng: 101.6869 }
        },
        traffic: {
          status: 'moderate',
          estimatedDelay: '15 minutes',
          route: 'Main route to office'
        }
      });
      await loadMemoryData();
    } catch (err) {
      setError('Failed to save environmental data');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">🧠 Memory Manager</h1>
          <p className="text-base-content/70">
            Manage your Yunia AI memory data with real persistence
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span className="material-icons">error</span>
            <span>{error}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed justify-center mb-6">
          {[
            { id: 'overview', label: '📊 Overview', icon: 'dashboard' },
            { id: 'conversations', label: '💬 Conversations', icon: 'chat' },
            { id: 'reminders', label: '⏰ Reminders', icon: 'alarm' },
            { id: 'preferences', label: '⚙️ Preferences', icon: 'settings' },
            { id: 'tools', label: '🛠️ Tools', icon: 'build' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="material-icons mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Memory Statistics */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">📊 Memory Statistics</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Conversations:</span>
                    <span className="font-bold">{memoryStats.totalConversations || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Reminders:</span>
                    <span className="font-bold text-warning">{memoryStats.activeReminders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Reminders:</span>
                    <span className="font-bold text-success">{memoryStats.completedReminders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Preferences:</span>
                    <span className="font-bold">{memoryStats.totalPreferences || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Memory Items:</span>
                    <span className="font-bold text-primary">{memoryStats.totalMemoryItems || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">⚡ Quick Actions</h2>
                <div className="space-y-2">
                  <button
                    className="btn btn-primary btn-sm w-full"
                    onClick={handleAddSampleEnvironmentalData}
                  >
                    🌤️ Add Sample Weather Data
                  </button>
                  <button
                    className="btn btn-secondary btn-sm w-full"
                    onClick={handleExportData}
                  >
                    📤 Export All Data
                  </button>
                  <button
                    className="btn btn-error btn-sm w-full"
                    onClick={handleClearAllMemory}
                  >
                    🗑️ Clear All Memory
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🕒 Recent Activity</h2>
                <div className="space-y-2">
                  {conversations.slice(-3).map(conv => (
                    <div key={conv.id} className="text-sm">
                      <div className="font-medium truncate">{conv.title}</div>
                      <div className="text-xs text-base-content/60">
                        {new Date(conv.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <p className="text-sm text-base-content/60">No recent conversations</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Conversation */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">➕ Add New Conversation</h2>
                <form onSubmit={handleSaveConversation} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={newConversation.title}
                      onChange={(e) => setNewConversation({...newConversation, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Content</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      rows="3"
                      value={newConversation.content}
                      onChange={(e) => setNewConversation({...newConversation, content: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">AI Type</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={newConversation.aiType}
                      onChange={(e) => setNewConversation({...newConversation, aiType: e.target.value})}
                    >
                      <option value="gemini">Yunia (Text)</option>
                      <option value="rime">Yunia (Voice)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    💾 Save Conversation
                  </button>
                </form>
              </div>
            </div>

            {/* Conversations List */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">💬 Recent Conversations ({conversations.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversations.slice(-10).reverse().map(conv => (
                    <div key={conv.id} className="border border-base-300 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{conv.title}</h3>
                        <span className="badge badge-sm">
                          {conv.aiType === 'gemini' ? '💬 Text' : '🎤 Voice'}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/70 mb-2">{conv.content}</p>
                      <div className="text-xs text-base-content/50">
                        {new Date(conv.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <p className="text-center text-base-content/60">No conversations yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Reminder */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">➕ Add New Reminder</h2>
                <form onSubmit={handleSaveReminder} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Note</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      rows="2"
                      value={newReminder.note}
                      onChange={(e) => setNewReminder({...newReminder, note: e.target.value})}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Type</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={newReminder.type}
                      onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    ⏰ Save Reminder
                  </button>
                </form>
              </div>
            </div>

            {/* Reminders List */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">⏰ Your Reminders ({reminders.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reminders.map(reminder => (
                    <div key={reminder.id} className="border border-base-300 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{reminder.title}</h3>
                        <div className="flex gap-2">
                          <span className={`badge badge-sm ${
                            reminder.status === 'active' ? 'badge-warning' :
                            reminder.status === 'completed' ? 'badge-success' : 'badge-error'
                          }`}>
                            {reminder.status}
                          </span>
                          <span className="badge badge-sm badge-outline">{reminder.type}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono">{reminder.time}</span>
                        <div className="flex gap-1">
                          {reminder.status === 'active' && (
                            <>
                              <button
                                className="btn btn-xs btn-success"
                                onClick={() => handleUpdateReminderStatus(reminder.id, 'completed')}
                              >
                                ✓
                              </button>
                              <button
                                className="btn btn-xs btn-error"
                                onClick={() => handleUpdateReminderStatus(reminder.id, 'cancelled')}
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {reminder.note && (
                        <p className="text-sm text-base-content/70 mb-2">{reminder.note}</p>
                      )}
                      <div className="text-xs text-base-content/50">
                        Created: {new Date(reminder.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {reminders.length === 0 && (
                    <p className="text-center text-base-content/60">No reminders yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Preference */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">➕ Add New Preference</h2>
                <form onSubmit={handleSavePreference} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Preference Key</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="e.g., theme, language, notifications"
                      value={newPreference.key}
                      onChange={(e) => setNewPreference({...newPreference, key: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Value</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="e.g., dark, english, enabled"
                      value={newPreference.value}
                      onChange={(e) => setNewPreference({...newPreference, value: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    ⚙️ Save Preference
                  </button>
                </form>
              </div>
            </div>

            {/* Preferences List */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">⚙️ Your Preferences ({Object.keys(preferences).length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="border border-base-300 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{key}</h3>
                          <p className="text-sm text-base-content/70">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        </div>
                        <span className="badge badge-outline">
                          {typeof value}
                        </span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(preferences).length === 0 && (
                    <p className="text-center text-base-content/60">No preferences set yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Management */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🛠️ Data Management</h2>
                <div className="space-y-4">
                  <button
                    className="btn btn-info w-full"
                    onClick={handleExportData}
                  >
                    📤 Export All Memory Data
                  </button>
                  <button
                    className="btn btn-warning w-full"
                    onClick={() => loadMemoryData()}
                  >
                    🔄 Refresh All Data
                  </button>
                  <button
                    className="btn btn-error w-full"
                    onClick={handleClearAllMemory}
                  >
                    🗑️ Clear All Memory Data
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Data */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">📝 Sample Data</h2>
                <div className="space-y-4">
                  <button
                    className="btn btn-secondary w-full"
                    onClick={handleAddSampleEnvironmentalData}
                  >
                    🌤️ Add Sample Weather Data
                  </button>
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() => {
                      setNewConversation({
                        title: 'Sample Conversation',
                        content: 'This is a sample conversation with Yunia AI about the weather.',
                        aiType: 'gemini'
                      });
                      setActiveTab('conversations');
                    }}
                  >
                    💬 Create Sample Conversation
                  </button>
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() => {
                      setNewReminder({
                        title: 'Sample Reminder',
                        time: '14:00',
                        note: 'This is a sample reminder created by the memory manager.',
                        type: 'personal'
                      });
                      setActiveTab('reminders');
                    }}
                  >
                    ⏰ Create Sample Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemoryManager;
