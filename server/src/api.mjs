import { Express, HttpError, HandleHttpErrors } from './web.mjs';

const router = Express.Router();
export default router;

import * as HanChem from '../../core/index.mjs';

router.get('/query-glyph-info', HandleHttpErrors(function(req, res) {
	const query = req.query['glyph'];

	// Reject empty queries;
	if(typeof query !== 'string' || query.length <= 0)
		throw new HttpError(400, 'Query must not be empty.');
	// Reject queries that are too long.
	if(query.length > 10)
		throw new HttpError(400, 'Query too long.');

	const glyphInfo = HanChem.QueryGlyphInfo(query);

	// Check if the glyph exists in the database.
	// If not, reject.
	if(glyphInfo === null)
		throw new HttpError(404, 'Glyph does not exist.');

	res.json(glyphInfo);
}));