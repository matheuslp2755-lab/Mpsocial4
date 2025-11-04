import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY not found in environment variables. Gemini features will be disabled.");
}

const bioPrompts = {
    en: (interests: string) => `Create a short, cool, and engaging social media bio (max 150 characters) for a person interested in: ${interests}. Do not use hashtags. Be creative and modern.`,
    pt: (interests: string) => `Crie uma biografia curta, legal e envolvente para redes sociais (máximo de 150 caracteres) para uma pessoa interessada em: ${interests}. Não use hashtags. Seja criativo e moderno.`
};


export const generateBio = async (interests: string, language: 'en' | 'pt'): Promise<string> => {
  if (!ai) {
    return "AI features are currently unavailable.";
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: bioPrompts[language](interests),
    });
    return response.text;
  } catch (error) {
    console.error("Error generating bio with Gemini:", error);
    return "Failed to generate bio. Please try again.";
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("AI features are currently unavailable.");
  }
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};
