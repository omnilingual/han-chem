// 蓝图工具引擎（后端求值）。节点图 + 类型化连线 + 惰性求值，数据算子走 core/db。
// 三个参数风格（2026-10-27 定稿）：
//   1. 仅输入的量（字段名/来源/条件）→ 枚举下拉框；
//   2. 可能作为输出的量（如筛选的「值」）→ UE 风格：可编辑字面量，有引线输入则屏蔽字面量；
//   3. 「同声符」等复合条件 → 由「扩张(部件·声符)」等子图拼出，不设枚举项。

import * as Db from './db.mjs';

//#region 类型

export type BlueprintType = '书证集' | '值集' | '集合' | '值' | '数';

export type BlueprintInput = {
	name: string;
	label: string;
	type: BlueprintType;
	/** UE 风格：可编辑字面量；有引线输入则屏蔽字面量。 */
	literal?: boolean;
};

export type BlueprintParam = {
	name: string;
	label: string;
	kind: 'enum' | 'text';
	options?: string[];
};

export type BlueprintOutput = {
	name: string;
	label: string;
	type: BlueprintType;
};

export type BlueprintNodeDef = {
	type: string;
	label: string;
	category: '数据' | '转换' | '聚合';
	inputs: BlueprintInput[];
	outputs: BlueprintOutput[];
	params: BlueprintParam[];
};

//#endregion

//#region 字段与节点定义

/** 书证可筛选/测量的字段。 */
export const AttestationFields = ['字形', '来源', '声', '韵', '调', '等', '呼', '反切上字', '反切下字', '拼音'];

export const BlueprintNodeDefs: BlueprintNodeDef[] = [
	{
		type: 'source', label: '书证源', category: '数据',
		inputs: [],
		outputs: [{ name: 'out', label: '书证', type: '书证集' }],
		params: [{ name: 'source', label: '来源', kind: 'enum', options: ['全部', '廣韻', '切韻', '玉篇', '經典釋文', 'Unihan'] }],
	},
	{
		type: 'filter', label: '筛选', category: '转换',
		inputs: [
			{ name: 'in', label: '书证', type: '书证集' },
			{ name: 'value', label: '值', type: '值', literal: true },
		],
		outputs: [{ name: 'out', label: '书证', type: '书证集' }],
		params: [{ name: 'field', label: '字段', kind: 'enum', options: AttestationFields }],
	},
	{
		type: 'measure', label: '测量', category: '转换',
		inputs: [{ name: 'in', label: '书证', type: '书证集' }],
		outputs: [{ name: 'out', label: '值', type: '值集' }],
		params: [{ name: 'field', label: '字段', kind: 'enum', options: AttestationFields }],
	},
	{
		type: 'expand', label: '扩张', category: '转换',
		inputs: [{ name: 'seed', label: '种子', type: '书证集' }],
		outputs: [{ name: 'out', label: '书证', type: '书证集' }],
		params: [{ name: 'cond', label: '条件', kind: 'enum', options: ['同字', '等价'] }],
	},
	{
		type: 'count', label: '计数', category: '聚合',
		inputs: [{ name: 'in', label: '集合', type: '集合' }],
		outputs: [{ name: 'out', label: '数', type: '数' }],
		params: [],
	},
	{
		type: 'ratio', label: '占比', category: '聚合',
		inputs: [
			{ name: 'part', label: '分子', type: '数' },
			{ name: 'whole', label: '分母', type: '数' },
		],
		outputs: [{ name: 'out', label: '百分比', type: '数' }],
		params: [],
	},
	{
		type: 'value', label: '常量', category: '数据',
		inputs: [],
		outputs: [{ name: 'out', label: '值', type: '值' }],
		params: [{ name: 'value', label: '值', kind: 'text' }],
	},
];

//#endregion

//#region 图结构

export type BlueprintGraphNode = {
	id: string;
	type: string;
	params: Record<string, string>;
	values: Record<string, string>;
};

export type BlueprintGraphEdge = {
	from: { node: string; port: string };
	to: { node: string; port: string };
};

export type BlueprintGraph = {
	nodes: BlueprintGraphNode[];
	edges: BlueprintGraphEdge[];
	outputs: string[];
};

//#endregion

//#region 求值

/** 类型兼容：同型相接；「集合」是「书证集/值集」的上位。 */
export function TypeCompatible(from: BlueprintType, to: BlueprintType): boolean {
	if(from === to)
		return true;
	return to === '集合' && (from === '书证集' || from === '值集');
}

function fieldValue(a: any, field: string): string | null {
	if(field === '字形')
		return a.glyph ?? null;
	if(field === '来源')
		return a.source ?? null;
	if(!a.reading)
		return null;
	return a.reading.components?.[field] ?? null;
}

function computeNode(def: BlueprintNodeDef, node: BlueprintGraphNode, inputs: Record<string, any>): Record<string, any> {
	switch(def.type) {
		case 'source': {
			const all = Db.AllAttestations();
			const src = node.params.source ?? '全部';
			return { out: src === '全部' ? all : all.filter(a => a.source === src) };
		}
		case 'filter': {
			const rows = inputs.in ?? [];
			const field = node.params.field ?? '';
			const value = inputs.value ?? '';
			return { out: rows.filter(a => fieldValue(a, field) === value) };
		}
		case 'measure': {
			const rows = inputs.in ?? [];
			const field = node.params.field ?? '';
			const vals = new Set<string>();
			for(const a of rows) {
				const v = fieldValue(a, field);
				if(v != null)
					vals.add(v);
			}
			return { out: Array.from(vals) };
		}
		case 'expand': {
			const seeds = inputs.seed ?? [];
			const cond = node.params.cond ?? '同字';
			if(cond === '同字') {
				const byKey = new Map<string, any>();
				for(const s of seeds)
					for(const a of Db.SameChar(s.key))
						byKey.set(a.key, a);
				return { out: Array.from(byKey.values()) };
			}
			// 等价：沿等价边扩张。
			const seedKeys = seeds.map((s: any) => s.key);
			return { out: Db.ExpandAttestations(seedKeys, e => e.type === '等价') };
		}
		case 'count':
			return { out: (inputs.in ?? []).length };
		case 'ratio': {
			const part = inputs.part ?? 0;
			const whole = inputs.whole ?? 0;
			return { out: whole ? (part / whole) * 100 : 0 };
		}
		case 'value':
			return { out: node.params.value ?? '' };
		default:
			throw new Error('未实现的节点类型：' + def.type);
	}
}

function itemText(item: any): string {
	if(typeof item === 'string')
		return item;
	return item.key ?? item.glyph ?? String(item);
}

function summarizeValue(v: any): any {
	if(Array.isArray(v))
		return { kind: 'collection', count: v.length, sample: v.slice(0, 20).map(itemText) };
	if(typeof v === 'number')
		return { kind: 'number', value: v };
	return { kind: 'value', value: String(v) };
}

/**
 * 求值蓝图图：只从 outputs 列出的节点反向惰性求值。
 * 返回 { results: { [nodeId]: { [outputName]: 摘要 } } }。
 */
export function EvaluateBlueprint(graph: BlueprintGraph) {
	const nodeById = new Map(graph.nodes.map(n => [n.id, n]));
	const defByType = new Map(BlueprintNodeDefs.map(d => [d.type, d]));
	const incoming = new Map<string, Array<{ fromNode: string; fromPort: string; toPort: string }>>();
	for(const e of graph.edges) {
		if(!incoming.has(e.to.node))
			incoming.set(e.to.node, []);
		incoming.get(e.to.node)!.push({ fromNode: e.from.node, fromPort: e.from.port, toPort: e.to.port });
	}
	const cache = new Map<string, Record<string, any>>();

	function compute(nodeId: string): Record<string, any> {
		if(cache.has(nodeId))
			return cache.get(nodeId)!;
		const node = nodeById.get(nodeId);
		if(!node)
			throw new Error('未知节点：' + nodeId);
		const def = defByType.get(node.type);
		if(!def)
			throw new Error('未知节点类型：' + node.type);
		const inputs: Record<string, any> = {};
		for(const inp of def.inputs) {
			const edge = (incoming.get(nodeId) || []).find(e => e.toPort === inp.name);
			if(edge) {
				const up = compute(edge.fromNode);
				inputs[inp.name] = up[edge.fromPort];
			} else if(inp.literal) {
				inputs[inp.name] = node.values?.[inp.name] ?? null;
			} else {
				inputs[inp.name] = null;
			}
		}
		const outputs = computeNode(def, node, inputs);
		cache.set(nodeId, outputs);
		return outputs;
	}

	const raw: Record<string, Record<string, any>> = {};
	for(const outId of graph.outputs)
		raw[outId] = compute(outId);
	const results: Record<string, Record<string, any>> = {};
	for(const [id, outs] of Object.entries(raw)) {
		results[id] = {};
		for(const [name, v] of Object.entries(outs))
			results[id][name] = summarizeValue(v);
	}
	return { results };
}

//#endregion
