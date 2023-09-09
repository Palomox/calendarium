import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCircleXmark} from "@fortawesome/free-regular-svg-icons";
import {useEventStore} from "@/stores/eventstore";
import type {Session} from "@ory/client";
import {logoutUrl, ory, session} from "@/auth/auth";



const app = createApp(App)
const pinia = createPinia();


library.add(faCircleXmark)

router.beforeEach(async (to, from) => {
    if (to.path !== "/login") {
        if (session.value == undefined) {
            try {
                let result = await ory.toSession()
                session.value = result.data

                ory.createBrowserLogoutFlow().then(({data}) => {
                    logoutUrl.value = data.logout_url + "&return_to=" + window.location.origin
                })
            } catch (e) {
                return {name: "Login"}

            }
        }
    }
})


app.use(router);
app.use(pinia);

const eventStore = useEventStore()

app.mount('#app')

