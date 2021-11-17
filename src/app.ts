import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';

import Routes from './router/index';
import ApiError from './util/ApiError';
import config from './config/config';

// send wrapped json
express.response.wjson = function (d: Object | Error) {
	if (d instanceof Error || d instanceof ApiError) console.warn(d.message);
	if (d instanceof ApiError)
		return this.status(d.code).json({
			version: config.apiVersion,
			message: d.message,
			payload: d.payload,
		});
	if (d instanceof Error)
		return this.status(500).json({
			version: config.apiVersion,
			message: d.message,
		});
	else
		return this.status(200).json({
			version: config.apiVersion,
			kind: d.constructor.name.toLowerCase(),
			data: d,
		});
};

export default class App {
	public defaultApp: express.Application;
	public routes: Routes = new Routes();

	public initialize(): void {
		this.defaultApp = express();
		this.config();
		this.setRouter();
	}

	private config(): void {
		// support application/json type post data
		this.defaultApp.use(express.json());
		this.defaultApp.use(cors());
		this.defaultApp.use(helmet());
	}

	private setRouter(): void {
		this.routes.loadRoutes(this.defaultApp);
	}
}
