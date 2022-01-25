import {
	Application as ExpressApp,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express';
import AppRoutes from './routes';
import IRoute from './IRoute';
import ApiError from '../util/ApiError';

/**
 * Loader class for Routes
 */
export default class Routes {
	// empty router
	public router: Router = Router();

	// load the routes into supplied express app
	public loadRoutes(app: ExpressApp): void {
		// register the router in the app
		app.use(this.router);

		// load all routes and register them in the router
		AppRoutes.flatMap.forEach((r: IRoute) => {
			const middlewares = [];
			this.router[r.method](r.path, middlewares, r.action);
		});
		// 404: add a handler for NotFound
		app.use((req, _, next) =>
			next(
				new ApiError(
					404,
					'Not found',
					req.method + ' ' + req.originalUrl
				)
			)
		);
		// Error handling: For all other errors
		app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
			if (res.headersSent) return next(err); // was already processed
			res.wjson(err); // send the error with wrapper function
		});
	}
}
