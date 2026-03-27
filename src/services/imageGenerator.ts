import { GoogleGenAI } from "@google/genai";

export async function generateWorkflowImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompts = [
    "A professional Korean female call center consultant wearing a headset, smiling kindly, in a modern office background, high quality, realistic, professional lighting.",
    "A professional Korean office worker handing over a dispatch document or folder to a technician, professional atmosphere, high quality, realistic, office setting.",
    "A professional Korean male computer engineer carrying a tool bag and a laptop, walking towards a customer's door, friendly and professional look, high quality, realistic, apartment hallway background.",
    "A happy Korean female customer brightly smiling and giving a thumbs up next to a perfectly working computer, bright and clean home interior, high quality, realistic."
  ];

  const results = [];
  for (const prompt of prompts) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "3:4" } }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        results.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
  }
  return results;
}
