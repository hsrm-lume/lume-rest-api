/**
 * Costom Error-Type for API-Calls
 * Can be used to create custom error-messages with HTTP codes
 */
export default class ApiError extends Error {
	constructor(
		public code: number = 500,
		message?: any,
		public payload?: any
	) {
		super(message);

		console.log(this.stack);

		Object.setPrototypeOf(this, ApiError.prototype);
	}
}
