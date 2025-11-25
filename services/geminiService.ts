import { GoogleGenAI } from "@google/genai";
import { ReadingResult, Spread } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const getTarotInterpretation = async (
  question: string,
  spread: Spread,
  results: ReadingResult[]
): Promise<string> => {
  const ai = getClient();
  
  // Construct the prompt based on the cards drawn
  const cardsDescription = results.map(r => 
    `- Position: ${r.position.name} (${r.position.description})
     - Card: ${r.card.name} ${r.isReversed ? '(Reversed)' : '(Upright)'}
     - Arcana: ${r.card.arcana}`
  ).join('\n');

  const prompt = `
    You are a wise, mystical, and empathetic Tarot reader. 
    The user has asked the following question: "${question}".
    
    They have chosen the "${spread.name}" spread.
    
    Here are the cards drawn:
    ${cardsDescription}
    
    Please provide a comprehensive interpretation of this reading. 
    1. Start with a general sense of the energy.
    2. Interpret each card in its specific position, considering whether it is upright or reversed.
    3. Synthesize the cards together to answer the user's question directly.
    4. Provide a supportive and empowering conclusion.
    
    Format your response in clean Markdown. Use bolding for emphasis and card names. 
    Do not be overly fatalistic; focus on guidance and self-reflection.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Tarot reader with a mystical but grounded persona.",
        temperature: 0.8, // Slightly creative
      }
    });

    return response.text || "The spirits are silent. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to consult the oracle. Please check your connection or API key.");
  }
};
