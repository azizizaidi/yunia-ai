import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { saveAIMemory, getAIMemory, getSharedMemory, updateSharedMemory } from "../services/api";

/**
 * Simple test page to check if memory system works
 */
const TestMemory = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runMemoryTest = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      // Test 1: Save memory
      await saveAIMemory('gemini', {
        message: 'Test message from GeminiAI',
        type: 'test',
        timestamp: new Date().toISOString()
      });

      // Test 2: Get memory
      const geminiMemory = await getAIMemory('gemini');

      // Test 3: Update shared memory
      await updateSharedMemory({
        testData: 'Memory test successful',
        testTime: new Date().toISOString()
      });

      // Test 4: Get shared memory
      const sharedMemory = await getSharedMemory();

      setTestResult(`✅ Memory test successful!

Gemini Memory: ${geminiMemory.length} items
Shared Memory: ${Object.keys(sharedMemory).length} keys
Latest test: ${sharedMemory.testTime || 'N/A'}`);

    } catch (error) {
      setTestResult(`❌ Memory test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">🧠 Memory Test Page</h1>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Memory System Test</h2>
            <p>This is a simple test page to verify the memory system is working.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">GeminiAI (Text)</h3>
                <p className="text-blue-700">Text-based AI assistant</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">RimeAI (Voice)</h3>
                <p className="text-green-700">Voice-based AI assistant</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Test Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Page loaded successfully</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>DashboardLayout working</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Basic components rendering</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="btn btn-primary"
                onClick={runMemoryTest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Testing...
                  </>
                ) : (
                  '🧠 Test Memory System'
                )}
              </button>
            </div>

            {testResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Test Results:</h3>
                <pre className="bg-base-200 p-4 rounded-lg text-sm whitespace-pre-wrap">
                  {testResult}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestMemory;
