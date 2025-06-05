import axios from 'axios';
import { settings } from '../store/settings';
import { API_CONFIG } from '../config/constants';
import type { AIModel } from '../types';

export interface EnhanceRequest {
  readonly message: string;
  readonly language: string;
  readonly directive: string;
  readonly model: AIModel;
}

export interface EnhanceResponse {
  readonly message: string;
}

export function useEnhanceService() {
  async function enhance(request: EnhanceRequest): Promise<string> {
    if (!settings.apiKey) {
      throw new Error('API Key is not set. Please configure it in Settings.');
    }

    if (!request.message.trim()) {
      throw new Error('Message cannot be empty.');
    }

    try {
      const requestBody = {
        msg: request.message,
        language: request.language,
        directive: request.directive,
        model: request.model,
        provider: settings.provider,
        apiKey: settings.apiKey,
      };

      const response = await axios.post<EnhanceResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENHANCE}`, 
        requestBody
      );

      return response.data.message || 'No message received.';
    } catch (error: any) {
      console.error('Enhancement Error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.details || 
                           error.response.data?.error || 
                           'Enhancement failed.';
        throw new Error(`Error: ${errorMessage}`);
      } else {
        throw new Error('Error: Enhancement failed. Check network connection.');
      }
    }
  }

  return {
    enhance,
  };
} 