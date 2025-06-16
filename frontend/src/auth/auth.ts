import {FrontendApi} from "@ory/client";
import type {Session} from "@ory/client";
import {ref} from "vue";

export let session = ref<Session|undefined>(undefined)
export let logoutUrl = ref("")

export let ory = new FrontendApi({
    basePath: import.meta.env.VITE_ORY_DOMAIN+"/api",
    isJsonMime: (mime: string) => {return mime == "application/json"},
    baseOptions: {
        withCredentials: true
    }
})

