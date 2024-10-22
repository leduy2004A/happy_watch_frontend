/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import mitt from 'mitt'
import Toast from "vue-toastification";
const options = {
    // You can set your default options here
};

// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import router from './router/router'

const app = createApp(App)
import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)
const emitter = mitt()
registerPlugins(app)
app.config.globalProperties.emitter = emitter;
app.use(Toast,options)
app.use(router)
app.mount('#app')
``