"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getMemoryStatistics,
  getConversations,
  getConversationsByTopic,
  getConversationTopicStats,
  scanAndRemoveDuplicates,
  findSimilarConversations,
  getUserPreferences,
  saveAILearningPreference,
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
export default function MemoryManagerPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [memoryStats, setMemoryStats] = useState<any>({});
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationsByTopic, setConversationsByTopic] = useState<any>({});
  const [conversationStats, setConversationStats] = useState<any>({});
  const [preferences, setPreferences] = useState<any>({});
  const [geminiMemory, setGeminiMemory] = useState<any[]>([]);
  const [rimeMemory, setRimeMemory] = useState<any[]>([]);
  const [sharedMemory, setSharedMemory] = useState<any>({});

  // Form states
  const [newPreference, setNewPreference] = useState({ key: '', value: '' });
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Duplicate scanning states
  const [duplicateReport, setDuplicateReport] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [similarConversations, setSimilarConversations] = useState<any[]>([]);

  useEffect(() => {
    loadMemoryData();
  }, []);

  // Auto-refresh memory data every 10 seconds when on conversations tab
  useEffect(() => {
    let interval: NodeJS.Timeout;
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
        getAIMemory('gemini'),
        getAIMemory('rime'),
        getSharedMemory()
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
    Object.entries(topicCounts).forEach(([topic, stats]: [string, any]) => {
      if (stats.count > 0) {
        const topicEmojis: { [key: string]: string } = {
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

  const handleSavePreference = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAILearningPreference(newPreference.key, newPreference.value);
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
      <div className="p-2 sm:p-4 lg:p-6">
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
          <nav className="flex flex-wrap space-x-4 lg:space-x-8 overflow-x-auto">
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

        {/* Tab Content - Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
