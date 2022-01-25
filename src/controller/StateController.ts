import { NextFunction, Request, Response } from 'express';
import neo4j from '../services/neo4j';
import ApiError from '../util/ApiError';

/**
 * Action that reports the current state of the neo4j database
 */
export const ready = (_: Request, res: Response, next: NextFunction) => {
	neo4j
		.verifyConnectivity()
		.then(() => res.wjson(true))
		.catch(() => next(new ApiError(503, 'Neo4j is not ready')));
};
