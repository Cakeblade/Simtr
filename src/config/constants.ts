import type { SupportedLanguage, GeminiModel, AIProvider } from '../types';

// Supported languages for translation
export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  'English',
  'Korean',
  'Japanese',
  'Chinese',
  'Spanish',
  'French',
  'German',
] as const;

// Available AI models
export const GEMINI_MODELS: readonly GeminiModel[] = [
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.5-pro-preview-05-06',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-thinking-exp-01-21',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
] as const;

// Supported AI providers
export const AI_PROVIDERS: readonly AIProvider[] = ['Gemini'] as const;

// Default settings
export const DEFAULT_SETTINGS = {
  PROVIDER: 'Gemini' as AIProvider,
  MODEL: 'gemini-2.0-flash' as GeminiModel,
  FROM_LANGUAGE: 'English' as SupportedLanguage,
  TO_LANGUAGE: 'Korean' as SupportedLanguage,
  ENABLE_LOGGING: false,
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:51763',
  ENDPOINTS: {
    SEND_MESSAGE: '/api/sendmessage',
    ENHANCE: '/api/enhance',
  },
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  PROVIDER: 'simtr_ai_provider',
  API_KEY: 'simtr_api_key',
  ENABLE_LOGGING: 'simtr_enable_logging',
} as const;

// UI constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: {
    EXPANDED: 250,
    COLLAPSED: 50,
  },
  COPY_CONFIRMATION_DURATION: 2000,
  SUCCESS_MESSAGE_DURATION: 3000,
} as const; 