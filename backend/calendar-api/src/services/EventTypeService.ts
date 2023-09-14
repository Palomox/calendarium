import  {RequestWithMiddleware} from "../types";
import {Env} from "../worker";
import {error} from "itty-router";
import {getPostgresClient} from "../utils";

export async function getEventTypes(request: RequestWithMiddleware, env: Env) {
	const client = await getPostgresClient(env);

	let response = await client.query({text: "SELECT type as name, json_build_object('name', type, 'color', color, 'prefix', prefix) as type FROM event_types WHERE user_id=$1", values: [request.session.identity.id]})

	let eventTypes = new Map()

	for(let row of response.rows){
		eventTypes.set(row.name, row.type)
	}

	await client.end()

	return Object.fromEntries(eventTypes)
}

export async function alterEventType(request : RequestWithMiddleware, env: Env) {
	let prefix = request.content.prefix
	let type = request.content.type
	let color = request.content.color
	let user_id = request.session.identity.id

	let oldName = request.query.type;

	let query : string;
	let values : string[];

	if(oldName != undefined){
		// We update
		query = "UPDATE event_types SET color=$3, prefix=$4, type=$5 WHERE type=$2 AND user_id=$1"

		values = [user_id, oldName, color, prefix, type]
		console.log(JSON.stringify(values))
	} else {
		// We insert
		query = "INSERT INTO event_types(color, prefix, type, user_id) VALUES ($1, $2, $3, $4)"
		values = [color, prefix, type, user_id]
	}

	const client = await getPostgresClient(env)

	try {

		await client.query({
			text: query,
			values: values
		})
		if(oldName != undefined) {
			await client.query({
				text: "UPDATE events SET type=$3 WHERE user_id=$1 AND type=$2",
				values: [user_id, oldName, type]
			})
		}
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
