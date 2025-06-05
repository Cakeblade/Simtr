import axios from 'axios';
import { settings } from '../store/settings';
import { API_CONFIG } from '../config/constants';
import type { TranslationRequest, TranslationResponse } from '../types';

export function useTranslationService() {
  async function translate(request: TranslationRequest): Promise<string> {
    if (!settings.apiKey) {
      throw new Error('API Key is not set. Please configure it in Settings.');
    }

    if (!request.message.trim()) {
      throw new Error('Message cannot be empty.');
    }

    try {
      const requestBody = {
        msg: request.message,
        addinst: request.feature,
        start: request.fromLanguage,
        destination: request.toLanguage,
        model: request.model,
        provider: settings.provider,
        apiKey: settings.apiKey,
      };

      const response = await axios.post<TranslationResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_MESSAGE}`, 
        requestBody
      );

      return response.data.message || 'No message received.';
    } catch (error: any) {
      console.error('Translation Error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.details || 
                           error.response.data?.error || 
                           'Translation failed.';
        throw new Error(`Error: ${errorMessage}`);
      } else {
        throw new Error('Error: Translation failed. Check network connection.');
      }
    }
  }

  return {
    translate,
  };
} 