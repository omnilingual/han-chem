import server from './server/src/index.mjs';

const port = 8080;
server.listen(port);
console.log(`Server listening on port ${port}.`);
console.log(`Visit the web app at http://localhost:${port}`);