<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { features } from '../config/features';
import { GEMINI_MODELS } from '../config/constants';
import type { AIModel } from '../types';

interface Props {
  readonly initialModel: AIModel;
}

interface Emits {
  (event: 'update:feature', value: string): void;
  (event: 'update:model', value: AIModel): void;
  (event: 'update:writingStyle', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isCollapsed = ref(false);
const featureText = ref('');
const selectedModel = ref<AIModel>(props.initialModel);
const writingStyle = ref('');

const router = useRouter();
const route = useRoute();

// Computed property to check if current route is translator
const isTranslatorRoute = computed(() => {
  return route.path === '/';
});

// Computed property to check if current route is writing assistant
const isWritingAssistantRoute = computed(() => {
  return route.path === '/writing-assistant';
});

function toggleSidebar(): void {
  isCollapsed.value = !isCollapsed.value;
}

function goToSettings(): void {
  router.push('/settings');
}

watch(featureText, (newValue) => {
  emit('update:feature', newValue);
});

watch(selectedModel, (newValue) => {
  emit('update:model', newValue);
});

watch(writingStyle, (newValue) => {
  emit('update:writingStyle', newValue);
});

watch(() => props.initialModel, (newValue) => {
  selectedModel.value = newValue;
});
</script>

<template>
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <header class="top-controls">
      <button 
        v-show="!isCollapsed" 
        type="button"
        class="settings-btn" 
        title="Settings"
        @click="goToSettings"
      >
        <!-- Gear Icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M19.46 11.14a1 1 0 0 0-1.1.06l-1.14 1.13a8.01 8.01 0 0 0-1.1-.35l-.32-1.47a1 1 0 0 0-.98-.81h-2.5a1 1 0 0 0-.98.81l-.32 1.47a8.01 8.01 0 0 0-1.1.35L8.78 11.2a1 1 0 0 0-1.1-.06 1 1 0 0 0-.56.9V13a1 1 0 0 0 .56.9 1 1 0 0 0 1.1-.06l1.14-1.13a8.01 8.01 0 0 0 1.1.35l.32 1.47a1 1 0 0 0 .98.81h2.5a1 1 0 0 0 .98-.81l.32-1.47a8.01 8.01 0 0 0 1.1-.35l1.14 1.13a1 1 0 0 0 1.1.06 1 1 0 0 0 .56-.9v-1a1 1 0 0 0-.56-.9zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
        </svg>
      </button>
      <button 
        type="button"
        class="toggle-btn"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleSidebar"
      >
        {{ isCollapsed ? '>' : '<' }}
      </button>
    </header>
    
    <div class="sidebar-content" v-show="!isCollapsed">
      <!-- Navigation Links -->
      <nav class="navigation">
        <router-link 
          v-for="feature in features" 
          :key="feature.id"
          :to="feature.path" 
          class="nav-link"
        >
          {{ feature.name }}
        </router-link>
      </nav>

      <!-- Translation Info - conditional -->
      <section v-if="isTranslatorRoute" class="feature-info">
        <h3>Translation Info</h3>
        
        <div class="form-group">
          <label for="model-select">Model</label>
          <select 
            id="model-select" 
            v-model="selectedModel" 
            class="model-select"
          >
            <option 
              v-for="model in GEMINI_MODELS" 
              :key="model" 
              :value="model"
            >
              {{ model }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="feature-input">Text Feature</label>
          <input 
            id="feature-input"
            v-model="featureText"
            type="text" 
            placeholder="feature"
            class="feature-input"
          />
        </div>
      </section>

      <!-- Writing Assistant Info - conditional -->
      <section v-if="isWritingAssistantRoute" class="feature-info">
        <h3>Writing Assistant</h3>
        
        <div class="form-group">
          <label for="writing-model-select">Model</label>
          <select 
            id="writing-model-select" 
            v-model="selectedModel" 
            class="model-select"
          >
            <option 
              v-for="model in GEMINI_MODELS" 
              :key="model" 
              :value="model"
            >
              {{ model }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="writing-style-input">Writing Style</label>
          <textarea 
            id="writing-style-input"
            v-model="writingStyle"
            placeholder="e.g., Academic, Casual, Professional, Creative..."
            class="writing-style-input"
            rows="3"
          />
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 250px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #1f1f1f;
  padding: 1rem;
  transition: width 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.87);
  overflow: hidden;
}

.app-sidebar.collapsed {
  width: 50px;
}

.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #444;
}

.app-sidebar.collapsed .top-controls {
  justify-content: center;
}

.settings-btn,
.toggle-btn {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.settings-btn svg {
  display: block;
}

.settings-btn:hover,
.toggle-btn:hover {
  color: #fff;
}

.settings-btn:focus,
.toggle-btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.toggle-btn {
  font-size: 1.5rem;
}

.sidebar-content {
  margin-top: 0;
  opacity: 1;
  transition: opacity 0.3s ease;
  overflow-y: auto;
  flex: 1;
}

.app-sidebar.collapsed .sidebar-content {
  opacity: 0;
  pointer-events: none;
}

.navigation {
  margin-bottom: 2rem;
  border-bottom: 1px solid #444;
  padding-bottom: 1rem;
}

.nav-link {
  display: block;
  padding: 0.75rem 0;
  color: #ccc;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background-color: #333;
  color: #fff;
}

.nav-link:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Style for the active link */
.router-link-exact-active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.feature-info {
  margin-top: 2rem;
  border-top: 1px solid #444;
  padding-top: 1rem;
}

.feature-info h3 {
  margin: 0 0 1rem 0;
  color: #ccc;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
}

.feature-input,
.model-select,
.writing-style-input {
  width: 100%;
  padding: 0.5rem;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #fff;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.writing-style-input {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.feature-input:focus,
.model-select:focus,
.writing-style-input:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  border-color: #007bff;
}

.feature-input::placeholder,
.writing-style-input::placeholder {
  color: #888;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-sidebar {
    width: 200px;
  }
  
  .app-sidebar.collapsed {
    width: 40px;
  }
}
</style> 