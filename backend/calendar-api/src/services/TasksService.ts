import  {RequestWithMiddleware} from "../types";
import {Env} from "../worker";
import {error} from "itty-router";
import {getDateFromString, getPostgresClient} from "../utils";

export async function getTasks(request: RequestWithMiddleware, env: Env, ctx: ExecutionContext) { // Actually write tasks service!!!
	const client = await getPostgresClient(env);

	let startDateString = request.query.startDate
	let endDateString = request.query.endDate

	let query = "SELECT date, array_agg(json_build_object('label', label, 'completed', completed, 'date', date)) as task FROM tasks WHERE user_id=$1 GROUP BY date"

	let values = [request.session.identity.id]


	if(startDateString != undefined && !Array.isArray(startDateString)){
		query = "SELECT date, array_agg(json_build_object('label', label, 'completed', completed, 'date', date)) as task FROM tasks WHERE user_id=$1 AND date>$2 GROUP BY date"
		values = [request.session.identity.id, getDateFromString(startDateString).toUTCString()]
		if(endDateString != undefined && !Array.isArray(endDateString) ){
			query = "SELECT date, array_agg(json_build_object('label', label, 'completed', completed, 'date', date)) as task FROM tasks WHERE user_id=$1 AND date BETWEEN $2 AND $3 GROUP BY date"
			values = [request.session.identity.id, getDateFromString(startDateString).toUTCString(), getDateFromString(endDateString).toUTCString()]
		}

	}else if(endDateString != undefined && !Array.isArray(endDateString) ){
		query = "SELECT date, array_agg(json_build_object('label', label, 'completed', completed, 'date', date)) as task FROM tasks WHERE user_id=$1 AND date<$2 GROUP BY date"
		values = [request.session.identity.id, getDateFromString(endDateString).toUTCString()]
	}



	let response = await client.query({text: query,
		values: values})
	let map = new Map();

	for(let row of response.rows){
		let date = new Date(row.date)
		map.set(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear(), row.task)
	}
	ctx.waitUntil(client.end())

	return Object.fromEntries(map);
}

export async function createTask(request : RequestWithMiddleware, env: Env, ctx: ExecutionContext) {

	let label = request.content.label
	let completed = request.content.completed
	let date = getDateFromString(request.content.date)
	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		await client.query({
			text: "INSERT INTO tasks(date, user_id, label, completed) VALUES ($1, $2, $3, $4)",
			values: [date, user_id, label, completed]
		})

		ctx.waitUntil(client.end())
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e.detail)
	}

}


export async function deleteTask(request : RequestWithMiddleware, env: Env, ctx: ExecutionContext) {
	let labelString = request.query.label
	let dateString = request.query.date

	if(labelString == undefined || dateString == undefined || Array.isArray(labelString) || Array.isArray(dateString)) {
		return error(400, {error: "Not enough data"})
	}

	let label = labelString
	let date = getDateFromString(dateString)
	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		let response = await client.query({
			text: "DELETE FROM tasks WHERE date=$1 AND user_id=$2 AND label=$3",
			values: [date, user_id, label]
		})

		ctx.waitUntil(client.end())

		if(response.rowCount==0){
			return error(401, "Specified task does not exist")
		}
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}



export async function editTask(request : RequestWithMiddleware, env: Env, ctx: ExecutionContext) {
	let labelString = request.query.label
	let dateString = request.query.date

	if(labelString == undefined || dateString == undefined || Array.isArray(labelString) || Array.isArray(dateString)) {
		return error(400, {error: "Not enough data"})
	}


	let label = labelString
	let date = getDateFromString(dateString)
	let user_id = request.session.identity.id

	let newLabel = request.content.label
	let newDate = request.content.date
	let completed = request.content.completed

	let baseQuery = "UPDATE tasks SET "
	let conditions = " WHERE date=$1 AND user_id=$2 AND label=$3"

	let setting = ""

	let values = [date, user_id, label]

	if(newLabel != undefined){
		setting+="label=$"+(values.length+1)+","
		values[values.length] = newLabel;
	}
	if(newDate != undefined){
		setting+="date=$"+(values.length+1)+","
		values[values.length] = getDateFromString(newDate)
	}
	if(completed != undefined){
		setting+="completed=$"+(values.length+1)+","
		values[values.length] = completed
	}


	if (setting.length == 0){
		return error(400, "No parameters are being modified")
	}

	setting = setting.substring(0, setting.length-1)

	const client = await getPostgresClient(env)

	try {
		let response = await client.query({
			text: baseQuery+setting+conditions,
			values: values
		})

		ctx.waitUntil(client.end())
		if(response.rowCount==0){
			return error(400, "Specified task does not exist")
		}
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}
