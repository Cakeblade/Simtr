<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { marked } from 'marked';
import { useEnhanceService } from '../composables/useEnhanceService';
import LoadingSpinner from './LoadingSpinner.vue';
import { UI_CONSTANTS } from '../config/constants';
import type { SupportedLanguage, AIModel } from '../types';

// Define the props with validation
interface Props {
  readonly writingStyle?: string;
  readonly model: AIModel;
}

const props = withDefaults(defineProps<Props>(), {
  writingStyle: '',
});

const inputMessage = ref('');
const enhancedMessage = ref('');
const isLoading = ref(false);
const showCopyConfirmation = ref(false);
const errorMessage = ref('');

const { enhance } = useEnhanceService();

async function handleEnhancement(): Promise<void> {
  if (!inputMessage.value.trim()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  enhancedMessage.value = '';

  try {
    const result = await enhance({
      message: inputMessage.value,
      language: 'English',
      directive: props.writingStyle || 'Improve clarity, grammar, and flow while preserving the original meaning and tone.',
      model: props.model,
    });
    
    enhancedMessage.value = result;
  } catch (error: any) {
    errorMessage.value = error.message || 'Enhancement failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

async function copyToClipboard(): Promise<void> {
  if (!enhancedMessage.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(enhancedMessage.value);
    showCopyConfirmation.value = true;
    setTimeout(() => {
      showCopyConfirmation.value = false;
    }, UI_CONSTANTS.COPY_CONFIRMATION_DURATION);
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
}

function clearText(): void {
  inputMessage.value = '';
  enhancedMessage.value = '';
  errorMessage.value = '';
}
</script>

<template>
  <div class="writing-assistant-container">
    <header class="writing-assistant-header">
      <h2 class="header-title">AI Writing Assistant</h2>
      
      <div class="action-buttons">
        <button 
          type="button"
          :disabled="!inputMessage.trim() || isLoading"
          class="enhance-button"
          @click="handleEnhancement"
        >
          {{ isLoading ? 'Enhancing...' : 'Enhance' }}
        </button>
        
        <button 
          type="button"
          :disabled="!enhancedMessage"
          class="copy-button"
          @click="copyToClipboard"
        >
          Copy
        </button>

        <button 
          type="button"
          class="clear-button"
          @click="clearText"
        >
          Clear
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

    <main class="writing-assistant-content">
      <section class="input-section">
        <div class="input-card">
          <label for="input-message" class="section-label">
            Your Text
          </label>
          <textarea 
            id="input-message"
            v-model="inputMessage"
            placeholder="Enter your text to enhance..."
            class="input-field"
          />
        </div>
      </section>

      <section class="output-section">
        <div class="output-card">
          <label class="section-label">
            Enhanced Text
          </label>
          
          <LoadingSpinner v-if="isLoading" />
          
          <div 
            v-else-if="errorMessage"
            class="error-message"
            role="alert"
          >
            {{ errorMessage }}
          </div>
          
          <div 
            v-else-if="enhancedMessage"
            class="enhanced-content"
            v-html="marked(enhancedMessage)"
          />
          
          <div 
            v-else
            class="placeholder-text"
          >
            Enhanced text will appear here
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.writing-assistant-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.writing-assistant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  position: relative;
}

.header-title {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.enhance-button,
.copy-button,
.clear-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.enhance-button {
  background-color: #007bff;
  color: white;
}

.enhance-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.enhance-button:disabled {
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

.clear-button {
  background-color: #6c757d;
  color: white;
}

.clear-button:hover {
  background-color: #545b62;
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

.writing-assistant-content {
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
  display: flex;
  flex-direction: column;
}

.section-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.input-field {
  width: 100%;
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
}

.error-message {
  color: #dc3545;
  font-weight: 500;
}

.placeholder-text {
  color: #6c757d;
  font-style: italic;
}

.enhanced-content {
  line-height: 1.6;
  flex: 1;
}

/* Responsive design */
@media (max-width: 768px) {
  .writing-assistant-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .writing-assistant-content {
    flex-direction: column;
  }
  
  .action-buttons {
    justify-content: center;
  }
}
</style> 