import server from './server/src/index.mjs';

const port = 8080;
server.listen(port);
console.log(`Server listening on port ${port}`);