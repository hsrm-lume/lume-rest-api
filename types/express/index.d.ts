/**
 * Tells typescript that Express.Response has a function
 * to apply shimming to the response object.
 */
declare namespace Express {
	interface Response {
		wjson: Function;
	}
}
