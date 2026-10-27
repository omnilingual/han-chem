import { Express, HttpError } from './web.mjs';
const router = Express.Router();
export default router;

import * as Db from '../../core/db.mjs';

// 库级统计。
router.get('/stats', function(_req, res) {
	res.json(Db.Stats());
});

// 搜索：q 为查询串，mode 为 literal|regex，kind 为 attestation|glyph。
// 支持 field:value / field=value 键值检索。
router.get('/search', function(req, res, next) {
	const q = req.query['q'];
	const mode = req.query['mode'] === 'regex' ? 'regex' : 'literal';
	const kind = req.query['kind'] === 'glyph' ? 'glyph' : 'attestation';
	if(typeof q !== 'string' || q.length === 0)
		return next(new HttpError(400, 'Query must not be empty.'));
	const rows = kind === 'glyph' ? Db.SearchGlyphs(q, mode) : Db.SearchAttestations(q, mode);
	res.json({ count: rows.length, rows: rows.slice(0, 500) });
});
