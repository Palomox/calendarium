import type { VercelRequest, VercelResponse } from '@vercel/node';
import {createProxyMiddleware} from "http-proxy-middleware";


const proxy = createProxyMiddleware({
    target: "https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com",
    changeOrigin: true,
    pathRewrite: {
        "^/.ory": "" // strip .ory from the url
    },
    onProxyRes(proxyRes){
        let cookiesSet = proxyRes.headers["set-cookie"]
        let newCookies :string[] = []
        const regex = /Domain=.*.oryapis.com/gi

        if(cookiesSet == undefined){
            return;
        }

        for(let cookie of cookiesSet){
            newCookies[newCookies.length] = cookie.replaceAll(regex, "Domain=calendarium.vercel.app")
        }
        proxyRes.headers["set-cookie"] = newCookies
    }
})
export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    proxy(request, response)
}
