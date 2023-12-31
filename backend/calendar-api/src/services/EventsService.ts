import  {RequestWithMiddleware} from "../types";
import {Env} from "../worker";
import {error} from "itty-router";
import {getDateFromString, getPostgresClient} from "../utils";

export async function getEvents(request: RequestWithMiddleware, env: Env, ctx: ExecutionContext) {
	const client = await getPostgresClient(env);

	let startDateString = request.query.startDate
	let endDateString = request.query.endDate

	let query = "SELECT date, array_agg(json_build_object('label', label, 'type', type, 'date', date)) as event FROM events WHERE user_id=$1 GROUP BY date"
	let values = [request.session.identity.id]

	if(startDateString != undefined && !Array.isArray(startDateString)){
		query = "SELECT date, array_agg(json_build_object('label', label, 'type', type, 'date', date)) as event FROM events WHERE user_id=$1 AND date>$2 GROUP BY date"
		values = [request.session.identity.id, getDateFromString(startDateString).toUTCString()]
		if(endDateString != undefined && !Array.isArray(endDateString) ){
			query = "SELECT date, array_agg(json_build_object('label', label, 'type', type, 'date', date)) as event FROM events WHERE user_id=$1 AND date BETWEEN $2 AND $3 GROUP BY date"
			values = [request.session.identity.id, getDateFromString(startDateString).toUTCString(), getDateFromString(endDateString).toUTCString()]
		}

	}else if(endDateString != undefined && !Array.isArray(endDateString) ){
		query = "SELECT date, array_agg(json_build_object('label', label, 'type', type, 'date', date)) as event FROM events WHERE user_id=$1 AND date<$2 GROUP BY date"
		values = [request.session.identity.id, getDateFromString(endDateString).toUTCString()]
	}

	let response = await client.query({text: query, values: values})
	let map = new Map();

	for(let row of response.rows){
		let date = new Date(row.date)
		map.set(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear(), row.event)
	}
	ctx.waitUntil(client.end())

	return Object.fromEntries(map);
}

export async function alterEvent(request : RequestWithMiddleware, env: Env, ctx: ExecutionContext) {
	let labelQuery = request.query.label;
	let dateQueryString = request.query.date;


	let label = request.content.label
	let type = request.content.type
	let date = getDateFromString(request.content.date)
	// @ts-ignore
	let user_id = request.session.identity.id

	let query : string;
	let values : string[];

	if( labelQuery != undefined && dateQueryString != undefined && !Array.isArray(labelQuery) && !Array.isArray(dateQueryString) ){

		query = "UPDATE events SET date=$1, label=$2, type=$3 WHERE date=$4 AND label=$5 AND user_id=$6";
		values = [date, label, type, getDateFromString(dateQueryString), labelQuery, user_id]
	} else {
		query = "INSERT INTO events(date, user_id, label, type) VALUES ($1, $2, $3, $4)";
		values = [date, user_id, label, type]
	}


	const client = await getPostgresClient(env)

	try {
		await client.query({
			text: query,
			values: values
		})

		ctx.waitUntil(client.end())
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}


export async function deleteEvent(request : RequestWithMiddleware, env: Env, ctx: ExecutionContext) {
	let labelString = request.query.label
	let dateString = request.query.date

	if(labelString == undefined || dateString == undefined || Array.isArray(labelString) ||Array.isArray(dateString)){
		return error(400, {error: "Not enough data given"})
	}

	let label = labelString
	let date = getDateFromString(dateString)
	// @ts-ignore
	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		let response = await client.query({
			text: "DELETE FROM events WHERE date=$1 AND user_id=$2 AND label=$3",
			values: [date, user_id, label]
		})

		ctx.waitUntil(client.end())
	if(response.rowCount==0){
		return error(400, "Specified event does not exist")
	}
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}
