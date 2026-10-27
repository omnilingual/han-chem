import Express from 'express';

const app = Express();
app.use(Express.json());
export default app;

// Constants
import * as Path from 'path';
import * as Url from 'url';
const thisScriptDir = Path.dirname(Url.fileURLToPath(import.meta.url));

// Static files
const publicDir = Path.join(Path.resolve(thisScriptDir, '..'), 'public');
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

// 数据库预览 API
import DbPreviewApi from './db-preview-api.mjs';
app.use('/api/db-preview', DbPreviewApi);

// 蓝图工具 API
import BlueprintApi from './blueprint-api.mjs';
app.use('/api/blueprint', BlueprintApi);

// Error handling
import { HandleHttpErrors } from './web.mjs';
app.use(HandleHttpErrors);