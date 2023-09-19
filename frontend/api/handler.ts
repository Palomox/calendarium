import type { VercelRequest, VercelResponse } from '@vercel/node';
import {createProxyMiddleware, responseInterceptor} from "http-proxy-middleware";


const proxy = createProxyMiddleware({
    target: "https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com",
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: {
        "^/.ory": "" // strip .ory from the url
    },
    hostRewrite: true,
    cookieDomainRewrite: {
      "romantic-satoshi-kojdtfzsl2.projects.oryapis.com": "calendarium.vercel.app",
      ".oryapis.com": "calendarium.vercel.app"
    },
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const response = responseBuffer.toString('utf8');

        console.log(response)

        let location = proxyRes.headers["location"]

        proxyRes.headers["location"] = location.replaceAll("/ui/", "/.ory/ui/")

        return response.replaceAll("https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com", "https://calendarium.vercel.app/.ory")
    }),
    /*onProxyRes(proxyRes) {
        let cookiesSet = proxyRes.headers["set-cookie"]
        let newCookies :string[] = []

        const regex = /Domain=.*.oryapis.com/gi

        if(cookiesSet != undefined){

            for(let cookie of cookiesSet){
                // @ts-ignore
                newCookies[newCookies.length] = cookie
            }
            proxyRes.headers["set-cookie"] = newCookies
        }

        let location = proxyRes.headers["location"];

        if(location != undefined){
            proxyRes.headers["location"].replace("https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com", "https://calendarium.vercel.app/.ory")
            if(location.startsWith("/")){
                proxyRes.headers["location"] = "/.ory"+location
            }
        }
    }*/
})
export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    // @ts-ignore
    proxy(request, response)
}
