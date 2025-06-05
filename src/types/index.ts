// Common language types
export type SupportedLanguage = 
  | 'English'
  | 'Korean'
  | 'Japanese'
  | 'Chinese'
  | 'Spanish'
  | 'French'
  | 'German';

// AI Model types
export type GeminiModel = 
  | 'gemini-2.5-flash-preview-04-17'
  | 'gemini-2.5-pro-preview-05-06'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-lite'
  | 'gemini-2.0-flash-thinking-exp-01-21'
  | 'gemini-1.5-flash-latest'
  | 'gemini-1.5-pro-latest';

export type OpenAIModel = 'gpt-4' | 'gpt-3.5-turbo';

export type AIModel = GeminiModel | OpenAIModel;

// Provider types
export type AIProvider = 'Gemini' | 'OpenAI';

// Feature related types
export interface Feature {
  readonly id: string;
  readonly name: string;
  readonly path: string;
  readonly component: any;
  readonly icon?: string;
}

// Settings related types
export interface AppSettings {
  provider: AIProvider | null;
  apiKey: string | null;
  enableLogging: boolean;
}

// Translation request/response types
export interface TranslationRequest {
  readonly message: string;
  readonly fromLanguage: SupportedLanguage;
  readonly toLanguage: SupportedLanguage;
  readonly model: AIModel;
  readonly feature: string;
}

export interface TranslationResponse {
  readonly message: string;
}

// Router related types
export interface RouteFeature {
  readonly path: string;
  readonly name: string;
  readonly component: any;
} 