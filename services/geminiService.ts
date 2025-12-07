import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * 
 * @param base64Image The base64 encoded string of the source image.
 * @param mimeType The MIME type of the source image.
 * @param prompt The text instruction for editing.
 * @returns The base64 encoded string of the generated image.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    // Clean base64 string if it contains the data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // "Nano banana" / Flash Image model
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Configuration for image generation is implicit in the prompt for this model,
      // but we ensure no unsupported configs (like responseMimeType) are passed.
    });

    let generatedImageBase64 = '';

    // Iterate through parts to find the image output
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break; // Found the image
        }
      }
    }

    if (!generatedImageBase64) {
      console.warn("No image data found in response parts. Checking for text feedback.");
      // Sometimes the model might refuse and return text explaining why.
      const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
      if (textPart?.text) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
      }
      throw new Error("Gemini did not return an image.");
    }

    return generatedImageBase64;

  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};
