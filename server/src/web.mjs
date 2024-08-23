export * as Http from 'http';

export class HttpError extends Error {
	/**
	 * @param {number} statusCode 
	 * @param {string} message 
	 */
	constructor(statusCode, message) {
		super(message);
		/** @type {number} */
		this.statusCode = statusCode;
	}
}

export { default as Express } from 'express';

/**
 * @template Route
 * @typedef {import('express').RouteParameters<Route>} RouteParameters
 */
/**
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('qs').ParsedQs} ParsedQs
 */
/**
 * @summary End the request and send the status code automatically when an error is thrown.
 * @param {RequestHandler} handler
 * @returns {RequestHandler}
 */
export function HandleHttpErrors(handler) {
	return function(req, res) {
		try {
			handler(req, res);
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