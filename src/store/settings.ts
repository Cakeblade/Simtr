import { reactive } from 'vue';
import type { AppSettings, AIProvider } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../config/constants';

// Declare global electronAPI interface
declare global {
  interface Window {
    electronAPI?: {
      updateLoggingSettings: (enableLogging: boolean) => Promise<boolean>;
      getLogFilePath: () => Promise<string>;
    };
  }
}

// Initialize state with values from localStorage or defaults
const initialState: AppSettings = {
  provider: (localStorage.getItem(STORAGE_KEYS.PROVIDER) as AIProvider) || DEFAULT_SETTINGS.PROVIDER,
  apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || null,
  enableLogging: localStorage.getItem(STORAGE_KEYS.ENABLE_LOGGING) === 'true' || DEFAULT_SETTINGS.ENABLE_LOGGING,
};

export const settings = reactive<AppSettings>(initialState);

// Function to save settings to localStorage
export async function saveSettings(): Promise<void> {
  if (settings.provider) {
    localStorage.setItem(STORAGE_KEYS.PROVIDER, settings.provider);
  }
  if (settings.apiKey) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, settings.apiKey);
  } else {
    // Clear the key if it's empty
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  }
  
  localStorage.setItem(STORAGE_KEYS.ENABLE_LOGGING, String(settings.enableLogging));
  
  // Update logging settings in main process if electronAPI is available
  if (window.electronAPI?.updateLoggingSettings) {
    try {
      await window.electronAPI.updateLoggingSettings(settings.enableLogging);
      console.log('Logging settings updated in main process');
    } catch (error) {
      console.error('Failed to update logging settings in main process:', error);
    }
  }
  
  console.log('Settings saved to localStorage', settings);
}

// Optional: Watch for changes and auto-save (can be removed if only manual save is desired)
// watch(settings, () => {
//   saveSettings();
// }, { deep: true });

// Function to load settings (might be redundant if initialState handles it, but good for explicit reload)
export async function loadSettings(): Promise<void> {
  settings.provider = (localStorage.getItem(STORAGE_KEYS.PROVIDER) as AIProvider) || DEFAULT_SETTINGS.PROVIDER;
  settings.apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || null;
  settings.enableLogging = localStorage.getItem(STORAGE_KEYS.ENABLE_LOGGING) === 'true' || DEFAULT_SETTINGS.ENABLE_LOGGING;
  
  // Update logging settings in main process if electronAPI is available
  if (window.electronAPI?.updateLoggingSettings) {
    try {
      await window.electronAPI.updateLoggingSettings(settings.enableLogging);
      console.log('Logging settings synchronized with main process');
    } catch (error) {
      console.error('Failed to synchronize logging settings with main process:', error);
    }
  }
  
  console.log('Settings loaded from localStorage', settings);
}

// Initial load and sync with main process
loadSettings(); 