import { NextFunction, Request, Response } from 'express';
import neo4j from '../services/neo4j';
import ApiError from '../util/ApiError';

export const ready = (_: Request, res: Response, next: NextFunction) => {
	neo4j
		.verifyConnectivity()
		.then(() => res.wjson(true))
		.catch(() => next(new ApiError(503, 'Neo4j is not ready')));
};
