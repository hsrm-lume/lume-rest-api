import config from '../config/config';
import { RouteNode } from './RouteNode';
import * as treeController from '../controller/TreeController';
import * as stateController from '../controller/StateController';

/**
 * Defines the routes for the API
 * using the RouteNode-Class
 */
const root = new RouteNode(
	//set version of API
	'v' + config.apiVersion,
	{},
	//API ready check
	new RouteNode('ready', {
		get: stateController.ready,
	}),
	//create new torch entry
	new RouteNode('new', {
		post: treeController.create,
	})
);
export default root;
