<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { useRoute } from 'vue-router';
import { getFeatureByPath } from '../config/features';
import type { AIModel } from '../types';

// Define props to receive from App.vue
interface Props {
  readonly feature?: string;
  readonly model?: AIModel;
  readonly writingStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  feature: '',
  model: 'gemini-2.0-flash',
  writingStyle: '',
});

const route = useRoute();

// Get the current feature based on the route
const currentFeature = computed(() => {
  return getFeatureByPath(route.path);
});

// Get the component to render
const featureComponent = computed(() => {
  return currentFeature.value?.component;
});
</script>

<template>
  <div class="feature-view">
    <component 
      :is="featureComponent" 
      v-if="featureComponent"
      :feature="props.feature"
      :model="props.model"
      :writing-style="props.writingStyle"
    />
    <div v-else class="feature-not-found">
      <h2>Feature not found</h2>
      <p>The requested feature could not be loaded.</p>
      <router-link to="/" class="back-link">
        Go back to home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.feature-view {
  flex-grow: 1; /* Allow the view to take remaining space */
  display: flex; /* Ensure feature component takes full height */
  flex-direction: column;
  height: 100%; /* Ensure view takes full height */
}

.feature-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
  padding: 2rem;
}

.feature-not-found h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem;
}

.feature-not-found p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.back-link {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.back-link:hover {
  background-color: #0056b3;
}

.back-link:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style> 