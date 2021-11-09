import { NextFunction } from 'express';
import config from '../config/config';
import { RouterNode as N } from './RouterNode';
import * as treeController from '../controller/Tree';
import ApiError from '../util/ApiError';

const notImplementedRoute = (_req: any, _res: any, next: NextFunction) => {
	next(new ApiError(501, 'not implemented'));
};

const root = new N(
	'v' + config.apiVersion,
	{},
	new N('new', {
		post: { public: true, action: treeController.create },
	})
);
export default root;
