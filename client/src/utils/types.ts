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
  