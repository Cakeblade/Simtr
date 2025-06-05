<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

const inputText = ref('');

// Helper function to calculate byte length with Korean characters as 2 bytes
async function getByteLength(str: string): Promise<number> {
  const characters = Array.from(str);
  
  const byteLengths = await Promise.all(
    characters.map(async (char) => {
      const code = char.charCodeAt(0);
      
      // Korean characters (Hangul syllables: U+AC00–U+D7AF)
      if (code >= 0xAC00 && code <= 0xD7AF) {
        return 2;
      }
      // Korean Jamo (U+1100–U+11FF, U+3130–U+318F)
      else if ((code >= 0x1100 && code <= 0x11FF) || (code >= 0x3130 && code <= 0x318F)) {
        return 2;
      }
      // ASCII characters
      else if (code <= 0x7F) {
        return 1;
      }
      // Other multibyte characters (use UTF-8 encoding)
      else {
        return new TextEncoder().encode(char).length;
      }
    })
  );
  
  return byteLengths.reduce((total, bytes) => total + bytes, 0);
}

// Computed properties for different character counts
const totalCharacters = computed(() => inputText.value.length);
const charactersWithoutLineBreaks = computed(() => inputText.value.replace(/[\n\r]/g, '').length);
const charactersWithoutSpaces = computed(() => inputText.value.replace(/ /g, '').length);
const charactersWithoutSpacesAndLineBreaks = computed(() => inputText.value.replace(/ /g, '').replace(/[\n\r]/g, '').length);
const wordCount = computed(() => {
  if (!inputText.value.trim()) return 0;
  return inputText.value.trim().split(/\s+/).length;
});

// Byte calculations using reactive refs for async operations
const totalBytes = ref(0);
const bytesWithoutLineBreaks = ref(0);
const bytesWithoutSpaces = ref(0);
const bytesWithoutSpacesAndLineBreaks = ref(0);

// Update byte calculations when input text changes
watchEffect(async () => {
  const text = inputText.value;
  
  // Calculate all byte lengths in parallel
  const [
    total,
    withoutLineBreaks,
    withoutSpaces,
    withoutSpacesAndLineBreaks
  ] = await Promise.all([
    getByteLength(text),
    getByteLength(text.replace(/[\n\r]/g, '')),
    getByteLength(text.replace(/ /g, '')),
    getByteLength(text.replace(/ /g, '').replace(/[\n\r]/g, ''))
  ]);
  
  totalBytes.value = total;
  bytesWithoutLineBreaks.value = withoutLineBreaks;
  bytesWithoutSpaces.value = withoutSpaces;
  bytesWithoutSpacesAndLineBreaks.value = withoutSpacesAndLineBreaks;
});

function clearText(): void {
  inputText.value = '';
}

async function copyToClipboard(): Promise<void> {
  if (inputText.value) {
    try {
      await navigator.clipboard.writeText(inputText.value);
      // Could add a confirmation message here like in Translator
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }
}
</script>

<template>
  <div class="character-calculator-container">
    <div class="input-section">
      <header class="header-section">
        <h2>Character Counter</h2>
        <div class="action-buttons">
          <button 
            type="button"
            class="clear-button"
            @click="clearText"
          >
            Clear
          </button>
          <button 
            type="button"
            class="copy-button" 
            :disabled="!inputText"
            @click="copyToClipboard"
          >
            Copy Text
          </button>
        </div>
      </header>
      
      <div class="input-card">
        <label for="character-input" class="sr-only">
          Text to analyze
        </label>
        <textarea 
          id="character-input"
          v-model="inputText" 
          placeholder="Enter your text here to count characters..."
          class="input-field"
        />
      </div>
    </div>
    
    <aside class="stats-card">
      <h3>Statistics</h3>
      <div class="stats-grid">
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">{{ totalCharacters }}</div>
            <div class="stat-label">Total Characters</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ totalBytes }}</div>
            <div class="stat-label">Total Bytes</div>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">{{ charactersWithoutLineBreaks }}</div>
            <div class="stat-label">Characters (no line breaks)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ bytesWithoutLineBreaks }}</div>
            <div class="stat-label">Bytes (no line breaks)</div>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">{{ charactersWithoutSpaces }}</div>
            <div class="stat-label">Characters (no spaces)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ bytesWithoutSpaces }}</div>
            <div class="stat-label">Bytes (no spaces)</div>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">{{ charactersWithoutSpacesAndLineBreaks }}</div>
            <div class="stat-label">Characters (no spaces/line breaks)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ bytesWithoutSpacesAndLineBreaks }}</div>
            <div class="stat-label">Bytes (no spaces/line breaks)</div>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item full-width">
            <div class="stat-value">{{ wordCount }}</div>
            <div class="stat-label">Words</div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.character-calculator-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  min-width: 0;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  flex-shrink: 0;
}

.header-section h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.clear-button,
.copy-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.clear-button {
  background-color: #dc3545;
  color: white;
}

.clear-button:hover {
  background-color: #c82333;
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

.input-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  min-height: 0;
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

.stats-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
}

.stats-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-row {
  display: flex;
  gap: 1rem;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.stat-item.full-width {
  flex-basis: 100%;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  line-height: 1.2;
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

/* Responsive design */
@media (max-width: 768px) {
  .character-calculator-container {
    flex-direction: column;
  }
  
  .header-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .stats-row {
    flex-direction: column;
  }
}
</style> 