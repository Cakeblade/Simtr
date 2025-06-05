<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import { marked } from 'marked';
import { useTranslationService } from '../composables/useTranslationService';
import LanguageSelector from './LanguageSelector.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import { SUPPORTED_LANGUAGES, DEFAULT_SETTINGS, UI_CONSTANTS } from '../config/constants';
import type { SupportedLanguage, AIModel } from '../types';

// Define the props with validation
interface Props {
  readonly feature?: string;
  readonly model: AIModel;
}

const props = withDefaults(defineProps<Props>(), {
  feature: '',
});

const inputMessage = ref('');
const translatedMessage = ref('');
const isLoading = ref(false);
const fromLanguage = ref<SupportedLanguage>(DEFAULT_SETTINGS.FROM_LANGUAGE);
const toLanguage = ref<SupportedLanguage>(DEFAULT_SETTINGS.TO_LANGUAGE);
const showCopyConfirmation = ref(false);
const errorMessage = ref('');

const { translate } = useTranslationService();

async function handleTranslation(): Promise<void> {
  if (!inputMessage.value.trim()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  translatedMessage.value = '';

  try {
    const result = await translate({
      message: inputMessage.value,
      fromLanguage: fromLanguage.value,
      toLanguage: toLanguage.value,
      model: props.model,
      feature: props.feature || '',
    });
    
    translatedMessage.value = result;
  } catch (error: any) {
    errorMessage.value = error.message || 'Translation failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function swapLanguages(): void {
  const temp = fromLanguage.value;
  fromLanguage.value = toLanguage.value;
  toLanguage.value = temp;
}

// Watch for language changes to prevent same language selection
watch([fromLanguage, toLanguage], (newValues, oldValues) => {
  if (newValues[0] === newValues[1]) {
    if (newValues[0] !== oldValues[0]) {
      toLanguage.value = oldValues[0];
    } else if (newValues[1] !== oldValues[1]) {
      fromLanguage.value = oldValues[1];
    }
  }
});

async function copyToClipboard(): Promise<void> {
  if (!translatedMessage.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(translatedMessage.value);
    showCopyConfirmation.value = true;
    setTimeout(() => {
      showCopyConfirmation.value = false;
    }, UI_CONSTANTS.COPY_CONFIRMATION_DURATION);
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
}
</script>

<template>
  <div class="translator-container">
    <header class="translator-header">
      <LanguageSelector
        v-model:from-language="fromLanguage"
        v-model:to-language="toLanguage"
        :languages="SUPPORTED_LANGUAGES"
        @swap="swapLanguages"
      />
      
      <div class="action-buttons">
        <button 
          type="button"
          :disabled="!inputMessage.trim() || isLoading"
          class="translate-button"
          @click="handleTranslation"
        >
          {{ isLoading ? 'Translating...' : 'Translate' }}
        </button>
        
        <button 
          type="button"
          :disabled="!translatedMessage"
          class="copy-button"
          @click="copyToClipboard"
        >
          Copy
        </button>
      </div>
      
      <div 
        v-if="showCopyConfirmation" 
        class="copy-confirmation"
        aria-live="polite"
      >
        Copied to clipboard!
      </div>
    </header>

    <main class="translator-content">
      <section class="input-section">
        <div class="input-card">
          <label for="input-message" class="sr-only">
            Message to translate
          </label>
          <textarea 
            id="input-message"
            v-model="inputMessage"
            placeholder="Enter your message"
            class="input-field"
          />
        </div>
      </section>

      <section class="output-section">
        <div class="output-card">
          <LoadingSpinner v-if="isLoading" />
          
          <div 
            v-else-if="errorMessage"
            class="error-message"
            role="alert"
          >
            {{ errorMessage }}
          </div>
          
          <div 
            v-else-if="translatedMessage"
            class="translated-content"
            v-html="marked(translatedMessage)"
          />
          
          <div 
            v-else
            class="placeholder-text"
          >
            Translation will appear here
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.translator-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.translator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  position: relative;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.translate-button,
.copy-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.translate-button {
  background-color: #007bff;
  color: white;
}

.translate-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.translate-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.copy-button {
  background-color: #28a745;
  color: white;
}

.copy-button:hover:not(:disabled) {
  background-color: #1e7e34;
}

.copy-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.copy-confirmation {
  position: absolute;
  top: 100%;
  right: 1rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 1000;
}

.translator-content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.input-section,
.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-card,
.output-card {
  flex: 1;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  overflow-y: auto;
}

.input-field {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.error-message {
  color: #dc3545;
  font-weight: 500;
}

.placeholder-text {
  color: #6c757d;
  font-style: italic;
}

.translated-content {
  line-height: 1.6;
}

/* Responsive design */
@media (max-width: 768px) {
  .translator-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .translator-content {
    flex-direction: column;
  }
  
  .action-buttons {
    justify-content: center;
  }
}
</style> 