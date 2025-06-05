<script setup lang="ts">
interface Props {
  readonly fromLanguage: string;
  readonly toLanguage: string;
  readonly languages: readonly string[];
}

interface Emits {
  (event: 'update:fromLanguage', value: string): void;
  (event: 'update:toLanguage', value: string): void;
  (event: 'swap'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function handleFromLanguageChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  emit('update:fromLanguage', target.value);
}

function handleToLanguageChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  emit('update:toLanguage', target.value);
}

function handleSwap(): void {
  emit('swap');
}
</script>

<template>
  <div class="language-selector">
    <div class="language-dropdowns">
      <label for="from-language" class="sr-only">
        From language
      </label>
      <select 
        id="from-language"
        :value="fromLanguage"
        class="language-select"
        @change="handleFromLanguageChange"
      >
        <option 
          v-for="language in languages" 
          :key="`from-${language}`" 
          :value="language"
        >
          {{ language }}
        </option>
      </select>
      
      <button 
        type="button"
        class="swap-button" 
        title="Swap languages"
        @click="handleSwap"
      >
        <span class="swap-arrow">⇄</span>
      </button>
      
      <label for="to-language" class="sr-only">
        To language
      </label>
      <select 
        id="to-language"
        :value="toLanguage"
        class="language-select"
        @change="handleToLanguageChange"
      >
        <option 
          v-for="language in languages" 
          :key="`to-${language}`" 
          :value="language"
        >
          {{ language }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
}

.language-dropdowns {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  min-width: 120px;
}

.language-select:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.swap-button {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
}

.swap-button:hover {
  background-color: #f8f9fa;
}

.swap-button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.swap-arrow {
  font-weight: bold;
  color: #007bff;
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
</style> 