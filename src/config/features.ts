import { defineAsyncComponent } from 'vue';
import type { Feature } from '../types';

export const features: readonly Feature[] = [
  {
    id: 'translator',
    name: 'Translator',
    path: '/',
    component: defineAsyncComponent(() => import('../components/TranslatorComponent.vue')),
  },
  {
    id: 'writing-assistant',
    name: 'Writing Assistant',
    path: '/writing-assistant',
    component: defineAsyncComponent(() => import('../components/WritingAssistantComponent.vue')),
  },
  {
    id: 'character-calculator',
    name: 'Character Counter', 
    path: '/character-calculator',
    component: defineAsyncComponent(() => import('../components/CharacterCalculatorComponent.vue')),
  },
];

export function getFeatureByPath(path: string): Feature | undefined {
  return features.find((feature) => feature.path === path);
}

export function getFeatureById(id: string): Feature | undefined {
  return features.find((feature) => feature.id === id);
} 