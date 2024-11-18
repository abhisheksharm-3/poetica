import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ValidationResponse, PoemValidationRequest } from './types';
import { STYLE_CONFIGS, EMOTIONAL_TONE_CONFIGS } from './styleConfig';

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function validatePoem(
  params: PoemValidationRequest,
  genAI: GoogleGenerativeAI
): Promise<ValidationResponse> {
  try {
    const styleConfig = STYLE_CONFIGS[params.originalParams.style];
    const toneConfig = EMOTIONAL_TONE_CONFIGS[params.originalParams.emotionalTone];

    const validationPrompt = `
As a poetry expert and critic, analyze this poem for technical accuracy and artistic merit:

ORIGINAL REQUIREMENTS:
1. Form: ${styleConfig.structure}
2. Emotional Tone: ${toneConfig}
3. Creative Level: ${params.originalParams.creativeStyle}/100
4. Language Level: ${params.originalParams.languageVariety}
5. Length: ${params.originalParams.length}

POEM TO ANALYZE:
${params.poem}

Provide a detailed technical analysis in JSON format:
{
  "isValid": boolean,
  "feedback": {
    "styleMatch": boolean,
    "toneMatch": boolean,
    "lengthMatch": boolean,
    "technicalAccuracy": string,
    "artisticMerit": string,
    "suggestions": string
  },
  "reformattedPoem": string // Only if the original needs significant improvement
}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings,
    });

    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
  } catch (error) {
    console.error("Validation error:", error);
    return {
      isValid: true,
      feedback: {
        styleMatch: true,
        toneMatch: true,
        lengthMatch: true,
        suggestions: "Validation service unavailable"
      }
    };
  }
}