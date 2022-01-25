import { NextFunction, Request, Response } from 'express';
import { int } from 'neo4j-driver';
import config from '../config/config';
import neo4j from '../services/neo4j';
import ApiError from '../util/ApiError';

/**
 * @param uuid some thing to be tested
 * @returns true if thing is a valid uuid
 */
const isUUID = (uuid: any) =>
	('' + uuid).match(
		/^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
	) !== null;

/**
 * Action that inserts a new node into the neo4j database
 */
export const create = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// parse the message body
	const { position, uuidParent, uuidChild, date } = req.body;
	// date can be chosen by caller only in test env
	const dateCreated = int(
		(config.stage === 'test' && date
			? new Date(date)
			: new Date()
		).getTime()
	);
	// input validation
	if (
		!position ||
		position.lng < -180 ||
		position.lng > 180 ||
		position.lat < -90 ||
		position.lat > 90
	)
		return next(new ApiError(400, 'Invalid Position', position));
	if (!isUUID(uuidParent))
		return next(new ApiError(400, 'Invalid UUID parent', uuidParent));
	if (!isUUID(uuidChild))
		return next(new ApiError(400, 'Invalid UUID child', uuidChild));

	// test connection
	const rdy = await neo4j
		.verifyConnectivity()
		.catch(() => next(new ApiError(503, 'Neo4j is not ready')));
	if (!rdy) return;

	// insert cypher-query
	const session = neo4j.session();
	session
		.writeTransaction((txc) =>
			txc.run(
				`MATCH
				(a:User)
				WHERE a.uuid = $parentUuid
				CREATE (a)-[:LIGHTS]->(b:User { uuid: $childUuid, litTime: $litTime, lat: $lat, lng: $lng })
				RETURN a,b`,
				{
					parentUuid: uuidParent,
					childUuid: uuidChild,
					lat: position.lat,
					lng: position.lng,
					litTime: dateCreated,
				}
			)
		)
		.then((r) => r.records)
		// result processing & answer request
		.then((rs) => {
			if (rs.length === 0)
				return next(new ApiError(424, 'Parent Node not found'));
			else {
				console.log('inserted ' + rs[0].get('b').properties.uuid);
				res.wjson({
					status: 'ok',
					data: rs,
				});
			}
		})
		.catch((e) => {
			console.log(e);
			next(new ApiError(500, 'Insert Error', e));
		})
		.finally(() => session.close());
};
