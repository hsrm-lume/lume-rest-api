declare namespace Express {
	interface Request {
		token?: TokenData;
	}
	interface Response {
		wjson: Function;
	}
}

declare interface TokenData {
	customerID: string;
	email: string;
}
