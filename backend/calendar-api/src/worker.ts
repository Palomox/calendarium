import {createEvent, deleteEvent, getEvents} from "./services/EventsService";

import {error, json, RequestLike, Router, withContent} from "itty-router";
import authenticate from "./middleware/ory";
import {createEventType, deleteEventType, getEventTypes} from "./services/EventTypeService";
import {createPeriod, deletePeriod, getPeriods} from "./services/PeriodsService";
import {createTask, deleteTask, editTask, getTasks} from "./services/TasksService";
export interface Env {
	ORY_PATH: string
	ORY_KEY: string
	PG_HOST: string
	PG_DATABASE: string
	PG_USER: string
	PG_PASSWORD: string
	ENDPOINT_ID: string
}


const router = Router()

router.all("*", authenticate)
	.all("*", withContent)
	/*
		Events API
	 */
	.get("/api/v1/events", getEvents)
	.post("/api/v1/events", createEvent)
	.delete("/api/v1/events", deleteEvent)
	/*
		Event Types API
	 */
	.get("/api/v1/events/types", getEventTypes)
	.post("/api/v1/events/types", createEventType)
	.delete("/api/v1/events/types", deleteEventType)
	/*
		Periods API
	 */
	.get("/api/v1/periods", getPeriods)
	.post("/api/v1/periods", createPeriod)
	.delete("/api/v1/periods", deletePeriod)
	/*
		Tasks API
	 */
	.get("/api/v1/tasks", getTasks)
	.post("/api/v1/tasks", createTask)
	.delete("/api/v1/tasks", deleteTask)
	.patch("/api/v1/tasks", editTask)

	// 404 for the rest
	.all("*", (req) => {return error(404)})


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {

		let rawResponse = await  router.handle(request, env, ctx);
		let response = json(rawResponse)
		response.headers.append("Access-Control-Allow-Origin", <string>request.headers.get("Origin"));
		response.headers.append("Access-Control-Allow-Credentials", "true")

		return response;
		},
};
