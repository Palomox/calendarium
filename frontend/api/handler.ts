import type { VercelRequest, VercelResponse } from '@vercel/node';
import {createProxyMiddleware, responseInterceptor} from "http-proxy-middleware";

const localDomain = process.env.VERCEL_ENV != 'production' ? process.env.VERCEL_URL : "calendarium.vercel.app"

// @ts-ignore
const proxy = createProxyMiddleware({
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
export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    // @ts-ignore
    proxy(request, response)
}
