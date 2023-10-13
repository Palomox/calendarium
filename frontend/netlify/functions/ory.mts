import type {Config, Context} from "@netlify/functions"
import {proxy} from "../../src/proxy/oryProxy";
import {Response} from "http-proxy-middleware/dist/types";

const localDomain = process.env.CONTEXT != 'production' ? process.env.DEPLOY_URL : process.env.URL;

export default async (req: Request, context: Context) => {
    console.log(localDomain)
    let response : Response = new Response();
    proxy(req, response, localDomain)
    return response
}

export const config: Config = {
    path: "/.ory/*"
}

