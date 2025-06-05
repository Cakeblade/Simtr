<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from './components/AppSidebar.vue';
import { settings } from './store/settings';
import { DEFAULT_SETTINGS } from './config/constants';
import type { AIModel } from './types';

const route = useRoute();

// State managed by App, potentially passed to Sidebar or Views
const featureText = ref('');
const selectedModel = ref<AIModel>(
  settings.provider === 'Gemini' ? DEFAULT_SETTINGS.MODEL : 'gpt-4'
);
const writingStyle = ref('');

// Compute whether the sidebar should be shown
const showSidebar = computed(() => route.path !== '/settings');

// Watch for changes in the settings store's provider and update the default model
watch(() => settings.provider, (newProvider) => {
  if (newProvider === 'Gemini') {
    selectedModel.value = DEFAULT_SETTINGS.MODEL; 
  } else if (newProvider === 'OpenAI') {
    selectedModel.value = 'gpt-4'; 
  } else {
    selectedModel.value = DEFAULT_SETTINGS.MODEL; // Default fallback
  }
});

function updateFeature(feature: string): void {
  featureText.value = feature;
}

function updateModel(model: AIModel): void {
  selectedModel.value = model;
}

function updateWritingStyle(style: string): void {
  writingStyle.value = style;
}
</script>

<template>
  <div id="app-layout">
    <AppSidebar
      v-show="showSidebar"
      :initial-model="selectedModel"
      @update:feature="updateFeature"
      @update:model="updateModel"
      @update:writingStyle="updateWritingStyle"
    />
    <main class="main-content">
      <router-view 
        :feature="featureText" 
        :model="selectedModel"
        :writing-style="writingStyle"
        @update:feature="updateFeature" 
        @update:model="updateModel"
        @update:writingStyle="updateWritingStyle"
      />
    </main>
  </div>
</template>

<style scoped>
#app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevent double scrollbars */
}

.main-content {
  flex-grow: 1;
  overflow-y: auto; 
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Ensure router-view itself can grow */
:deep(.translator-view),
:deep(.settings-view) {
  flex-grow: 1;
  width: 100%; /* Ensure view takes full width */
}

</style>
