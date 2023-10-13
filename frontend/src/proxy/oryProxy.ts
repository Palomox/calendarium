import {createProxyMiddleware, responseInterceptor} from "http-proxy-middleware";

export function proxy(request : any, response : any, localDomain: string){
    let proxy = createProxy(localDomain)
    // @ts-ignore
    proxy(request, response)
}

export function createProxy(localDomain: string) {

    // @ts-ignore
    return createProxyMiddleware({
        target: "https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com",
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: {
            "^/.ory": "" // strip .ory from the url
        },
        hostRewrite: true,
        cookieDomainRewrite: {
            "romantic-satoshi-kojdtfzsl2.projects.oryapis.com": localDomain,
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
            return response.replaceAll("https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com", "https://"+localDomain+"/.ory")
        }),
    })
}
