import fetchAdapter from "@haverstack/axios-fetch-adapter"
import * as oryApi from "@ory/client"
import { json } from "itty-router"
import {RequestWithMiddleware} from "../types";
import {Env} from "../worker";

export default async function authenticate(request: RequestWithMiddleware, env: Env) {
	// create our oryApi client
	const ory = new oryApi.FrontendApi(
		new oryApi.Configuration({
			basePath: env.ORY_PATH,
			baseOptions: { adapter: fetchAdapter },
		}),
	)


	// get our cookies from the header
	const cookies = request.headers.has("Cookie")? <string>request.headers.get("Cookie") : undefined


	try {
		const resp = await ory.toSession({ cookie: cookies })
		request.session = resp.data
	} catch (e) {
		return json({ error: e }, { status: 401 })
	}
}
