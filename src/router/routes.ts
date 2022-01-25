import config from '../config/config';
import { RouteNode } from './RouteNode';
import * as treeController from '../controller/TreeController';
import * as stateController from '../controller/StateController';

/**
 * Defines the routes for the API
 * using the RouteNode-Class
 */
const root = new RouteNode(
	'v' + config.apiVersion,
	{},
	new RouteNode('ready', {
		get: stateController.ready,
	}),
	new RouteNode('new', {
		post: treeController.create,
	})
);
export default root;
