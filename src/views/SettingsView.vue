<script setup lang="ts">
import SettingsComponent from '../components/SettingsComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function closeSettings(): void {
  router.back(); // Go back to the previous page (likely the Translator view)
}
</script>

<template>
  <div class="settings-view">
    <button 
      type="button"
      class="close-btn" 
      title="Close Settings"
      @click="closeSettings"
    >
      <!-- Close Icon SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
    <SettingsComponent />
  </div>
</template>

<style scoped>
.settings-view {
  padding: 1rem;
  flex-grow: 1;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  color: #888;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.close-btn svg {
  display: block;
}

.close-btn:hover {
  color: #333;
}

.close-btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style> 