import { NextFunction, Request, Response } from 'express';
import config from '../config/config';
import neo4j from '../services/neo4j';
import ApiError from '../util/ApiError';

const isUUID = (uuid: any) =>
	('' + uuid).match(
		/^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
	) !== null;

export const create = (req: Request, res: Response, next: NextFunction) => {
	const { position, uuidParent, uuidChild, date } = req.body;
	// date can be chosen in test env
	const dateCreated =
		config.stage === 'test'
			? new Date(date).getTime()
			: new Date().getTime();

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

	// insert cypher-query
	const session = neo4j.session();
	session
		.writeTransaction((txc) =>
			txc.run(
				`MATCH
				(a:User)
				WHERE a.uuid = $parentUuid
				CREATE (a) - [r:Loc { lat: $lat, lng: $lng }] -> (b:User { uuid: $childUuid, litTime: $litTime })
				RETURN a,r,b`,
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
		.catch((e) => next(new ApiError(500, 'Insert Error', e)))
		.finally(() => session.close());
};
