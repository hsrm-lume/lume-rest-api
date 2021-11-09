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

export default class Routes {
	public router: Router = Router();

	public loadRoutes(app: ExpressApp): void {
		app.use(this.router);

		AppRoutes.flatMap.forEach((r: IRoute) => {
			const middlewares = [];
			this.router[r.method](r.path, middlewares, r.action);
		});
		// 404
		app.use((req, _, next) =>
			next(
				new ApiError(
					404,
					'Not found',
					req.method + ' ' + req.originalUrl
				)
			)
		);
		// Error handling
		app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
			if (res.headersSent) return next(err);
			res.wjson(err);
		});
	}
}
