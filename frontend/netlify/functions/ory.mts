import type {Config, Context} from "@netlify/functions"
import {proxy} from "../../src/proxy/oryProxy";
import {Response} from "http-proxy-middleware/dist/types";

// Netlify's deployment
const localDomain = process.env.CONTEXT != 'production' ? process.env.DEPLOY_URL : process.env.URL;

export default async (req: Request, context: Context) => {
    let response : Response;
    proxy(req, response, localDomain)
    return response
}

export const config: Config = {
    path: "/.ory/*"
}

