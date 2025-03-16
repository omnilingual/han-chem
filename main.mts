import server from './server/src/index.mjs';
const mode = process.env['mode'];

const port = mode === 'production' ? 85 : 8080;
server.listen(port);
console.log(`Server listening on port ${port}.`);
console.log(`Visit the web app at http://localhost:${port}`);