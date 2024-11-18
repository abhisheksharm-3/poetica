export interface PoemFormData {
    style: string;
    emotionalTone: string;
    creativeStyle: number;
    languageVariety: number;
    length: string;
    wordRepetition: number;
    content?: string;
  }
  
  export interface SavedPoem extends PoemFormData {
    id: string;
    createdAt: string;
    content: string;
  }
  
  export interface SharedPoem extends SavedPoem {
    shareId: string;
    sharedAt: string;
  }

  export interface PoemFormState {
    style: string;
    emotionalTone: string;
    creativeStyle: number;
    languageVariety: number;
    length: string;
    wordRepetition: number;
  }
  export type PoemStyle = "sonnet" | "haiku" | "free-verse" | "villanelle";
export type EmotionalTone = "contemplative" | "joyful" | "melancholic" | "romantic";
export type PoemLength = "short" | "medium" | "long";
export interface PoemValidationRequest {
  poem: string;
  originalParams: FrontendParams;
  backendParams: BackendParams;
}
export interface FrontendParams {
  userPrompt: string;
  style: PoemStyle;
  emotionalTone: EmotionalTone;
  creativeStyle: number;
  languageVariety: number;
  length: PoemLength;
  wordRepetition: number;
}

export interface BackendParams {
  prompt: string;
  max_length: number;
  temperature: number;
  top_k: number;
  top_p: number;
  repetition_penalty: number;
}

export interface PoemApiResponse {
  poem: {
    title: string;
    lines: string[];
    style: string;
  };
  original_prompt: string;
  parameters: {
    max_length: number;
    temperature: number;
    top_k: number;
    top_p: number;
    repetition_penalty: number;
  };
  metadata: {
    device: string;
    model_type: string;
    timestamp: string;
  };
}

export interface ValidationFeedback {
  styleMatch: boolean;
  toneMatch: boolean;
  lengthMatch: boolean;
  suggestions?: string;
}

export interface ValidationResponse {
  isValid: boolean;
  feedback: ValidationFeedback;
  reformattedPoem?: string;
}

export interface GenerationResponse {
  poem: {
    title: string;
    content: string;
    lines: string[];
  };
  validationFeedback?: ValidationFeedback;
  metadata?: {
    timestamp: string;
    model_type: string;
  };
}