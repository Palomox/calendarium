import {vercelEnv} from "@/main";
import {useToast} from "vue-toastification";

let toast = useToast()
export function handleError(error: Error) {
    if(error.message.includes("401")){
        toast.error("Session expirada. Redirigiendo...")
        //reauth
        window.location.href = "/.ory/ui/login" + (vercelEnv == 'development' ? '' : '?return_to='+window.location.origin)
    } else {
        toast.error(error.message)
    }

}
