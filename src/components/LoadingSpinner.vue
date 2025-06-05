<script setup lang="ts">
interface Props {
  readonly size?: 'small' | 'medium' | 'large';
  readonly color?: string;
  readonly message?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: '#007bff',
  message: 'Loading...',
});
</script>

<template>
  <div class="loading-container" role="status" :aria-label="message">
    <div 
      class="loading-spinner" 
      :class="`spinner-${size}`"
      :style="{ borderTopColor: color }"
    />
    <div v-if="message" class="loading-message">
      {{ message }}
    </div>
    <span class="sr-only">{{ message }}</span>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner-medium {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border-width: 6px;
}

.loading-message {
  font-size: 0.9rem;
  color: #6c757d;
  text-align: center;
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

@keyframes spin {
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
}
</style> 