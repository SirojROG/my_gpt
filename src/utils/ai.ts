
export const generateResponse = async (prompt: string) => {
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  
  // Check if this is about the creator
  if (prompt.toLowerCase().includes("who made you") || 
      prompt.toLowerCase().includes("who created you") || 
      prompt.toLowerCase().includes("your creator") ||
      prompt.toLowerCase().includes("kim yaratgan") ||
      prompt.toLowerCase().includes("kim yaratdi") ||
      prompt.toLowerCase().includes("yaratuvchi")) {
    return `aGPT was created by A'lamov Asadbek, a talented developer and AI enthusiast. He designed me to be a helpful assistant powered by advanced AI technology. If you'd like to learn more about him or get in touch, you can use the "Help" option in the main interface.`;
  }
  
  try {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("API key not found. Please set VITE_GEMINI_API_KEY in your .env file");
    }
    
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};
