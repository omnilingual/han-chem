export * as Http from 'http';

export class HttpError {
	message: string;
	statusCode: number;

	constructor(statusCode: number, message: string) {
		this.message = message;
		this.statusCode = statusCode;
	}
}

import Express from 'express';
export { default as Express } from 'express';

export function HandleHttpErrors(err: Error, req: Express.Request, res: Express.Response, next?: Express.NextFunction) {
	if(!(err instanceof HttpError))
		return next(err);

	res.status(err.statusCode);
	// No need to call res.end() manually after calling res.send()
	// as it by itself flushes and closes the connection.
	res.send(err.message);
}