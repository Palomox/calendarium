import {Env} from "./worker";
import {Client} from "pg";

export async function getPostgresClient(env: Env){
	const client = new Client({
		ssl: true,
		connectionString: "postgres://"+env.PG_USER+":"+env.PG_PASSWORD+"@"+env.PG_HOST+"/"+env.PG_DATABASE+"?options=project%3D"+env.ENDPOINT_ID
	})

	await client.connect()
	return client
}

/**
 *
 * @param stringDate date in dd-mm-yyyy format
 */
export function getDateFromString(dateString: string){
	let splitDate = dateString.split("-")
	let date = new Date()
	date.setUTCFullYear(<number>(<unknown>splitDate[2]), (<number>(<unknown>splitDate[1]))-1, <number>(<unknown>splitDate[0]))
	date.setUTCHours(0, 0, 0, 0)
	return date;
}
