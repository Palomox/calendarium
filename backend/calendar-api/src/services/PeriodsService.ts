import  {RequestWithMiddleware} from "../types";
import {Env} from "../worker";
import {error} from "itty-router";
import {getPostgresClient} from "../utils";

export async function getPeriods(request: RequestWithMiddleware, env: Env) {
	const client = await getPostgresClient(env);

	let response = await client.query({text: "SELECT name, color, startDate, endDate, priority FROM periods WHERE user_id=$1", values: [request.session.identity.id]})

	let periods = response.rows;

	await client.end()

	return {"periods": periods};
}

export async function alterPeriod(request : RequestWithMiddleware, env: Env) {

	let name = request.content.name
	let startDate = request.content.startDate
	let endDate = request.content.endDate
	let color = request.content.color
	let priority = request.content.priority

	let searchName = request.query.name
	let searchStartdate = request.query.startDate
	let searchEnddate = request.query.endDate


	let user_id = request.session.identity.id
	let query
	let values : string[]

	if(searchName != undefined && searchStartdate != undefined && searchEnddate != undefined){
		query ="UPDATE periods SET name=$5, startdate=$6, enddate=$7, color=$8, priority=$9 WHERE name=$1 AND startdate=$2 AND enddate=$3 AND user_id=$4"
		values = [searchName, searchStartdate, searchEnddate, user_id, name, startDate, endDate, color, priority, ]
	} else{
		query = "INSERT INTO periods(name, user_id, startdate, enddate, color, priority) VALUES ($1, $2, $3, $4, $5, $6)"
		values = [name, user_id, startDate, endDate, color, priority]
	}

	const client = await getPostgresClient(env)

	try {
		await client.query({
			text: query,
			values: values,
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
