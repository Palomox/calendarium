import {FrontendApi} from "@ory/client";
import type {Session} from "@ory/client";
import {ref} from "vue";

export let session = ref<Session|undefined>(undefined)
export let logoutUrl = ref("")

export let ory = new FrontendApi({
    basePath: "https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com",
    isJsonMime: (mime: string) => {return mime == "application/json"},
    baseOptions: {
        includeCredentials: true
    }
})

