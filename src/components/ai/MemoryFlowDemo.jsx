import { useState, useEffect } from 'react';
import { useAIMemory } from '../../context/AIMemoryContext';
import useAISync from '../../hooks/useAISync';

/**
 * Visual demonstration of memory flow between AIs
 */
const MemoryFlowDemo = () => {
  const { sharedMemory } = useAIMemory();
  const geminiSync = useAISync('gemini');
  const rimeSync = useAISync('rime');
  
  const [flowStep, setFlowStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  // Demo scenarios
  const scenarios = [
    {
      title: "🌅 Morning Routine",
      steps: [
        { ai: "rime", action: "Wake-up call", message: "Good morning! Time to wake up!" },
        { ai: "shared", action: "Update mode", message: "Mode switched to 'morning'" },
        { ai: "rime", action: "Weather briefing", message: "Today is sunny, 28°C" },
        { ai: "gemini", action: "Show schedule", message: "Your first meeting is at 10 AM" },
        { ai: "shared", action: "Sync complete", message: "Both AIs have morning context" }
      ]
    },
    {
      title: "📝 Reminder Creation",
      steps: [
        { ai: "gemini", action: "User creates reminder", message: "Meeting at 2 PM" },
        { ai: "shared", action: "Save to shared memory", message: "Reminder stored" },
        { ai: "rime", action: "Voice confirmation", message: "I'll remind you at 1:50 PM" },
        { ai: "shared", action: "Update preferences", message: "Voice alerts enabled" },
        { ai: "both", action: "Sync complete", message: "Reminder active in both AIs" }
      ]
    },
    {
      title: "🚗 Travel Mode",
      steps: [
        { ai: "gemini", action: "Detect movement", message: "User is driving" },
        { ai: "shared", action: "Switch to voice mode", message: "Mode: voice-only" },
        { ai: "rime", action: "Traffic update", message: "Heavy traffic ahead, 5 min delay" },
        { ai: "rime", action: "Route suggestion", message: "Alternative route available" },
        { ai: "shared", action: "Update location", message: "Location and ETA updated" }
      ]
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState(0);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const runScenario = async () => {
    setIsRunning(true);
    setFlowStep(0);
    setLogs([]);
    
    const scenario = scenarios[selectedScenario];
    addLog(`Starting scenario: ${scenario.title}`, 'start');

    for (let i = 0; i < scenario.steps.length; i++) {
      setFlowStep(i);
      const step = scenario.steps[i];
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Execute the step
      switch (step.ai) {
        case 'gemini':
          await geminiSync.recordInteraction({
            message: step.message,
            type: step.action,
            scenario: scenario.title
          });
          addLog(`GeminiAI: ${step.message}`, 'gemini');
          break;
          
        case 'rime':
          await rimeSync.recordInteraction({
            message: step.message,
            type: step.action,
            scenario: scenario.title
          });
          addLog(`RimeAI: ${step.message}`, 'rime');
          break;
          
        case 'shared':
          await geminiSync.updateContext({
            lastScenarioStep: step.action,
            lastScenarioMessage: step.message,
            scenarioProgress: i + 1
          });
          addLog(`Shared Memory: ${step.message}`, 'shared');
          break;
          
        case 'both':
          await geminiSync.syncBetweenAIs('gemini', {
            scenarioComplete: true,
            finalMessage: step.message
          });
          addLog(`Both AIs: ${step.message}`, 'both');
          break;
      }
    }
    
    setFlowStep(scenario.steps.length);
    addLog(`Scenario completed: ${scenario.title}`, 'complete');
    setIsRunning(false);
  };

  const clearLogs = () => {
    setLogs([]);
    setFlowStep(0);
  };

  const getStepStatus = (index) => {
    if (index < flowStep) return 'completed';
    if (index === flowStep && isRunning) return 'active';
    return 'pending';
  };

  const getAIColor = (ai) => {
    switch (ai) {
      case 'gemini': return 'text-blue-600';
      case 'rime': return 'text-green-600';
      case 'shared': return 'text-purple-600';
      case 'both': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'gemini': return 'bg-blue-100 border-blue-300';
      case 'rime': return 'bg-green-100 border-green-300';
      case 'shared': return 'bg-purple-100 border-purple-300';
      case 'both': return 'bg-orange-100 border-orange-300';
      case 'start': return 'bg-gray-100 border-gray-300';
      case 'complete': return 'bg-emerald-100 border-emerald-300';
      default: return 'bg-base-200 border-base-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🔄 Memory Flow Demonstration</h2>
        <p className="text-base-content/70">
          Watch how memory flows between RimeAI and GeminiAI in real-time
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">📋 Select Scenario</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <button
                key={index}
                className={`btn ${selectedScenario === index ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedScenario(index)}
                disabled={isRunning}
              >
                {scenario.title}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4 mt-4">
            <button
              className="btn btn-success flex-1"
              onClick={runScenario}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Running...
                </>
              ) : (
                '▶️ Run Scenario'
              )}
            </button>
            <button
              className="btn btn-outline"
              onClick={clearLogs}
              disabled={isRunning}
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Flow Steps */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">🎯 Flow Steps</h3>
            <div className="space-y-3">
              {scenarios[selectedScenario].steps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      status === 'completed' ? 'bg-success/20 border-success' :
                      status === 'active' ? 'bg-warning/20 border-warning animate-pulse' :
                      'bg-base-200 border-base-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      status === 'completed' ? 'bg-success' :
                      status === 'active' ? 'bg-warning' :
                      'bg-base-300'
                    }`}>
                      {status === 'completed' ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${getAIColor(step.ai)}`}>
                        {step.ai.toUpperCase()}: {step.action}
                      </div>
                      <div className="text-sm text-base-content/70">
                        {step.message}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Live Logs */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">📝 Live Execution Log</h3>
            <div className="bg-base-200 rounded-lg p-4 h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-center text-base-content/50">
                  No logs yet. Run a scenario to see the memory flow.
                </p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border-l-4 ${getLogColor(log.type)}`}
                    >
                      <div className="text-xs text-base-content/60 mb-1">
                        {log.timestamp}
                      </div>
                      <div className="text-sm font-medium">
                        {log.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Memory State Display */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">🧠 Current Memory State</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💬 GeminiAI Memory</h4>
              <div className="text-sm space-y-1">
                <p>Recent interactions: {geminiSync.getHistory(1).length}</p>
                <p>Mode: {geminiSync.currentMode}</p>
                <p>Processing: {geminiSync.isProcessing ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🎤 RimeAI Memory</h4>
              <div className="text-sm space-y-1">
                <p>Recent interactions: {rimeSync.getHistory(1).length}</p>
                <p>Mode: {rimeSync.currentMode}</p>
                <p>Processing: {rimeSync.isProcessing ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🔄 Shared Memory</h4>
              <div className="text-sm space-y-1">
                <p>Active reminders: {sharedMemory.activeReminders?.length || 0}</p>
                <p>Current mode: {sharedMemory.currentMode || 'text'}</p>
                <p>Last sync: {sharedMemory.lastSync ? 
                  new Date(sharedMemory.lastSync).toLocaleTimeString() : 'Never'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">🎨 Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>GeminiAI (Text)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>RimeAI (Voice)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Shared Memory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Both AIs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryFlowDemo;
