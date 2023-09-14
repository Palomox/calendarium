import  {RequestWithMiddleware} from "../types";
import {Env} from "../worker";
import {error} from "itty-router";
import {getDateFromString, getPostgresClient} from "../utils";

export async function getTasks(request: RequestWithMiddleware, env: Env) { // Actually write tasks service!!!
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
	await client.end()

	return Object.fromEntries(map);
}

export async function createTask(request : RequestWithMiddleware, env: Env) {

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
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e.detail)
	}

}


export async function deleteTask(request : RequestWithMiddleware, env: Env) {
	let label = request.content.label
	let date = getDateFromString(request.content.date)
	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		let response = await client.query({
			text: "DELETE FROM tasks WHERE date=$1 AND user_id=$2 AND label=$3",
			values: [date, user_id, label]
		})

		if(response.rowCount==0){
			return error(401, "Specified task does not exist")
		}
		return {status: 200}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}



export async function editTask(request : RequestWithMiddleware, env: Env) {
	let labelString = request.query.label
	let dateString = request.query.date

	if(labelString == undefined || dateString == undefined || Array.isArray(labelString) || Array.isArray(dateString)) {
		return error(400, {error: "Not enough data"})
	}


	let label = labelString
	let date = getDateFromString(dateString)
	let completed = request.content.completed
	let user_id = request.session.identity.id

	const client = await getPostgresClient(env)

	try {
		let response = await client.query({
			text: "UPDATE tasks SET completed=$4 WHERE date=$1 AND user_id=$2 AND label=$3",
			values: [date, user_id, label, completed]
		})

		if(response.rowCount==0){
			return error(400, "Specified task does not exist")
		}
		return {status: 200, completed: completed}
	} catch (e){
		// @ts-ignore
		return error(409, e)
	}

}
