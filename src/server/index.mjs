import * as Http from 'http';

const server = Http.createServer(function(req, res) {
	res.writeHead(200);
	res.write('hello, world');
	res.end();
});

export default server;