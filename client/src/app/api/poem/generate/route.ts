import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

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

type PoemStyle = "sonnet" | "haiku" | "free-verse" | "villanelle";
type EmotionalTone = "contemplative" | "joyful" | "melancholic" | "romantic";
type PoemLength = "short" | "medium" | "long";

interface FrontendParams {
  userPrompt: string;
  style: PoemStyle;
  emotionalTone: EmotionalTone;
  creativeStyle: number;  // 0-100 slider
  languageVariety: number;  // 0-1 slider
  length: PoemLength;
  wordRepetition: number;  // 1-2 slider
}

interface BackendParams {
  prompt: string;
  max_length: number;
  temperature: number;
  top_k: number;
  top_p: number;
  repetition_penalty: number;
}

interface ValidationFeedback {
  styleMatch: boolean;
  toneMatch: boolean;
  lengthMatch: boolean;
  suggestions?: string;
}

interface ValidationResponse {
  isValid: boolean;
  feedback: ValidationFeedback;
  reformattedPoem?: string;
}

interface PoemValidationRequest {
  poem: string;
  originalParams: FrontendParams;
  backendParams: BackendParams;
}

interface GenerationResponse {
  poem: string;
  validationFeedback?: ValidationFeedback;
}

interface StyleConfig {
  temperature: number;
  top_p: number;
  structure: string;
}

// Parameter Mapping Functions
function mapStyle(style: PoemStyle): StyleConfig {
  const styleMap: Record<PoemStyle, StyleConfig> = {
    'sonnet': {
      temperature: 0.7,
      top_p: 0.85,
      structure: "as a traditional sonnet with 14 lines of iambic pentameter (10 syllables per line), following the rhyme scheme ABAB CDCD EFEF GG"
    },
    'haiku': {
      temperature: 0.6,
      top_p: 0.8,
      structure: "as a haiku with three lines following the 5-7-5 syllable pattern, capturing a moment in nature or emotion"
    },
    'villanelle': {
      temperature: 0.8,
      top_p: 0.9,
      structure: "as a villanelle with 19 lines, using the specific pattern of repeating lines and ABA rhyme scheme"
    },
    'free-verse': {
      temperature: 0.9,
      top_p: 0.95,
      structure: "in free verse style, with natural rhythm and flow, unrestricted by formal patterns"
    }
  };

  return styleMap[style];
}

function mapEmotionalTone(tone: EmotionalTone): string {
  const toneMap: Record<EmotionalTone, string> = {
    'contemplative': 'expressing thoughtful introspection and philosophical depth',
    'joyful': 'conveying uplifting celebration and bright optimism',
    'melancholic': 'expressing gentle sadness and nostalgic reflection',
    'romantic': 'expressing deep romantic love and passionate admiration'
  };

  return toneMap[tone];
}

function mapCreativeStyle(value: number): string {
  if (value < 25) {
    return 'using classical imagery and traditional poetic devices';
  } else if (value < 50) {
    return 'blending traditional and contemporary poetic elements';
  } else if (value < 75) {
    return 'favoring modern sensibilities while incorporating classical elements';
  }
  return 'employing innovative and contemporary poetic techniques';
}

function mapLanguageVariety(value: number): string {
  if (value < 0.3) {
    return 'using clear, accessible language';
  } else if (value < 0.6) {
    return 'using moderately sophisticated vocabulary';
  } else if (value < 0.8) {
    return 'using rich, varied language';
  }
  return 'using complex, ornate vocabulary and sophisticated expressions';
}

function mapLength(length: PoemLength): number {
  const lengthMap: Record<PoemLength, number> = {
    'short': 100,
    'medium': 200,
    'long': 300
  };
  return lengthMap[length];
}

// Transform Parameters
function transformParams(frontendParams: FrontendParams): BackendParams {
  const styleParams = mapStyle(frontendParams.style);
  const nameMatch = frontendParams.userPrompt.match(/about\s+(?:my love lady,?\s+)?(\w+)/i);
  const name = nameMatch ? nameMatch[1] : "";
  
  const enhancedPrompt = `Create a poem ${styleParams.structure}, \
${mapEmotionalTone(frontendParams.emotionalTone)}, \
${mapCreativeStyle(frontendParams.creativeStyle)}, \
${mapLanguageVariety(frontendParams.languageVariety)}${name ? `, dedicated to ${name}` : ""}. \
Theme and context: ${frontendParams.userPrompt}`;

  return {
    prompt: enhancedPrompt,
    max_length: mapLength(frontendParams.length),
    temperature: styleParams.temperature,
    top_k: 30,
    top_p: styleParams.top_p,
    repetition_penalty: frontendParams.wordRepetition
  };
}

// Validation Function
async function validateWithGemini(params: PoemValidationRequest): Promise<ValidationResponse> {
  try {
    const validationPrompt = `
    Analyze this poem and verify if it matches these requirements:
    1. Style: ${params.originalParams.style}
    2. Emotional tone: ${params.originalParams.emotionalTone}
    3. Creative style level: ${params.originalParams.creativeStyle}/100
    4. Language variety level: ${params.originalParams.languageVariety}
    5. Requested length: ${params.originalParams.length}
    
    Poem to analyze:
    ${params.poem}
    
    Return response in this JSON format:
    {
      "isValid": boolean,
      "feedback": {
        "styleMatch": boolean,
        "toneMatch": boolean,
        "lengthMatch": boolean,
        "suggestions": "string with specific improvements if needed"
      },
      "reformattedPoem": "only if the original doesn't match requirements"
    }`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings,
    });

    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const validation = JSON.parse(text) as ValidationResponse;
    return validation;
  } catch (error) {
    console.error("Validation error:", error);
    return {
      isValid: true, // Fail open to avoid blocking poem delivery
      feedback: {
        styleMatch: true,
        toneMatch: true,
        lengthMatch: true,
        suggestions: "Validation service unavailable"
      }
    };
  }
}

// Main Generation Function
async function generatePoem(params: FrontendParams): Promise<GenerationResponse> {
  try {
    const backendParams = transformParams(params);
    
    const response = await fetch(`${process.env.SERVER_URI}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as { generate_poem: string };
    
    // Validate the generated poem
    const validationResult = await validateWithGemini({
      poem: data.generate_poem,
      originalParams: params,
      backendParams: backendParams
    });

    // Use the reformatted poem if validation failed
    const finalPoem = validationResult.isValid ? 
      data.generate_poem : 
      validationResult.reformattedPoem || data.generate_poem;

    return {
      poem: finalPoem,
      validationFeedback: validationResult.feedback
    };
  } catch (error) {
    console.error("Error generating poem:", error);
    throw new Error("Failed to generate poem. Please try again later.");
  }
}

// API Route Handlers
export async function POST(request: Request) {
  try {
    const body = await request.json() as FrontendParams;
    const result = await generatePoem(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to generate poem" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}