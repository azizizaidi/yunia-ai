import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import MemoryDemo from "../components/ai/MemoryDemo";
import MemoryExamples from "../components/ai/MemoryExamples";
import MemoryFlowDemo from "../components/ai/MemoryFlowDemo";
import SimpleMemoryExample from "../components/ai/SimpleMemoryExample";

/**
 * Memory Examples page - showcasing AI memory and sync functionality
 */
const MemoryExamplesPage = () => {
  const [activeTab, setActiveTab] = useState('simple');

  const tabs = [
    {
      id: 'simple',
      title: '🎯 Simple Examples',
      description: 'Easy-to-understand memory examples',
      component: SimpleMemoryExample
    },
    {
      id: 'flow',
      title: '🔄 Flow Demo',
      description: 'Visual memory flow demonstration',
      component: MemoryFlowDemo
    },
    {
      id: 'comprehensive',
      title: '📚 Comprehensive',
      description: 'Detailed memory scenarios',
      component: MemoryExamples
    },
    {
      id: 'interactive',
      title: '🧪 Interactive Demo',
      description: 'Interactive memory testing',
      component: MemoryDemo
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SimpleMemoryExample;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧠 AI Memory Storage Examples</h1>
          <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
            Explore how RimeAI and GeminiAI share memory, sync data, and coordinate responses 
            in real-time. These examples demonstrate the memory storage system that enables 
            seamless collaboration between text and voice AI assistants.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed justify-center mb-8 bg-base-200 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab tab-lg ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="text-center">
                <div className="font-semibold">{tab.title}</div>
                <div className="text-xs opacity-70">{tab.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Component */}
        <div className="min-h-screen">
          <ActiveComponent />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title justify-center">💡 About Memory Storage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🗄️ Frontend Storage</h4>
                  <p className="text-blue-700">
                    Currently using localStorage for development. Ready to migrate to backend database.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔄 Real-time Sync</h4>
                  <p className="text-green-700">
                    Changes in one AI immediately sync to shared memory and notify other AI.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">👤 User-specific</h4>
                  <p className="text-purple-700">
                    Each user has isolated memory storage. No data mixing between users.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">🚀 Scalable</h4>
                  <p className="text-orange-700">
                    Architecture designed to scale from frontend-only to full backend integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemoryExamplesPage;
