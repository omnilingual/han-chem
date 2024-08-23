import Express from 'express';

const app = Express();
export default app;

// Constants
import * as Path from 'path';
import * as Url from 'url';
const thisScriptDir = Path.dirname(Url.fileURLToPath(import.meta.url));

// Static files
const publicDir = Path.join(thisScriptDir, 'public');
// Stylus support
import ExpressStylus from 'express-stylus';
import Nib from 'nib';
app.use(ExpressStylus({
	src: publicDir,
	use: [Nib()],
	import: ['nib']
}));
// Other static files
app.use('/', Express.static(publicDir));

// APIs
import Api from './api.mjs';
app.use('/api', Api);