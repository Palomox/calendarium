import {createProxyMiddleware, responseInterceptor} from "http-proxy-middleware";
import {ory} from "@/auth/auth";

let oryDomain : string

export function proxy(request : any, response : any, localDomain: string, oryDomainInput: string){
    oryDomain = oryDomainInput

    let proxy = createProxy(localDomain)
    // @ts-ignore

    proxy(request, response)
}

export function createProxy(localDomain: string) {

    // @ts-ignore
    let context = {
        target: "https://"+oryDomain,
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: {
            "^/.ory": "" // strip .ory from the url
        },
        hostRewrite: true,
        cookieDomainRewrite: {
            ".oryapis.com": localDomain
        },
        onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            const response = responseBuffer.toString('utf8');

            let location = proxyRes.headers["location"]

            if(location != undefined) {

                const ui = /\/ui\//gi

                res.setHeader("location", (location.replace(ui, "/.ory/ui/")))
            }
            // @ts-ignore
            return response.replaceAll("https://"+oryDomain, "https://"+localDomain+"/.ory")
        }),
    }
    // @ts-ignore
    context.cookieDomainRewrite[oryDomain] = localDomain

    // @ts-ignore
    return createProxyMiddleware(context)
}
