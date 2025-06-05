import { createApp } from 'vue'
import { settings } from './store/settings'
import './style.css'
import App from './App.vue'
import router from './router' // Import the router

// Initialize settings on app startup
settings;

const app = createApp(App)

app.use(router) // Tell the app to use the router

// Error handling
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, 'in', info);
};

// Mount app with error handling for IPC
app.mount('#app').$nextTick(() => {
  // Use contextBridge if available
  if (window.ipcRenderer) {
    window.ipcRenderer.on('main-process-message', (_event, message) => {
      console.log(message)
    })
  }
})
