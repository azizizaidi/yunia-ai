/**
 * Test data and utilities for demonstrating conversation management features
 * This file helps test the duplicate detection and topic categorization
 */

// Sample conversation data for testing
export const sampleConversations = [
  {
    title: "Income Planning Discussion",
    content: "User asked about salary planning and budget management. AI provided advice on financial planning.",
    lastUserMessage: "How can I plan my monthly income better?",
    lastAIMessage: "I recommend creating a detailed budget with 50% needs, 30% wants, and 20% savings.",
    aiType: "gemini",
    type: "auto_saved",
    messageCount: 8
  },
  {
    title: "Income Planning Discussion", // Duplicate title
    content: "User asked about salary planning and budget management. AI provided advice on financial planning.", // Duplicate content
    lastUserMessage: "How can I plan my monthly income better?", // Duplicate message
    lastAIMessage: "I recommend creating a detailed budget with 50% needs, 30% wants, and 20% savings.", // Duplicate response
    aiType: "gemini",
    type: "auto_saved",
    messageCount: 10
  },
  {
    title: "Daily Schedule Planning",
    content: "User wants to organize their daily schedule and set up reminders for important tasks.",
    lastUserMessage: "Can you help me plan my daily schedule?",
    lastAIMessage: "I'll help you create a structured daily plan with time blocks for different activities.",
    aiType: "gemini",
    type: "auto_saved",
    messageCount: 6
  },
  {
    title: "Weekly Planner Setup",
    content: "Discussion about setting up a weekly planner with goals and task management.",
    lastUserMessage: "I need to organize my weekly tasks better",
    lastAIMessage: "Let's create a weekly planner with priority levels and deadline tracking.",
    aiType: "gemini",
    type: "auto_saved",
    messageCount: 12
  },
  {
    title: "Weather Update Request",
    content: "User asked for current weather conditions and forecast for the week.",
    lastUserMessage: "What's the weather like today?",
    lastAIMessage: "Today is sunny with 25°C, perfect weather for outdoor activities.",
    aiType: "rime",
    type: "auto_saved",
    messageCount: 4
  },
  {
    title: "General Chat",
    content: "Casual conversation about various topics without specific category.",
    lastUserMessage: "How are you doing today?",
    lastAIMessage: "I'm doing great! Ready to help you with anything you need.",
    aiType: "gemini",
    type: "auto_saved",
    messageCount: 3
  }
];

/**
 * Test the conversation saving with duplicate detection
 * @param {Function} saveConversation - The saveConversation function to test
 */
export const testDuplicateDetection = async (saveConversation) => {
  console.log("🧪 Testing Conversation Duplicate Detection");
  
  try {
    // Test 1: Save first income conversation
    console.log("📝 Saving first income conversation...");
    const conv1 = await saveConversation(sampleConversations[0]);
    console.log("✅ First conversation saved:", conv1.topic);
    
    // Test 2: Try to save duplicate income conversation
    console.log("📝 Attempting to save duplicate income conversation...");
    const conv2 = await saveConversation(sampleConversations[1]);
    console.log("✅ Duplicate handling result:", conv2.id === conv1.id ? "Duplicate detected and merged" : "New conversation created");
    
    // Test 3: Save planner conversations (should be merged as similar topic)
    console.log("📝 Saving planner conversations...");
    const conv3 = await saveConversation(sampleConversations[2]);
    const conv4 = await saveConversation(sampleConversations[3]);
    console.log("✅ Planner conversations:", conv3.topic, conv4.topic);
    
    // Test 4: Save different topic conversations
    console.log("📝 Saving weather and general conversations...");
    const conv5 = await saveConversation(sampleConversations[4]);
    const conv6 = await saveConversation(sampleConversations[5]);
    console.log("✅ Different topics saved:", conv5.topic, conv6.topic);
    
    console.log("🎉 Duplicate detection test completed!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

/**
 * Test topic categorization
 * @param {Function} detectConversationTopic - Topic detection function
 */
export const testTopicCategorization = (detectConversationTopic) => {
  console.log("🧪 Testing Topic Categorization");
  
  const testCases = [
    {
      input: { content: "I need help with my salary and budget planning" },
      expected: "income"
    },
    {
      input: { content: "Can you help me schedule my meetings and tasks?" },
      expected: "planner"
    },
    {
      input: { content: "What's the weather forecast for tomorrow?" },
      expected: "weather"
    },
    {
      input: { content: "I want to start exercising and eating healthy" },
      expected: "health"
    },
    {
      input: { content: "How's your day going?" },
      expected: "general"
    }
  ];
  
  testCases.forEach((testCase, index) => {
    const result = detectConversationTopic(testCase.input);
    const passed = result === testCase.expected;
    console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} Expected: ${testCase.expected}, Got: ${result}`);
  });
  
  console.log("🎉 Topic categorization test completed!");
};

/**
 * Generate sample data for demonstration
 * @param {Function} saveConversation - The saveConversation function
 */
export const generateSampleData = async (saveConversation) => {
  console.log("🎭 Generating sample conversation data...");
  
  try {
    for (const conversation of sampleConversations) {
      await saveConversation(conversation);
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("✅ Sample data generated successfully!");
  } catch (error) {
    console.error("❌ Failed to generate sample data:", error);
  }
};

export default {
  sampleConversations,
  testDuplicateDetection,
  testTopicCategorization,
  generateSampleData
};
