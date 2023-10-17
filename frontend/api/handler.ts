import {VercelRequest, VercelResponse} from "@vercel/node";
import {proxy} from "../src/proxy/oryProxy";

const localDomain = process.env.VERCEL_ENV != 'production' ? process.env.VERCEL_URL : "calendarium.vercel.app";

export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    // @ts-ignore
    proxy(request, response, localDomain)
}
