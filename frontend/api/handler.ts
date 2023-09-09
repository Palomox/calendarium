import type { VercelRequest, VercelResponse } from '@vercel/node';
import {createProxyMiddleware, responseInterceptor} from "http-proxy-middleware";


const proxy = createProxyMiddleware({
    target: "https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com",
    changeOrigin: true,
    pathRewrite: {
        "^/.ory": "" // strip .ory from the url
    },
    selfHandleResponse: true,
    on: {
        proxyRes: responseInterceptor((responseBuffer, proxyRes, req, res) => {
            let cookiesSet = proxyRes.headers["set-cookie"]
            let newCookies :string[] = []

            const bodyString = responseBuffer.toString('utf8')

            let newBody = bodyString.replaceAll("https://romantic-satoshi-kojdtfzsl2.projects.oryapis.com/", "https://calendarium.vercel.app/.ory/")

            console.log("old: "+bodyString)
            console.log("new: "+newBody)


            if(cookiesSet != undefined){
                const regex = /Domain=.*.oryapis.com/gi

                for(let cookie of cookiesSet){
                    newCookies[newCookies.length] = cookie.replaceAll(regex, "Domain=calendarium.vercel.app")
                }
                proxyRes.headers["set-cookie"] = newCookies
            }

            return newBody



        })
    }
})
export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    proxy(request, response)
}
