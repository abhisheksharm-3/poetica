import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { 
  FrontendParams, 
  BackendParams, 
  PoemApiResponse, 
  GenerationResponse,
} from './types';
import { STYLE_CONFIGS } from './styleConfig';
import { createEnhancedPrompt } from '../utils/promptEnhancer';
import { validatePoem } from './validationService';
import { PoemLength } from './types';

function transformParams(params: FrontendParams): BackendParams {
  const styleConfig = STYLE_CONFIGS[params.style];
  const nameMatch = params.userPrompt.match(/about\s+(?:my love lady,?\s+)?(\w+)/i);
  const name = nameMatch ? nameMatch[1] : "";
  
  return {
    prompt: `Create a ${params.style} poem ${name ? `about ${name}` : ""} with the theme: ${params.userPrompt}`,
    max_length: getLengthLimit(params.length),
    temperature: styleConfig.temperature,
    top_k: 30,
    top_p: styleConfig.top_p,
    repetition_penalty: params.wordRepetition
  };
}

function getLengthLimit(length: PoemLength): number {
  const lengthMap: Record<PoemLength, number> = {
    'short': 100,
    'medium': 200,
    'long': 300
  };
  return lengthMap[length];
}

function extractKeywords(lines: string[]): string {
  const fullText = lines.join(' ');
  
  const stopWords = new Set([
    'the', 'and', 'a', 'in', 'of', 'to', 'with', 'on', 'at', 'for', 'by',
    'is', 'are', 'was', 'were', 'be', 'have', 'has', 'had', 'this', 'that',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her'
  ]);
  
  const words = fullText
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  const wordFreq = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
    .join(', ');
}

export async function generatePoem(
  params: FrontendParams,
  genAI: GoogleGenerativeAI
): Promise<GenerationResponse> {
  try {
    const backendParams = transformParams(params);
    
    // First, get initial generation from backend
    const backendResponse = await fetch(`${process.env.SERVER_URI}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendParams),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend API error! status: ${backendResponse.status}`);
    }

    const apiResponse = await backendResponse.json() as PoemApiResponse;
    
    // Extract keywords and create enhanced prompt
    const keywords = extractKeywords(apiResponse.poem.lines);
    const enhancedPrompt = createEnhancedPrompt(params, keywords);
    
    // Generate refined poem with Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      safetySettings: [
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
    ],
    });

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse Gemini's response
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const generatedContent = JSON.parse(cleanText);
    
    // Validate the generated poem
    const validationResult = await validatePoem({
      poem: generatedContent.poem,
      originalParams: params,
      backendParams: backendParams
    }, genAI);

    // Use the reformatted poem if validation suggests improvements
    const finalPoem = validationResult.reformattedPoem || generatedContent.poem;

    // Prepare final response
    return {
      poem: {
        title: generatedContent.title,
        content: finalPoem,
        lines: finalPoem.split('\n').filter((line: string) => line.trim() !== '')
      },
      validationFeedback: validationResult.feedback,
      metadata: {
        timestamp: new Date().toISOString(),
        model_type: `${apiResponse.metadata.model_type} + gemini-2.0-flash`
      }
    };
  } catch (error) {
    console.error("Error generating poem:", error);
    throw new Error("Failed to generate poem. Please try again later.");
  }
}

// Improved error types
export class PoemGenerationError extends Error {
  constructor(
    message: string,
    public readonly code: 'BACKEND_ERROR' | 'VALIDATION_ERROR' | 'GENERATION_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'PoemGenerationError';
  }
}
