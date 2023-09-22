import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCircleXmark} from "@fortawesome/free-regular-svg-icons";
import {useEventStore} from "@/stores/eventstore";
import {logoutUrl, ory, session} from "@/auth/auth";

import "vue-toastification/dist/index.css"
import type {PluginOptions} from "vue-toastification/dist/types/types";
import VueToastificationPlugin, {POSITION} from "vue-toastification";
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";


const app = createApp(App)
const pinia = createPinia();

const options : PluginOptions = {
    transition: "Vue-Toastification__fade",
    position: POSITION.BOTTOM_RIGHT,
    maxToasts: 20,
}

library.add(faCircleXmark, faXmark, faPlus)

router.beforeEach(async (to, from) => {
    if (session.value == undefined) {
        try {
            let result = await ory.toSession()
            session.value = result.data

            ory.createBrowserLogoutFlow({returnTo: window.location.origin}).then(({data}) => {
                logoutUrl.value = data.logout_url.replace("https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com/", "https://"+window.location.origin+"/.ory/")
            })
        } catch (e) {
                window.location.href = "/.ory/ui/login" + import.meta.env.VITE_VERCEL_ENV != 'production' ? '' : '?return_to='+window.location.origin
        }
    }
})


app.use(router);
app.use(pinia);
app.use(VueToastificationPlugin, options)
const eventStore = useEventStore()

app.mount('#app')
