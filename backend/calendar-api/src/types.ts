import {IRequest} from "itty-router";
import {Session} from "@ory/client";

export interface RequestWithMiddleware extends IRequest {
	session : Session
}
