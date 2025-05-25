import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  getMemoryStatistics,
  getConversations,
  getConversationsByTopic,
  getConversationTopicStats,
  scanAndRemoveDuplicates,
  findSimilarConversations,
  getUserPreferences,
  saveUserPreference,
  exportMemoryData,
  clearAllUserMemory,
  getAIMemory,
  getSharedMemory
} from "../../services/api";
import Loader from "../../components/ui/Loader";

/**
 * Memory Manager - AI Memory Storage System
 * Manages how Yunia AI learns and remembers user information
 */
const MemoryManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [memoryStats, setMemoryStats] = useState({});
  const [conversations, setConversations] = useState([]);
  const [conversationsByTopic, setConversationsByTopic] = useState({});
  const [conversationStats, setConversationStats] = useState({});
  const [preferences, setPreferences] = useState({});
  const [geminiMemory, setGeminiMemory] = useState([]);
  const [rimeMemory, setRimeMemory] = useState([]);
  const [sharedMemory, setSharedMemory] = useState({});

  // Form states
  const [newPreference, setNewPreference] = useState({ key: '', value: '' });
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Duplicate scanning states
  const [duplicateReport, setDuplicateReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [similarConversations, setSimilarConversations] = useState([]);

  useEffect(() => {
    loadMemoryData();
  }, []);

  // Auto-refresh memory data every 10 seconds when on conversations tab
  useEffect(() => {
    let interval;
    if (activeTab === 'conversations') {
      interval = setInterval(() => {
        loadMemoryData();
      }, 10000); // Refresh every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const loadMemoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, convs, convsByTopic, convStats, prefs, geminiMem, rimeMem, sharedMem] = await Promise.all([
        getMemoryStatistics(),
        getConversations(),
        getConversationsByTopic(),
        getConversationTopicStats(),
        getUserPreferences(),
        Promise.resolve(getAIMemory('gemini')),
        Promise.resolve(getAIMemory('rime')),
        Promise.resolve(getSharedMemory())
      ]);

      setMemoryStats(stats);
      setConversations(convs);
      setConversationsByTopic(convsByTopic);
      setConversationStats(convStats);
      setPreferences(prefs);
      setGeminiMemory(geminiMem);
      setRimeMemory(rimeMem);
      setSharedMemory(sharedMem);
    } catch (err) {
      setError('Failed to load memory data');
      console.error('Error loading memory data:', err);
    } finally {
      setLoading(false);
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



  const handleExportData = async () => {
    try {
      const exportData = await exportMemoryData();
      // Include AI memory data in export
      exportData.geminiMemory = geminiMemory;
      exportData.rimeMemory = rimeMemory;
      exportData.sharedMemory = sharedMemory;

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yunia-memory-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const handleClearAllMemory = async () => {
    if (window.confirm('Are you sure you want to clear all AI memory data? This action cannot be undone.')) {
      try {
        await clearAllUserMemory();
        localStorage.removeItem('yunia-ai-memory');
        await loadMemoryData();
      } catch (err) {
        setError('Failed to clear memory');
      }
    }
  };

  const handleScanDuplicates = async () => {
    try {
      setIsScanning(true);
      setError(null);

      console.log('🔍 Starting duplicate scan...');
      const report = await scanAndRemoveDuplicates();
      setDuplicateReport(report);

      // Also find similar conversations
      const similar = await findSimilarConversations();
      setSimilarConversations(similar);

      // Reload data to reflect changes
      await loadMemoryData();

      console.log('✅ Duplicate scan completed:', report);
    } catch (err) {
      setError('Failed to scan for duplicates');
      console.error('Error scanning duplicates:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearDuplicateReport = () => {
    setDuplicateReport(null);
    setSimilarConversations([]);
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
            Manage how Yunia AI learns and remembers information about you
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
            { id: 'conversations', label: '💬 AI Conversations', icon: 'chat' },
            { id: 'learning', label: '🎯 AI Learning', icon: 'psychology' },
            { id: 'preferences', label: '⚙️ User Preferences', icon: 'settings' },
            { id: 'tools', label: '🛠️ Memory Tools', icon: 'build' }
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
            {/* AI Memory Statistics */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🧠 AI Memory Statistics</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Conversations:</span>
                    <span className="font-bold">{memoryStats.totalConversations || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Preferences:</span>
                    <span className="font-bold">{memoryStats.totalPreferences || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Memory Items:</span>
                    <span className="font-bold text-primary">{memoryStats.totalMemoryItems || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Categories:</span>
                    <span className="font-bold text-secondary">{(geminiMemory.length + rimeMemory.length) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Storage:</span>
                    <span className="font-bold text-accent">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Actions */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">⚡ Memory Actions</h2>
                <div className="space-y-2">
                  <button
                    className="btn btn-primary btn-sm w-full"
                    onClick={() => setActiveTab('learning')}
                  >
                    🎯 View AI Learning
                  </button>
                  <button
                    className="btn btn-secondary btn-sm w-full"
                    onClick={handleExportData}
                  >
                    📤 Export Memory Data
                  </button>
                  <button
                    className="btn btn-error btn-sm w-full"
                    onClick={handleClearAllMemory}
                  >
                    🗑️ Clear AI Memory
                  </button>
                </div>
              </div>
            </div>

            {/* AI Learning Status */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🤖 AI Learning Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Personal Info</span>
                    <div className="badge badge-success">Learning</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Preferences</span>
                    <div className="badge badge-success">Active</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversation Style</span>
                    <div className="badge badge-warning">Adapting</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Goals & Habits</span>
                    <div className="badge badge-info">Tracking</div>
                  </div>
                  <div className="text-xs text-base-content/60 mt-3">
                    Last updated: {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Enhanced Conversation Statistics */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">💬 Smart Conversation Management</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleScanDuplicates}
                      className={`btn btn-sm btn-primary ${isScanning ? 'loading' : ''}`}
                      disabled={isScanning}
                    >
                      {isScanning ? '🔍' : '🔍 Scan Duplicates'}
                    </button>
                    <button
                      onClick={loadMemoryData}
                      className="btn btn-sm btn-outline"
                      disabled={loading}
                    >
                      <span className="material-icons text-sm">refresh</span>
                      Refresh
                    </button>
                  </div>
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                  Yunia automatically saves conversations with duplicate detection and topic categorization
                </p>

                {/* Duplicate Scan Results */}
                {duplicateReport && (
                  <div className="alert alert-success mb-4">
                    <span className="material-icons">check_circle</span>
                    <div>
                      <h3 className="font-bold">✅ Duplicate Scan Complete!</h3>
                      <p className="text-sm">
                        Removed {duplicateReport.duplicatesRemoved} duplicate conversations.
                        {duplicateReport.uniqueConversations} unique conversations remaining.
                      </p>
                    </div>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={handleClearDuplicateReport}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Enhanced Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Total Conversations</div>
                    <div className="stat-value text-lg">{conversationStats.total || 0}</div>
                    <div className="stat-desc">Unique conversations</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Topics Discussed</div>
                    <div className="stat-value text-lg">{Object.keys(conversationsByTopic).length}</div>
                    <div className="stat-desc">Different categories</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Merged Conversations</div>
                    <div className="stat-value text-lg text-warning">{conversationStats.mergedConversations || 0}</div>
                    <div className="stat-desc">Duplicates prevented</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Text vs Voice</div>
                    <div className="stat-value text-lg">
                      {conversations.filter(c => c.aiType === 'gemini').length}:{conversations.filter(c => c.aiType === 'rime').length}
                    </div>
                    <div className="stat-desc">Gemini:Rime ratio</div>
                  </div>
                </div>

                {/* Topic Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    className={`btn btn-sm ${selectedTopic === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSelectedTopic('all')}
                  >
                    All Topics ({conversationStats.total || 0})
                  </button>
                  {Object.entries(conversationStats.byTopic || {}).map(([topic, stats]) => (
                    <button
                      key={topic}
                      className={`btn btn-sm ${selectedTopic === topic ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      {topic === 'income' && '💰'}
                      {topic === 'planner' && '📅'}
                      {topic === 'weather' && '🌤️'}
                      {topic === 'health' && '🏥'}
                      {topic === 'work' && '💼'}
                      {topic === 'personal' && '👤'}
                      {topic === 'general' && '💬'}
                      {topic.charAt(0).toUpperCase() + topic.slice(1)} ({stats.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversations by Topic */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  {selectedTopic === 'all' ? '🗂️ All Conversations' : `📂 ${selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)} Conversations`}
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(() => {
                    const conversationsToShow = selectedTopic === 'all'
                      ? conversations.slice(-15).reverse()
                      : (conversationsByTopic[selectedTopic] || []).slice(0, 15);

                    return conversationsToShow.map(conv => (
                      <div key={conv.id} className="border border-base-300 rounded-lg p-4 hover:bg-base-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-base">{conv.title || 'Chat Session'}</h3>
                          <div className="flex gap-2">
                            <span className="badge badge-sm">
                              {conv.aiType === 'gemini' ? '💬 Text' : '🎤 Voice'}
                            </span>
                            {conv.topic && (
                              <span className="badge badge-sm badge-info">
                                {conv.topic === 'income' && '💰'}
                                {conv.topic === 'planner' && '📅'}
                                {conv.topic === 'weather' && '🌤️'}
                                {conv.topic === 'health' && '🏥'}
                                {conv.topic === 'work' && '💼'}
                                {conv.topic === 'personal' && '👤'}
                                {conv.topic === 'general' && '💬'}
                                {conv.topic}
                              </span>
                            )}
                            {conv.type === 'auto_saved' && (
                              <span className="badge badge-sm badge-success">Auto</span>
                            )}
                            {(conv.updatedCount || 0) > 0 && (
                              <span className="badge badge-sm badge-warning">
                                Merged {conv.updatedCount}x
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                          {conv.content || conv.summary || 'Conversation auto-saved'}
                        </p>
                        <div className="flex justify-between items-center text-xs text-base-content/50">
                          <span>
                            {conv.messageCount ? `${conv.messageCount} messages` : 'Chat session'}
                          </span>
                          <span>
                            {new Date(conv.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}

                  {conversations.length === 0 && (
                    <div className="text-center text-base-content/60 py-12">
                      <span className="material-icons text-6xl mb-4 text-base-content/30">auto_awesome</span>
                      <h3 className="text-lg font-medium mb-2">Smart Auto-Save Active</h3>
                      <p className="mb-2">Yunia automatically saves conversations with duplicate detection</p>
                      <p className="text-xs">Start chatting and your conversations will appear here organized by topic</p>
                    </div>
                  )}

                  {selectedTopic !== 'all' && (!conversationsByTopic[selectedTopic] || conversationsByTopic[selectedTopic].length === 0) && (
                    <div className="text-center text-base-content/60 py-8">
                      <span className="material-icons text-4xl mb-2">topic</span>
                      <p>No conversations found for "{selectedTopic}" topic</p>
                      <p className="text-xs">Start a conversation about {selectedTopic} to see it here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Learning Tab */}
        {activeTab === 'learning' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Learning Categories */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🎯 AI Learning Categories</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  What Yunia is learning about you
                </p>
                <div className="space-y-3">
                  <div className="border border-base-300 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">👤 Personal Information</h3>
                      <span className="badge badge-success">Active</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Name, preferences, habits, and personal details
                    </p>
                  </div>

                  <div className="border border-base-300 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">💼 Work & Goals</h3>
                      <span className="badge badge-warning">Learning</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Career goals, work patterns, and professional preferences
                    </p>
                  </div>

                  <div className="border border-base-300 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">🗣️ Communication Style</h3>
                      <span className="badge badge-info">Adapting</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      How you prefer to communicate and receive information
                    </p>
                  </div>

                  <div className="border border-base-300 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">📍 Context & Environment</h3>
                      <span className="badge badge-secondary">Tracking</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Location patterns, schedule, and environmental preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Insights */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🧠 Memory Insights</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  What Yunia has learned about you recently
                </p>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="border border-base-300 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Communication Preference</h3>
                      <span className="badge badge-sm badge-info">Recent</span>
                    </div>
                    <p className="text-sm text-base-content/70 mb-2">
                      Prefers direct, concise communication style
                    </p>
                    <div className="text-xs text-base-content/50">
                      Learned: {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div className="border border-base-300 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Work Schedule</h3>
                      <span className="badge badge-sm badge-success">Confirmed</span>
                    </div>
                    <p className="text-sm text-base-content/70 mb-2">
                      Most active during morning hours (9 AM - 12 PM)
                    </p>
                    <div className="text-xs text-base-content/50">
                      Pattern identified: {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div className="border border-base-300 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Project Focus</h3>
                      <span className="badge badge-sm badge-warning">Learning</span>
                    </div>
                    <p className="text-sm text-base-content/70 mb-2">
                      Currently working on Yunia AI development project
                    </p>
                    <div className="text-xs text-base-content/50">
                      Context updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  {(geminiMemory.length === 0 && rimeMemory.length === 0) && (
                    <div className="text-center text-base-content/60 py-8">
                      <span className="material-icons text-4xl mb-2">psychology</span>
                      <p>Yunia is still learning about you</p>
                      <p className="text-xs">Insights will appear as you interact more</p>
                    </div>
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

        {/* Memory Tools Tab */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duplicate Scanner */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🔍 Duplicate Scanner</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  Scan and remove duplicate conversations automatically
                </p>
                <div className="space-y-4">
                  <button
                    className={`btn btn-primary w-full ${isScanning ? 'loading' : ''}`}
                    onClick={handleScanDuplicates}
                    disabled={isScanning}
                  >
                    {isScanning ? '🔍 Scanning...' : '🔍 Scan for Duplicates'}
                  </button>

                  {duplicateReport && (
                    <div className="alert alert-success">
                      <span className="material-icons">check_circle</span>
                      <div>
                        <h3 className="font-bold">Scan Complete!</h3>
                        <div className="text-xs">
                          <p>📊 Scanned: {duplicateReport.totalScanned} conversations</p>
                          <p>🔍 Found: {duplicateReport.duplicatesFound} duplicates</p>
                          <p>🗑️ Removed: {duplicateReport.duplicatesRemoved} duplicates</p>
                          <p>✅ Remaining: {duplicateReport.uniqueConversations} unique conversations</p>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={handleClearDuplicateReport}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {duplicateReport && duplicateReport.duplicateDetails.length > 0 && (
                    <div className="collapse collapse-arrow bg-base-200">
                      <input type="checkbox" />
                      <div className="collapse-title text-sm font-medium">
                        📋 View Duplicate Details ({duplicateReport.duplicateDetails.length})
                      </div>
                      <div className="collapse-content">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {duplicateReport.duplicateDetails.map((detail, index) => (
                            <div key={index} className="border border-base-300 rounded p-2 text-xs">
                              <p className="font-medium text-error">🗑️ Removed: {detail.duplicate.title}</p>
                              <p className="text-base-content/60">ID: {detail.duplicate.id} | Topic: {detail.duplicate.topic}</p>
                              <p className="font-medium text-success">✅ Kept: {detail.original.title}</p>
                              <p className="text-base-content/60">ID: {detail.original.id} | Topic: {detail.original.topic}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Memory Management */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">🛠️ Memory Management</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  Manage your AI memory data and settings
                </p>
                <div className="space-y-4">
                  <button
                    className="btn btn-info w-full"
                    onClick={handleExportData}
                  >
                    📤 Export Memory Data
                  </button>
                  <button
                    className="btn btn-warning w-full"
                    onClick={() => loadMemoryData()}
                  >
                    🔄 Refresh Memory Data
                  </button>
                  <button
                    className="btn btn-error w-full"
                    onClick={handleClearAllMemory}
                  >
                    🗑️ Clear All AI Memory
                  </button>
                </div>
              </div>
            </div>

            {/* Memory Analytics */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">� Memory Analytics</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  Insights about your AI memory usage
                </p>
                <div className="space-y-3">
                  <div className="stat">
                    <div className="stat-title">Memory Storage</div>
                    <div className="stat-value text-lg">
                      {(JSON.stringify(geminiMemory).length + JSON.stringify(rimeMemory).length + JSON.stringify(sharedMemory).length)} bytes
                    </div>
                    <div className="stat-desc">Local storage used</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Learning Progress</div>
                    <div className="stat-value text-lg">
                      {Object.keys(preferences).length + conversations.length}
                    </div>
                    <div className="stat-desc">Total memory items</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">AI Adaptation</div>
                    <div className="stat-value text-lg text-success">Active</div>
                    <div className="stat-desc">Continuously learning</div>
                  </div>
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
