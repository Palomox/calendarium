import {createProxyMiddleware, Options, responseInterceptor} from "http-proxy-middleware";

let oryDomain : string

function proxy(request : any, response : any, localDomain: string, oryDomainInput: string){
    oryDomain = oryDomainInput

    let proxy = createProxy(localDomain)
    // @ts-ignore

    proxy(request, response)
}

function createProxy(localDomain: string) {

    // @ts-ignore
    let context : Options = {
        target: "https://"+oryDomain,
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: {
            "^/.ory": "" // strip .ory from the url
        },
        logger: console,
        hostRewrite: localDomain,
        cookieDomainRewrite: {
            ".oryapis.com": localDomain
        },
        on: {
            proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {

                let location = proxyRes.headers["location"]

                if(location != undefined) {

                    const ui = /\/ui\//gi

                    res.setHeader("location", (location.replace(ui, "/.ory/ui/").replaceAll("https://"+oryDomain, "https://"+localDomain)))
                }

                const noAssets = new RegExp("https:\\/\\/"+oryDomain+"\\/\\w*\\/(?!assets)","gi")
                for (let line in responseBuffer){
                    if(noAssets.test(line)){
                        line.replace("https://"+oryDomain, "https://"+localDomain+"/.ory")
                    }
                }
                return responseBuffer.toString('utf8');
            }),
        },

    }
    // @ts-ignore
    context.cookieDomainRewrite[oryDomain] = localDomain

    // @ts-ignore
    return createProxyMiddleware(context)
}

module.exports = {proxy, createProxy}
