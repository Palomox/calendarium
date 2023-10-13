import {createProxyMiddleware, responseInterceptor} from "http-proxy-middleware";

export function proxy(request, response, localDomain){
    let proxy = createProxy(localDomain)

    proxy(request, response)
}

export function createProxy(localDomain) {
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
    });

}
