import type { VercelRequest, VercelResponse } from '@vercel/node';
import {createProxyMiddleware} from "http-proxy-middleware";


const proxy = createProxyMiddleware({
    target: "https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com",
    changeOrigin: true,
    pathRewrite: {
        "^/.ory": "" // strip .ory from the url
    },
    onProxyRes(proxyRes) {
        let cookiesSet = proxyRes.headers["set-cookie"]
        let newCookies :string[] = []

        if(cookiesSet != undefined){
            const regex = /Domain=.*.oryapis.com/gi

            for(let cookie of cookiesSet){
                // @ts-ignore
                newCookies[newCookies.length] = cookie.replaceAll(regex, "Domain=calendarium.vercel.app")
            }
            proxyRes.headers["set-cookie"] = newCookies
        }

        let location = proxyRes.headers["location"];

        if(location != undefined){
            proxyRes.headers["location"].replace("https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com", "https://calendarium.vercel.app/.ory")
        }
    }
})
export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    // @ts-ignore
    proxy(request, response)
}
