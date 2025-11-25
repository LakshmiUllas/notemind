import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client.
// Note: In a real deployment, ensure process.env.API_KEY is replaced during build or provided via secure means.
// Since this is a client-side demo, we assume the environment variable is available.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const checkApiKey = (): boolean => {
    return !!apiKey;
};

export const summarizeContent = async (text: string): Promise<string> => {
  if (!text || text.trim().length < 10) return "Not enough content to summarize.";
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Please provide a concise summary of the following notes. Use bullet points if necessary for clarity.\n\n${text}`,
      config: {
        systemInstruction: "You are a helpful study assistant. Keep summaries clear, concise, and structured.",
      }
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
};

export const generateQuiz = async (text: string): Promise<string> => {
    if (!text || text.trim().length < 50) return "Not enough content to generate a quiz.";

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a short quiz (3 questions) based on these notes. Format it with the Question, Options, and then the Answer hidden or at the bottom.\n\n${text}`,
            config: {
                systemInstruction: "You are a teacher creating a quiz for a student.",
            }
        });
        return response.text || "Could not generate quiz.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating quiz.";
    }
};

export const explainConcept = async (concept: string, context: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Explain the concept "${concept}" in the context of these notes:\n\n${context.substring(0, 1000)}...`, // Truncate context if too long
             config: {
                systemInstruction: "You are a tutor. Explain concepts simply and clearly.",
            }
        });
        return response.text || "Could not generate explanation.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error fetching explanation.";
    }
};
