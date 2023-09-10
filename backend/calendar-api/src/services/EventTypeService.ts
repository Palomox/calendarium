import  {RequestWithMiddleware} from "../types";
import {Env} from "../worker";
import {error} from "itty-router";
import {getPostgresClient} from "../utils";

export async function getEventTypes(request: RequestWithMiddleware, env: Env) {
	const client = await getPostgresClient(env);

	let response = await client.query({text: "SELECT type, color, prefix FROM event_types WHERE user_id=$1", values: [request.session.identity.id]})

	let eventTypes = response.rows;

	await client.end()

	return {"types": eventTypes};
}

export async function createEventType(request : RequestWithMiddleware, env: Env) {

	let prefix = request.content.prefix
	let type = request.content.type
	let color = request.content.color
	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		await client.query({
			text: "INSERT INTO event_types(color, prefix, type, user_id) VALUES ($1, $2, $3, $4)",
			values: [color, prefix, type, user_id]
		})
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e.detail)
	}

}


export async function deleteEventType(request : RequestWithMiddleware, env: Env) {
	let type = request.content.type
	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		let response = await client.query({
			text: "DELETE FROM event_types WHERE type=$1 AND user_id=$2",
			values: [type, user_id]
		})

		if(response.rowCount==0){
			return error(401, "Specified event type does not exist")
		}
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}
