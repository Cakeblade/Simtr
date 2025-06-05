<script setup lang="ts">
import { ref } from 'vue';
import { settings, saveSettings } from '../store/settings';

const aiProviders = ['Gemini'] as const; // Add more providers as needed

// Use refs that are initially synced with the store, but allow local editing before saving.
// This prevents saving incomplete input directly to the store via v-model.
const localSelectedProvider = ref(settings.provider);
const localApiKey = ref(settings.apiKey || '');
const localEnableLogging = ref(settings.enableLogging);
const showSuccessMessage = ref(false);

async function handleSave(): Promise<void> {
  try {
    // Update the store with the local values
    settings.provider = localSelectedProvider.value;
    settings.apiKey = localApiKey.value;
    settings.enableLogging = localEnableLogging.value;
    
    // Call the store's save function
    await saveSettings();
    
    // Show success message
    showSuccessMessage.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  } catch (error) {
    console.error('Failed to save settings:', error);
    // You could add error message display here if needed
  }
}

function resetToDefaults(): void {
  localSelectedProvider.value = 'Gemini';
  localApiKey.value = '';
  localEnableLogging.value = false;
}
</script>

<template>
  <div class="settings-container">
    <header class="settings-header">
      <h2>Settings</h2>
      <p class="settings-description">
        Configure your AI provider and API settings for the application.
      </p>
    </header>

    <main class="settings-form">
      <div class="form-group">
        <label for="ai-provider" class="form-label">AI Provider:</label>
        <select 
          id="ai-provider" 
          v-model="localSelectedProvider"
          class="form-select"
        >
          <option 
            v-for="provider in aiProviders" 
            :key="provider" 
            :value="provider"
          >
            {{ provider }}
          </option>
        </select>
        <p class="field-description">
          Select the AI provider for translation services.
        </p>
      </div>

      <div class="form-group">
        <label for="api-key" class="form-label">API Key:</label>
        <input 
          id="api-key"
          v-model="localApiKey" 
          type="password" 
          placeholder="Enter your API key"
          class="form-input"
        />
        <p class="field-description">
          Your API key will be stored locally and used for authentication.
        </p>
      </div>

      <div class="form-group">
        <div class="checkbox-group">
          <input 
            id="enable-logging"
            v-model="localEnableLogging" 
            type="checkbox"
            class="form-checkbox"
          />
          <label for="enable-logging" class="form-label checkbox-label">
            Enable Logging
          </label>
        </div>
        <p class="field-description">
          When enabled, all application logs will be collected and saved to a file when the program exits. Logs are saved in the logs folder next to the executable.
        </p>
      </div>

      <div class="form-actions">
        <button 
          type="button"
          class="btn btn-secondary"
          @click="resetToDefaults"
        >
          Reset to Defaults
        </button>
        <button 
          type="button"
          class="btn btn-primary"
          @click="handleSave"
        >
          Save Settings
        </button>
      </div>

      <div 
        v-if="showSuccessMessage"
        class="success-message"
        role="alert"
        aria-live="polite"
      >
        Settings saved successfully!
      </div>
    </main>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.settings-header {
  margin-bottom: 2rem;
  text-align: center;
}

.settings-header h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.75rem;
  font-weight: 600;
}

.settings-description {
  margin: 0;
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  margin: 0;
  cursor: pointer;
}

.form-select,
.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-checkbox {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.form-select:focus,
.form-input:focus,
.form-checkbox:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.field-description {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
  min-width: 120px;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.success-message {
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .settings-container {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 