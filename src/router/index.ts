import { createRouter, createWebHistory } from 'vue-router';
import FeatureView from '../views/FeatureView.vue';
import SettingsView from '../views/SettingsView.vue';
import { features } from '../config/features';

// Dynamically generate routes from features configuration
const featureRoutes = features.map((feature) => ({
  path: feature.path,
  name: feature.name,
  component: FeatureView,
}));

const routes = [
  ...featureRoutes,
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 