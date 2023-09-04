import {FrontendApi, Session} from "@ory/client";
import {ref} from "vue";

export let session = ref<Session|undefined>(undefined)
export let logoutUrl = ref("")

export let ory = new FrontendApi({
    basePath: "/.ory",
    baseOptions: {
        includeCredentials: true
    }
})

