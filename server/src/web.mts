export * as Http from 'http';

export class HttpError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
	}
}

import Express from 'express';
export { default as Express } from 'express';

export function HandleHttpErrors(handler: Express.RequestHandler) {
	return function(req: Express.Request, res: Express.Response, next?: Express.NextFunction) {
		try {
			handler(req, res, next);
		}
		catch(err) {
			if(!(err instanceof HttpError))
				throw err;

			res.status(err.statusCode);
			// No need to call res.end() manually after calling res.send()
			// as it by itself flushes and closes the connection.
			res.send(err.message);
		}
	}
}