/**
 * Gemini API service for chat functionality
 * Uses Google's Gemini API for generating responses
 *
 * Note: You need to get an API key from Google AI Studio (https://aistudio.google.com/)
 * The free tier includes 1,500 requests per day with Gemini 1.5 Flash
 *
 * Environment Variables:
 * - VITE_GEMINI_API_KEY: Your Gemini API key (stored in .env file)
 */

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Send a message to the Gemini API and get a response
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<Object>} - Promise resolving to the API response
 */
export const sendMessageToGemini = async (messages) => {
  try {
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Prepare request body
    const requestBody = {
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Make API request
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    return {
      content: responseText,
      role: "assistant",
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      content: "Sorry, there was an error communicating with the AI service. Please try again later.",
      role: "assistant",
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Alternative implementation using Hugging Face Inference API
 * Uncomment and use this if you prefer Hugging Face
 *
 * Environment Variables:
 * - VITE_HUGGINGFACE_API_KEY: Your Hugging Face API key (stored in .env file)
 */
/*
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY; // Get from huggingface.co

export const sendMessageToHuggingFace = async (messages) => {
  try {
    // Format the conversation history for the model
    const conversation = messages.map(msg =>
      `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
    ).join("\n");

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: conversation + "\nAssistant:",
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text || "Sorry, I couldn't generate a response.";

    // Extract only the assistant's response
    const assistantResponse = generatedText.split("Assistant:").pop().trim();

    return {
      content: assistantResponse,
      role: "assistant",
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return {
      content: "Sorry, there was an error communicating with the AI service. Please try again later.",
      role: "assistant",
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
  }
};
*/
