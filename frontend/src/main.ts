import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCircleXmark} from "@fortawesome/free-regular-svg-icons";
import {logoutUrl, ory, session} from "@/auth/auth";

import "vue-toastification/dist/index.css"
import type {PluginOptions} from "vue-toastification/dist/types/types";
import VueToastificationPlugin, {POSITION} from "vue-toastification";
import {faArrowLeft, faArrowRight, faCheck, faMinus, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";

export const vercelEnv = import.meta.env.VITE_VERCEL_ENV
const app = createApp(App)
const pinia = createPinia();

const options : PluginOptions = {
    transition: "Vue-Toastification__fade",
    position: POSITION.BOTTOM_RIGHT,
    maxToasts: 20,
}

library.add(faCircleXmark, faXmark, faPlus, faMinus, faCheck, faArrowLeft, faArrowRight)


app.use(router);
app.use(pinia);
app.use(VueToastificationPlugin, options)

app.mount('#app')
