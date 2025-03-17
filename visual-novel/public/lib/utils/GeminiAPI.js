/**
 * GeminiAPI.js - Utility for interacting with Google's Gemini API using the official SDK
 */
class GeminiAPI {
    constructor() {
        // Try to load API key from localStorage
        this.apiKey = localStorage.getItem('geminiApiKey') || '';
        console.log('GeminiAPI initialized');
    }

    /**
     * Set the API key
     * @param {string} key - The Gemini API key
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('geminiApiKey', key);
        console.log('Gemini API key saved', key);
    }

    /**
     * Get the current API key
     * @returns {string} - The current API key
     */
    getApiKey() {
        console.log('Gemini API key retrieved', this.apiKey);
        return this.apiKey;
    }

    /**
     * Generate text about Spain using the Gemini API
     * @returns {Promise<string>} - The generated text
     */
    async generateSpainFact() {
        if (!this.apiKey) {
            return "Please set your Gemini API key in the settings menu.";
        }
        debugger;
        try {
            // Check if the SDK is available in the global scope
            if (!window.GoogleGenerativeAI) {
                throw new Error('Google Generative AI SDK not loaded. Please refresh the page.');
            }

            // Initialize the Google Generative AI client
            const genAI = new window.GoogleGenerativeAI(this.apiKey);

            // Get the model
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
            });

            // Set generation config
            const generationConfig = {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 100,
                responseMimeType: "text/plain",
            };

            // Start a chat session
            const chatSession = model.startChat({
                generationConfig,
                history: [],
            });

            // Send the message
            const result = await chatSession.sendMessage(
                "Generate a short, interesting fact about Spain or Spanish culture that would be helpful for a language learner. Keep it under 100 words."
            );

            // Return the response text
            return result.response.text();
        } catch (error) {
            console.error('Error generating text with Gemini API:', error);
            return 'Failed to generate AI text. Please check your API key and try again.';
        }
    }
}

// Create a global instance
window.geminiAPI = new GeminiAPI();
