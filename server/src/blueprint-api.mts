import { Express, HttpError } from './web.mjs';
const router = Express.Router();
export default router;

import * as Blueprint from '../../core/blueprint.mjs';

// 节点定义（含端口 schema、参数、枚举选项）。
router.get('/schema', function(_req, res) {
	res.json({ nodeDefs: Blueprint.BlueprintNodeDefs });
});

// 求值蓝图图：前端搭好图后 POST 到这里，后端用 DB 算子惰性求值。
router.post('/evaluate', function(req, res, next) {
	const graph = req.body;
	if(!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges) || !Array.isArray(graph.outputs))
		return next(new HttpError(400, 'Invalid graph.'));
	try {
		res.json(Blueprint.EvaluateBlueprint(graph));
	} catch(err) {
		return next(new HttpError(400, err instanceof Error ? err.message : String(err)));
	}
});
