# Adding New Features

To add a new feature to the application, you only need to:

## 1. Create Your Component

Create your new component in `src/components/`. For example:

```vue
<!-- src/components/MyNewFeature.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  feature: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    required: false
  }
});

// Your component logic here
</script>

<template>
  <div class="container">
    <!-- Your component template here -->
  </div>
</template>

<style scoped>
/* Your component styles here */
</style>
```

## 2. Add Feature to Configuration

Add your feature to the `features` array in `src/config/features.ts`:

```typescript
export const features: Feature[] = [
  // ... existing features
  {
    id: 'mynewfeature',
    name: 'My New Feature',
    path: '/mynewfeature',
    component: defineAsyncComponent(() => import('../components/MyNewFeature.vue'))
  }
];
```

## That's it!

The feature will automatically:
- ✅ Appear in the sidebar navigation
- ✅ Have its route created automatically  
- ✅ Be accessible via the specified path
- ✅ Receive props from the App component
- ✅ Follow the same layout patterns as other features

## Feature Configuration Properties

- `id`: Unique identifier for the feature
- `name`: Display name shown in the sidebar
- `path`: URL path for the feature
- `component`: Lazy-loaded Vue component
- `icon`: (Optional) Icon for the feature

## Best Practices

1. Use consistent styling with existing components
2. Follow the same container structure for layout consistency
3. Accept `feature` and `model` props for consistency
4. Use lazy loading with `defineAsyncComponent()` for better performance 