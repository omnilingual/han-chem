import * as Http from 'http';

/** @type {import('net').Server} */
const server = Http.createServer(function(req, res) {
	res.writeHead(200);
	res.write('hello, world');
	res.end();
});

export default server;