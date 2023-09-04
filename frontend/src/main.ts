import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCircleXmark} from "@fortawesome/free-regular-svg-icons";
import {useEventStore} from "@/stores/eventstore";
import type {Session} from "@ory/client";



const app = createApp(App)
const pinia = createPinia();


library.add(faCircleXmark)

app.use(router);
app.use(pinia);

const eventStore = useEventStore()

app.mount('#app')

