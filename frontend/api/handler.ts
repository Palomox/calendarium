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

        for(let cookie of cookiesSet){
            console.log(cookie)
            cookie.replace("romantic-satoshi-kojdtfzsl2.projects.oryapis.com", "calendarium.vercel.app")
        }
    }
})
export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    proxy(request, response)
}
