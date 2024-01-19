import {VercelRequest, VercelResponse} from "@vercel/node";
import * as proxy from "./_oryProxy.cjs";


const localDomain = process.env.VERCEL_ENV != 'production' ? process.env.VERCEL_URL : "calendarium.vercel.app";
const oryDomain = process.env.VITE_ORY_DOMAIN;
function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    // @ts-ignore
    proxy.proxy(request, response, localDomain, oryDomain)
}

module.exports = handler
