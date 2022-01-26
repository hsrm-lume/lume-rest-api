import { RequestHandler } from 'express';

/**
 * Defines a route with path, method and handler
 */
export default interface IRoute {
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	path: string;
	action: RequestHandler;
}
