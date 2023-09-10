import  {RequestWithMiddleware} from "../types";
import {Env} from "../worker";
import {error} from "itty-router";
import {getPostgresClient} from "../utils";

export async function getPeriods(request: RequestWithMiddleware, env: Env) {
	const client = await getPostgresClient(env);

	let response = await client.query({text: "SELECT name, color, startdate, enddate, priority FROM periods WHERE user_id=$1", values: [request.session.identity.id]})

	let periods = response.rows;

	await client.end()

	return {"periods": periods};
}

export async function createPeriod(request : RequestWithMiddleware, env: Env) {

	let name = request.content.name
	let startDate = request.content.startDate
	let endDate = request.content.endDate
	let color = request.content.color
	let priority = request.content.priority

	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		await client.query({
			text: "INSERT INTO periods(name, user_id, startdate, enddate, color, priority) VALUES ($1, $2, $3, $4, $5, $6)",
			values: [name, user_id, startDate, endDate, color, priority]
		})
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e.detail)
	}

}


export async function deletePeriod(request : RequestWithMiddleware, env: Env) {
	let name = request.content.name
	let startDate = request.content.startDate
	let endDate = request.content.endDate

	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		let response = await client.query({
			text: "DELETE FROM periods WHERE name=$1 AND user_id=$2 AND startdate=$3 AND enddate=$4",
			values: [name, user_id, startDate, endDate]
		})

		if(response.rowCount==0){
			return error(401, "Specified period does not exist")
		}
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}
