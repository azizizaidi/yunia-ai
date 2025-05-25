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
import PolarChart from "../../components/ui/PolarChart";

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

  // Process AI memory data for polar chart visualization
  const getAILearningChartData = () => {
    const chartData = [];

    // === REAL DATA ONLY - NO AI HALLUCINATIONS ===

    // Personal Information (actual user messages)
    const userMessages = geminiMemory.filter(m => m.type === 'user_message').length;
    if (userMessages > 0) {
      chartData.push({
        label: '👤 Personal Info',
        value: userMessages
      });
    }

    // AI Responses (actual AI responses)
    const aiResponses = [...geminiMemory, ...rimeMemory].filter(m => m.type === 'ai_response').length;
    if (aiResponses > 0) {
      chartData.push({
        label: '🤖 AI Responses',
        value: aiResponses
      });
    }

    // User Preferences (actual saved preferences)
    const preferencesCount = Object.keys(preferences).length;
    if (preferencesCount > 0) {
      chartData.push({
        label: '⚙️ Preferences',
        value: preferencesCount
      });
    }

    // Conversations (actual saved conversations)
    const conversationsCount = conversations.length;
    if (conversationsCount > 0) {
      chartData.push({
        label: '💬 Conversations',
        value: conversationsCount
      });
    }

    // === TOPIC-BASED REAL DATA ===
    const topicCounts = conversationStats.byTopic || {};
    Object.entries(topicCounts).forEach(([topic, stats]) => {
      if (stats.count > 0) {
        const topicEmojis = {
          income: '💰',
          planner: '📅',
          weather: '🌤️',
          health: '🏥',
          work: '💼',
          personal: '👤',
          general: '💬'
        };
        chartData.push({
          label: `${topicEmojis[topic] || '📂'} ${topic.charAt(0).toUpperCase() + topic.slice(1)} Topics`,
          value: stats.count
        });
      }
    });

    // If no real data available, return empty array
    if (chartData.length === 0) {
      return [];
    }

    return chartData;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 text-gray-800">Memory Manager</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Manage how Yunia learns and remembers your preferences and conversations
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
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'dashboard' },
              { id: 'conversations', label: 'Conversations', icon: 'chat' },
              { id: 'learning', label: 'Learning Analytics', icon: 'psychology' },
              { id: 'preferences', label: 'Preferences', icon: 'settings' },
              { id: 'tools', label: 'Tools', icon: 'build' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="material-icons text-sm mr-2 align-middle">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Memory Statistics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Memory Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversations</span>
                    <span className="font-semibold text-gray-900">{memoryStats.totalConversations || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Preferences</span>
                    <span className="font-semibold text-gray-900">{memoryStats.totalPreferences || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Memory Items</span>
                    <span className="font-semibold text-blue-600">{memoryStats.totalMemoryItems || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Learning Data</span>
                    <span className="font-semibold text-green-600">{(geminiMemory.length + rimeMemory.length) || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    onClick={() => setActiveTab('learning')}
                  >
                    View Learning Analytics
                  </button>
                  <button
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    onClick={handleExportData}
                  >
                    Export Memory Data
                  </button>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    onClick={handleClearAllMemory}
                  >
                    Clear All Memory
                  </button>
                </div>
              </div>

              {/* Learning Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Personal Information</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      geminiMemory.filter(m => m.type === 'user_message').length > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {geminiMemory.filter(m => m.type === 'user_message').length > 0 ? 'Learning' : 'Waiting'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Preferences ({Object.keys(preferences).length})</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      Object.keys(preferences).length > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {Object.keys(preferences).length > 0 ? 'Active' : 'None'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Communication Style</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      geminiMemory.length > 10 ? 'bg-green-100 text-green-800' :
                      geminiMemory.length > 3 ? 'bg-yellow-100 text-yellow-800' :
                      geminiMemory.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {geminiMemory.length > 10 ? 'Adapted' :
                       geminiMemory.length > 3 ? 'Adapting' :
                       geminiMemory.length > 0 ? 'Learning' : 'Waiting'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Memory Storage</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {geminiMemory.length + rimeMemory.length} items
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    {(geminiMemory.length > 0 || rimeMemory.length > 0) ?
                      `Last interaction: ${new Date(Math.max(
                        ...geminiMemory.map(m => new Date(m.timestamp)),
                        ...rimeMemory.map(m => new Date(m.timestamp))
                      )).toLocaleString()}` :
                      'No interactions yet - start chatting to begin learning'
                    }
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
          <div className="space-y-8">
            {/* Check if there's any AI memory data */}
            {(geminiMemory.length === 0 && rimeMemory.length === 0) ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="text-5xl mb-6">🤖</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">No Learning Data Yet</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start chatting with Yunia to begin the learning process. Your conversations will help Yunia understand your preferences and provide better assistance.
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  onClick={() => window.location.href = '/dashboard/ai-chat'}
                >
                  Start Chatting with Yunia
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* AI Learning Analytics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Learning Analytics</h2>
                    <p className="text-gray-600">
                      Live overview of Yunia's learning from your interactions and conversations
                    </p>
                  </div>
                  <PolarChart
                    data={getAILearningChartData()}
                    title="Learning Progress"
                  />
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">
                      Real-time data from chat interactions, memory usage, and user preferences
                    </p>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                      onClick={() => {
                        loadMemoryData();
                      }}
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>

                {/* Learning Categories */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Learning Categories</h2>
                    <p className="text-gray-600">
                      What Yunia has learned from {geminiMemory.length + rimeMemory.length} interactions
                    </p>
                  </div>
                  <div className="space-y-4">
                    {/* Personal Information */}
                    {geminiMemory.some(m => m.type === 'user_message' || m.type === 'ai_response') && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-900">Personal Information</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Learning from {geminiMemory.filter(m => m.type === 'user_message').length} user messages
                        </p>
                      </div>
                    )}

                    {/* Communication Style */}
                    {(geminiMemory.length > 0 || rimeMemory.length > 0) && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-900">Communication Style</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {geminiMemory.length > 5 ? 'Adapting' : 'Learning'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Analyzing patterns from {geminiMemory.length} text interactions
                          {rimeMemory.length > 0 && ` and ${rimeMemory.length} voice interactions`}
                        </p>
                      </div>
                    )}

                    {/* User Preferences */}
                    {Object.keys(preferences).length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-900">User Preferences</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {Object.keys(preferences).length} preferences configured
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Preference */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Personal Preference</h2>
                <p className="text-gray-600">
                  Tell Yunia about your personal preferences so it can understand you better and provide more personalized responses.
                </p>
              </div>
              <form onSubmit={handleSavePreference} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preference Key
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., favorite_color, communication_style, hobby"
                    value={newPreference.key}
                    onChange={(e) => setNewPreference({...newPreference, key: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., blue, direct and concise, reading books"
                    value={newPreference.value}
                    onChange={(e) => setNewPreference({...newPreference, value: e.target.value})}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Save Preference
                </button>
              </form>
            </div>

            {/* Preferences List */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Preferences ({Object.keys(preferences).length})
                </h2>
                <p className="text-gray-600">
                  What Yunia knows about your personal preferences and characteristics.
                </p>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(preferences).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{key}</h3>
                        <p className="text-sm text-gray-600">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-3">
                        {typeof value}
                      </span>
                    </div>
                  </div>
                ))}
                {Object.keys(preferences).length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-3">⚙️</div>
                    <p className="text-gray-500">No preferences added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start by telling Yunia about yourself!</p>
                  </div>
                )}
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
