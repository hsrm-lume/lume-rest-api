import { RequestHandler } from 'express';
import IRoute from './IRoute';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
type IHandler = {
	[key in Method]?: RequestHandler | { action: RequestHandler };
};

export class RouterNode {
	type: 'routerNode';
	private children: RouterNode[] = [];
	constructor(path: string);
	constructor(path: string, handler: IHandler);
	constructor(path: string, handler: IHandler, ...children: RouterNode[]);
	constructor(path: string, handler: IHandler, ...children: RouterNode[]);
	constructor(
		private path: string,
		private handler: IHandler = {},
		...children: RouterNode[]
	) {
		this.children = children;
	}
	private toRoutes(parentPath: string = ''): IRoute[] {
		const herePath = parentPath + '/' + this.path;
		let r: IRoute[] = [];
		for (const [method, action] of Object.entries(this.handler))
			r.push({
				action: (<any>action).action || action,
				method: <Method>method,
				path: herePath,
			});
		this.children.forEach((c) => (r = r.concat(c.toRoutes(herePath))));
		return r;
	}
	public get flatMap() {
		return this.toRoutes();
	}
}
