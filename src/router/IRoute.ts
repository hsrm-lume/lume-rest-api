import { RequestHandler } from 'express';

export default interface IRoute {
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	path: string;
	action: RequestHandler;
}
