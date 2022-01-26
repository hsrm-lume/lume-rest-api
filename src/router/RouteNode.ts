import { RequestHandler } from 'express';
import IRoute from './IRoute';

// HTTP-Methods
type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
// Handler-Interface that holds a handler per `Method`
type IHandler = {
	[key in Method]?: RequestHandler;
};

/**
 * Recursive Class to build the routes-Tree
 */
export class RouteNode {
	private children: RouteNode[] = [];
	constructor(path: string);
	constructor(path: string, handler: IHandler);
	/**
	 *
	 * @param path Path to this level
	 * @param handler `IHandler` for this level
	 * @param children Children of this level (Subtrees)
	 */
	constructor(path: string, handler: IHandler, ...children: RouteNode[]);
	constructor(
		private path: string,
		private handler: IHandler = {},
		...children: RouteNode[]
	) {
		this.children = children;
	}
	/**
	 * Helper to flatten the tree into a list of `IRoute`
	 * @param parentPath Path to prefix all routes with
	 * @returns List of `IRoute`, flattened from the tree
	 */
	private toRoutes(parentPath: string = ''): IRoute[] {
		const herePath = parentPath + '/' + this.path;
		let r: IRoute[] = [];
		for (const [method, action] of Object.entries(this.handler))
			r.push({
				action: action,
				method: <Method>method,
				path: herePath,
			});
		this.children.forEach((c) => (r = r.concat(c.toRoutes(herePath))));
		return r;
	}
	// getter for the routes as flat list
	public get flatMap() {
		return this.toRoutes();
	}
}
