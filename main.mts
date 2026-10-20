import server from './server/src/index.mjs';
const mode = process.env['mode'] ?? 'dev';

// Hanchem claims the 20200-20299 block:
// production 20200, dev 20210, staging 20220.
// Bind to loopback only; nginx reverse-proxies the public domain to it.
const ports: Record<string, number> = {
	production: 20200,
	dev: 20210,
	staging: 20220,
};
const port = ports[mode] ?? ports['dev'];
server.listen(port, '127.0.0.1');
console.log(`Server listening on 127.0.0.1:${port}.`);
console.log(`Visit the web app at http://localhost:${port}`);