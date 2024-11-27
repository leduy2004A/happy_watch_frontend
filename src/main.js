/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import mitt from "mitt";
import Toast from "vue-toastification";
import PrimeVue from "primevue/config";
const options = {
  // You can set your default options here
};

// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { LoadingPlugin } from "vue-loading-overlay";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import "vue-loading-overlay/dist/css/index.css";
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import router from "./router/router";
import Aura from '@primevue/themes/aura';
const app = createApp(App);
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);
const emitter = mitt();
registerPlugins(app);
app.config.globalProperties.emitter = emitter;
app.use(Toast, options);
app.use(VueSweetalert2);
app.use(LoadingPlugin);
app.use(router);
app.use(PrimeVue,{
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }});
app.mount("#app");
