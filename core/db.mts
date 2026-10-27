// 书证库 + 字形库 · 只读访问层（node:sqlite）。
// 洗库是离线构建产物，运行时只读。

import * as Path from 'node:path';
import * as Url from 'node:url';
// @ts-ignore — @types/node@22.4.2 未含 node:sqlite 声明；node ≥22.13 运行时可用。
import { DatabaseSync } from 'node:sqlite';

const thisScriptDir = Path.dirname(Url.fileURLToPath(import.meta.url));
const projectRootDir = Path.resolve(thisScriptDir, '..');
const dbPath = Path.join(projectRootDir, 'resources', 'db', 'han-chem.sqlite');

let db = null;

/** 打开只读数据库（懒加载，进程内单例）。 */
export function GetDb() {
	if(db)
		return db;
	db = new DatabaseSync(dbPath, { readOnly: true });
	return db;
}

function toAttestation(row) {
	return {
		key: row.key,
		glyph: row.glyph ?? null,
		source: row.source,
		reading: row.reading ? JSON.parse(row.reading) : null,
		gloss: row.gloss ?? null,
	};
}

function toGlyph(row) {
	return {
		key: row.key,
		char: row.char ?? null,
		encodings: JSON.parse(row.encodings),
		classifications: JSON.parse(row.classifications),
		tags: JSON.parse(row.tags),
		representative: row.representative ?? null,
	};
}

// —— 缓存（读一次，进程内复用） ——

let attestationsCache = null;
let glyphsCache = null;

/** 全部书证。 */
export function AllAttestations() {
	if(!attestationsCache)
		attestationsCache = GetDb().prepare('SELECT * FROM attestation').all().map(toAttestation);
	return attestationsCache;
}

/** 全部字形。 */
export function AllGlyphs() {
	if(!glyphsCache)
		glyphsCache = GetDb().prepare('SELECT * FROM glyph').all().map(toGlyph);
	return glyphsCache;
}

/** 按字形查询书证。 */
export function AttestationsByGlyph(glyph) {
	return AllAttestations().filter(a => a.glyph === glyph);
}

/** 查询字形。 */
export function GetGlyph(key) {
	return AllGlyphs().find(g => g.key === key) ?? null;
}

// —— 统计 ——

/** 库级统计。 */
export function Stats() {
	const d = GetDb();
	const count = function(sql) { return d.prepare(sql).get()['n']; };
	const bySource = {};
	for(const r of d.prepare('SELECT source, COUNT(*) AS n FROM attestation GROUP BY source ORDER BY n DESC').all())
		bySource[r['source']] = r['n'];
	return {
		attestations: count('SELECT COUNT(*) AS n FROM attestation'),
		glyphs: count('SELECT COUNT(*) AS n FROM glyph'),
		attestationEdges: count('SELECT COUNT(*) AS n FROM attestation_edge'),
		glyphEdges: count('SELECT COUNT(*) AS n FROM glyph_edge'),
		bySource: bySource,
		phonologies: count('SELECT COUNT(*) AS n FROM phonology'),
		phonologyEdges: count('SELECT COUNT(*) AS n FROM phonology_edge'),
		sources: count('SELECT COUNT(*) AS n FROM source'),
	};
}

// —— 搜索 ——

const ATTESTATION_FIELDS = ['key', 'glyph', 'source', 'reading', 'gloss'];
const GLYPH_FIELDS = ['key', 'char', 'encodings', 'classifications', 'tags', 'representative'];

function compile(query, mode, fields) {
	// field:value 或 field=value —— 键值搜索。
	const m = query.match(/^([^:=]+)[:=]([\s\S]*)$/);
	let field = null;
	let value = query;
	if(m && fields.includes(m[1].trim())) {
		field = m[1].trim();
		value = m[2];
	}
	let re = null;
	if(mode === 'regex') {
		try { re = new RegExp(value); }
		catch(e) { re = null; }
	}
	const fieldsToSearch = field ? [field] : fields;
	return function(row) {
		for(const f of fieldsToSearch) {
			const v = row[f];
			if(v == null)
				continue;
			const s = typeof v === 'string' ? v : JSON.stringify(v);
			if(re ? re.test(s) : s.includes(value))
				return true;
		}
		return false;
	};
}

/** 搜索书证（literal 子串 / regex 正则 / field:value 键值）。 */
export function SearchAttestations(query, mode) {
	const pred = compile(query, mode || 'literal', ATTESTATION_FIELDS);
	return AllAttestations().filter(pred);
}

/** 搜索字形（返回装箱后的字形对象）。 */
export function SearchGlyphs(query, mode) {
	const pred = compile(query, mode || 'literal', GLYPH_FIELDS);
	return AllGlyphs().filter(pred).map(g => BoxGlyph(g.key));
}

// —— 装箱（运行时把等价关系归约回列表、补计算标签） ——

/**
 * 装箱字形：DB 只存本质字段，运行时补——
 * 形声（有声符+义符）、声旁（有指向它的声符边）、声符/义符列表、异体列表。
 */
export function BoxGlyph(key) {
	const g = GetGlyph(key);
	if(!g)
		return null;
	const d = GetDb();
	const out = d.prepare('SELECT role, dst FROM glyph_edge WHERE src = ? AND type = ?').all(key, '部件') as Array<{ role: string; dst: string }>;
	const sounds = Array.from(new Set(out.filter(e => e.role === '聲符').map(e => String(e.dst))));
	const shapes = Array.from(new Set(out.filter(e => e.role === '意符').map(e => String(e.dst))));
	const tags = Array.from(g.tags);
	if(sounds.length > 0 && shapes.length > 0)
		tags.push('形聲');
	const inSound = d.prepare('SELECT COUNT(*) AS n FROM glyph_edge WHERE dst = ? AND role = ?').get(key, '聲符');
	if(inSound['n'] > 0)
		tags.push('聲旁');
	let variants = [];
	if(g.representative) {
		const rep = g.representative;
		const rows = d.prepare('SELECT key FROM glyph WHERE representative = ? OR key = ?').all(rep, rep) as Array<{ key: string }>;
		variants = Array.from(new Set(rows.map(r => String(r.key))));
	}
	return { key: g.key, char: g.char, encodings: g.encodings, classifications: g.classifications, tags: Array.from(new Set(tags)), representative: g.representative, sounds: sounds, shapes: shapes, variants: variants };
}

// —— 预测音（测量算子） ——

/**
 * 测量算子：预测现代音（由中古书证推现代北京/广州理论音）。
 * 数据在 prediction 表（非权威书证）；权威现代音待后续源入库。
 */
export function PredictModern(srcKey, dialect) {
	const row = GetDb().prepare('SELECT * FROM prediction WHERE src = ? AND dialect = ?').get(srcKey, dialect);
	if(!row)
		return null;
	return { system: row.system, components: JSON.parse(row.components) };
}

// —— 扩张算子 ——

/**
 * 扩张：由种子书证出发，沿满足条件的书证边扩张得到集合。
 * predicate 接收边，返回是否沿此边可达。
 */
export function ExpandAttestations(seedKeys, predicate) {
	const d = GetDb();
	const edges = d.prepare('SELECT * FROM attestation_edge').all();
	const adj = new Map();
	for(const e of edges) {
		if(!adj.has(e.src))
			adj.set(e.src, []);
		adj.get(e.src).push(e);
	}
	const visited = new Set(seedKeys);
	const queue = [...seedKeys];
	while(queue.length) {
		const cur = queue.shift();
		const out = adj.get(cur) || [];
		for(const e of out) {
			if(predicate(e) && !visited.has(e.dst)) {
				visited.add(e.dst);
				queue.push(e.dst);
			}
		}
	}
	return AllAttestations().filter(a => visited.has(a.key));
}

// —— 音系树 / 来源库 只读访问 ——

/** 全部音系节点。 */
export function AllPhonologies() {
	return GetDb().prepare('SELECT * FROM phonology').all().map(r => ({ name: r.name, era: r.era }));
}

/** 全部亲缘边（音系 → 音系）。 */
export function AllPhonologyEdges() {
	return GetDb().prepare('SELECT * FROM phonology_edge').all().map(r => ({ src: r.src, dst: r.dst, label: r.label ?? null }));
}

/** 全部来源。 */
export function AllSources() {
	return GetDb().prepare('SELECT * FROM source').all().map(r => ({ name: r.name, type: r.type, phonology: r.phonology ?? null, era: r.era }));
}

// —— 同字判定（数据驱动：沿「进身份」标签求等价闭包） ——

/** 读「进身份」标签元数据（逗号分隔）。 */
function identityTypes(metaKey) {
	const row = GetDb().prepare('SELECT value FROM meta WHERE key = ?').get(metaKey);
	if(!row)
		return [];
	return String(row.value).split(',').map(s => s.trim()).filter(Boolean);
}

/** 无向闭包：沿边集求起点所在连通分量。 */
function undirectedClosure(start, edges) {
	const adj = new Map();
	for(const e of edges) {
		if(!adj.has(e.src)) adj.set(e.src, []);
		if(!adj.has(e.dst)) adj.set(e.dst, []);
		adj.get(e.src).push(e.dst);
		adj.get(e.dst).push(e.src);
	}
	const seen = new Set();
	const stack = [start];
	while(stack.length) {
		const cur = stack.pop();
		if(seen.has(cur)) continue;
		seen.add(cur);
		for(const n of (adj.get(cur) || []))
			if(!seen.has(n)) stack.push(n);
	}
	return seen;
}

function placeholders(n) {
	return Array(n).fill('?').join(',');
}

/**
 * 同字判定：同属异体群 ∧（无音 ∨ 读音亲缘）。
 * 字形侧 = 异体（代表字形键分组）；读音侧 = 亲缘（系统音变/非系统音变/文白读/破读）+ 等价，沿进身份标签求闭包。
 */
export function SameChar(seedKey) {
	const d = GetDb();
	const atts = AllAttestations();
	const seed = atts.find(a => a.key === seedKey);
	if(!seed)
		return [];

	// 字形侧：异体群（代表字形键分组）。
	let variantSet = new Set();
	if(seed.glyph) {
		const g = GetGlyph(seed.glyph);
		if(g) {
			if(g.representative) {
				const rep = g.representative;
				const rows = d.prepare('SELECT key FROM glyph WHERE representative = ? OR key = ?').all(rep, rep);
				variantSet = new Set(rows.map(r => String(r.key)));
			} else {
				variantSet = new Set([g.key]);
			}
		}
	}

	// 读音侧：亲缘 + 等价（进身份标签）沿书证边求无向闭包。
	const readTypes = identityTypes('identity_reading_types').concat(identityTypes('identity_equiv_types'));
	let readEquiv = new Set([seedKey]);
	if(readTypes.length) {
		const edges = d.prepare('SELECT src, dst FROM attestation_edge WHERE type IN (' + placeholders(readTypes.length) + ')').all(...readTypes);
		readEquiv = undirectedClosure(seedKey, edges);
	}

	const seedNoReading = seed.reading == null;
	return atts.filter(a => variantSet.has(a.glyph) && (seedNoReading || a.reading == null || readEquiv.has(a.key)));
}
