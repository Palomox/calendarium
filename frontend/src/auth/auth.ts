import {FrontendApi} from "@ory/client";
import type {Session} from "@ory/client";
import {ref} from "vue";

export let session = ref<Session|undefined>(undefined)
export let logoutUrl = ref("")

export let ory = new FrontendApi({
    basePath: "/.ory",
    isJsonMime: (mime: string) => {return mime == "application/json"},
    baseOptions: {
        withCredentials: true
    }
})

