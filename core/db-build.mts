// 洗库 v5：
// - 书证去 era（时代是来源的导出）。
// - 字形：key（opaque）+ 字形字符 + 编码(JSON) + 分类 + 标签(字类) + 代表(异体)。
// - 声符/义符不落字形字段，落字形边（type=部件 + role=声符/义符）。
// - 属性（声旁）与形声不落库，运行时算。
// - 建「等价」书证边（同反切异源互证）。

import * as Path from 'node:path';
import * as Url from 'node:url';
import * as Fs from 'node:fs';
// @ts-ignore — @types/node@22.4.2 未含 node:sqlite 声明。
import { DatabaseSync } from 'node:sqlite';
import { glyphs } from './guang-yun.mjs';

const thisScriptDir = Path.dirname(Url.fileURLToPath(import.meta.url));
const projectRootDir = Path.resolve(thisScriptDir, '..');
const dbPath = Path.join(projectRootDir, 'resources', 'db', 'han-chem.sqlite');

Fs.mkdirSync(Path.dirname(dbPath), { recursive: true });
Fs.rmSync(dbPath, { force: true });

const db = new DatabaseSync(dbPath);

db.exec('PRAGMA synchronous = OFF;');
db.exec('CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT);');
db.exec('CREATE TABLE attestation (key TEXT PRIMARY KEY, glyph TEXT, source TEXT NOT NULL, reading TEXT, gloss TEXT);');
db.exec('CREATE TABLE glyph (key TEXT PRIMARY KEY, char TEXT, encodings TEXT NOT NULL, classifications TEXT NOT NULL, tags TEXT NOT NULL, representative TEXT);');
db.exec('CREATE TABLE attestation_edge (src TEXT NOT NULL, dst TEXT NOT NULL, type TEXT NOT NULL, source TEXT NOT NULL);');
db.exec('CREATE TABLE glyph_edge (src TEXT NOT NULL, dst TEXT NOT NULL, type TEXT NOT NULL, role TEXT, source TEXT NOT NULL);');
db.exec('CREATE TABLE prediction (src TEXT NOT NULL, dialect TEXT NOT NULL, system TEXT NOT NULL, components TEXT NOT NULL);');
db.exec('CREATE TABLE phonology (name TEXT PRIMARY KEY, era TEXT NOT NULL);');
db.exec('CREATE TABLE phonology_edge (src TEXT NOT NULL, dst TEXT NOT NULL, label TEXT);');
db.exec('CREATE TABLE source (name TEXT PRIMARY KEY, type TEXT NOT NULL, phonology TEXT, era TEXT NOT NULL);');
db.exec('CREATE INDEX idx_att_glyph ON attestation(glyph);');
db.exec('CREATE INDEX idx_att_source ON attestation(source);');
db.exec('CREATE INDEX idx_ae_src ON attestation_edge(src);');
db.exec('CREATE INDEX idx_ge_src ON glyph_edge(src);');
db.exec('CREATE INDEX idx_ge_dst ON glyph_edge(dst);');
db.exec('CREATE INDEX idx_pred_src ON prediction(src);');

const insertAtt = db.prepare('INSERT OR IGNORE INTO attestation (key, glyph, source, reading, gloss) VALUES (?, ?, ?, ?, ?)');
const insertGlyph = db.prepare('INSERT OR IGNORE INTO glyph (key, char, encodings, classifications, tags, representative) VALUES (?, ?, ?, ?, ?, ?)');
const insertGlyphEdge = db.prepare('INSERT OR IGNORE INTO glyph_edge (src, dst, type, role, source) VALUES (?, ?, ?, ?, ?)');
const insertAttEdge = db.prepare('INSERT OR IGNORE INTO attestation_edge (src, dst, type, source) VALUES (?, ?, ?, ?)');
const insertPred = db.prepare('INSERT OR IGNORE INTO prediction (src, dialect, system, components) VALUES (?, ?, ?, ?)');

db.exec('BEGIN;');

// —— 音系树（7 主干节点 + 父子亲缘边）+ 来源库 ——
const trunk = ['原始漢語', '早期上古漢語', '晚期上古漢語', '早期中古漢語', '晚期中古漢語', '近代漢語', '現代漢語'];
const trunkEra = ['原始', '早期上古', '晚期上古', '早期中古', '晚期中古', '近代', '现代'];
const insertPhono = db.prepare('INSERT OR IGNORE INTO phonology (name, era) VALUES (?, ?)');
const insertPhonoEdge = db.prepare('INSERT OR IGNORE INTO phonology_edge (src, dst, label) VALUES (?, ?, ?)');
for(let i = 0; i < trunk.length; i++) {
	insertPhono.run(trunk[i], trunkEra[i]);
	if(i > 0)
		insertPhonoEdge.run(trunk[i - 1], trunk[i], null);
}
const insertSource = db.prepare('INSERT OR IGNORE INTO source (name, type, phonology, era) VALUES (?, ?, ?, ?)');
insertSource.run('廣韻', '韵书', '晚期中古漢語', '晚期中古');
insertSource.run('切韻', '韵书', '早期中古漢語', '早期中古');
insertSource.run('玉篇', '辞书', null, '早期中古');
insertSource.run('經典釋文', '韵书', '早期中古漢語', '早期中古');
insertSource.run('Unihan', '辞书', '現代漢語', '现代');

const glyphNodes = new Map();
const rawAtts = [];
const readingSet = new Map();
const seenRaw = new Set();

function codepointOf(ch) {
	const cp = ch.codePointAt(0);
	return 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
}

function ensureGlyph(ch) {
	if(!ch || ch.trim().length === 0)
		return null;
	const c = ch.trim();
	if(glyphNodes.has(c))
		return c;
	glyphNodes.set(c, { key: c, char: c, encodings: { Unicode: codepointOf(c) }, classifications: [], tags: [], representative: null });
	return c;
}

function pick(entry, ...fields) {
	for(const f of fields) {
		const v = entry[f];
		if(v && String(v).trim())
			return String(v).trim();
	}
	return '';
}

// 音类 → 转写串（单射），供键消费。
function readingKey(system, components) {
	if(system === '晚期中古漢語')
		return ['声', '韵', '等', '呼', '调'].map(k => components[k] || '').join('');
	if(system === '早期中古漢語') {
		const fq = (components['反切上字'] || '') + (components['反切下字'] || '');
		if(fq)
			return fq;
		return (components['反切'] || '') + (components['拼音'] || '');
	}
	if(system === '現代漢語')
		return components['拼音'] || '';
	return '';
}

// 反切规范化（去「切/反」尾缀）。
function normFq(s) {
	return (s || '').replace(/[切反]+$/g, '').trim();
}

function addRaw(glyph, source, reading, rk, gloss, predictions, fanqie) {
	const sig = glyph + '|' + source + '|' + rk;
	if(seenRaw.has(sig))
		return;
	seenRaw.add(sig);
	rawAtts.push({ glyph: glyph, source: source, reading: reading, readingKey: rk, gloss: gloss, predictions: predictions, fanqie: fanqie });
	const ps = glyph + '|' + source;
	if(!readingSet.has(ps))
		readingSet.set(ps, new Set());
	readingSet.get(ps).add(rk);
}

for(const [head, entries] of Array.from(glyphs)) {
	ensureGlyph(head);
	const g = glyphNodes.get(head);

	for(const e of entries) {
		// 廣韻书证（晚期中古）+ 预测音。
		const mc = {
			system: '晚期中古漢語',
			components: { 声: pick(e, 'shengNiu'), 韵: pick(e, 'yunBu_TiaoZhengHou'), 等: pick(e, 'deng'), 呼: pick(e, 'hu'), 调: pick(e, 'shengDiao') },
		};
		const rkGy = readingKey(mc.system, mc.components);
		const glossParts = [pick(e, 'guangYunShiYi'), pick(e, 'shiYiBuChong')].filter(Boolean);
		const preds = [];
		if(pick(e, 'xianDaiBeiJingYinLiLunYin'))
			preds.push({ dialect: '北京', system: '现代·普通话', components: { 声: pick(e, 'jingSheng'), 韵: pick(e, 'jingYun'), 调: pick(e, 'jingDiao') } });
		if(pick(e, 'xianDaiGuangZhouYinLiLunYin'))
			preds.push({ dialect: '广州', system: '现代·粤语', components: { 声: pick(e, 'yueSheng'), 韵: pick(e, 'yueYun'), 调: pick(e, 'yueDiao') } });
		const fqGy = normFq(pick(e, 'guangYunFanQie_HeJiaoHou'));
		addRaw(head, '廣韻', mc, rkGy, glossParts.length ? glossParts.join('；') : null, preds.length ? preds : undefined, fqGy);

		// 切韻书证（早期中古，反切）。
		const top = pick(e, 'shangZi');
		const bottom = pick(e, 'xiaZi');
		if(top || bottom) {
			const emc = { system: '早期中古漢語', components: { 反切上字: top, 反切下字: bottom } };
			addRaw(head, '切韻', emc, readingKey(emc.system, emc.components), null, undefined, normFq(top + bottom));
		}

		// 玉篇书证（无读音，仅训释）。
		const yp = pick(e, 'yuPian_SongBenYuPian', 'yuPian_YuanBenYuPianCanJuan_ZhuanLiWanXiangMingYi');
		if(yp)
			addRaw(head, '玉篇', null, '', yp, undefined, undefined);

		// 經典釋文書证（反切/拼音）。
		const jdFq = pick(e, 'jingDianShiWen_FanQie');
		const jdPy = pick(e, 'jingDianShiWen_PinYin_PoemBan');
		if(jdFq || jdPy) {
			const jd = { system: '早期中古漢語', components: { 反切: jdFq, 拼音: jdPy } };
			addRaw(head, '經典釋文', jd, readingKey(jd.system, jd.components), null, undefined, normFq(jdFq));
		}

		// 字形：字类（标签）+ 分类 + 声符/义符边。
		if(pick(e, 'ziLei'))
			g.tags.push(pick(e, 'ziLei'));
		g.classifications.push('傳承字');
		const sounds = Array.from(String(e.shengXing_Sheng || '')).filter(c => c.trim());
		const shapes = Array.from(String(e.shengXing_Xing || '')).filter(c => c.trim());
		for(const s of sounds) {
			ensureGlyph(s);
			insertGlyphEdge.run(head, s, '部件', '聲符', '廣韻全字表');
		}
		for(const s of shapes) {
			ensureGlyph(s);
			insertGlyphEdge.run(head, s, '部件', '意符', '廣韻全字表');
		}
	}
}

// —— 繁简边（OpenCC STCharacters：简 → 繁）——
const stPath = Path.join(projectRootDir, 'resources', 'data', 'opencc', 'STCharacters.txt');
if(Fs.existsSync(stPath)) {
	const stLines = Fs.readFileSync(stPath, 'utf8').split('\n');
	for(const line of stLines) {
		const t = line.trim();
		if(!t || t.startsWith('#'))
			continue;
		const parts = t.split(/\s+/);
		if(parts.length < 2)
			continue;
		const simp = parts[0];
		for(const trad of parts.slice(1)) {
			if(trad === simp)
				continue;
			ensureGlyph(simp);
			ensureGlyph(trad);
			const sg = glyphNodes.get(simp);
			if(!sg.classifications.includes('簡化字'))
				sg.classifications.push('簡化字');
			insertGlyphEdge.run(simp, trad, '簡繁', null, 'OpenCC STCharacters');
		}
	}
}

// —— Unihan：繁简边（kTraditionalVariant）+ kMandarin 现代音（简化字书证）——
const unihanDir = Path.join(projectRootDir, 'resources', 'data', 'unihan');
{
	const variantsPath = Path.join(unihanDir, 'Unihan_Variants.txt');
	if(Fs.existsSync(variantsPath)) {
		for(const line of Fs.readFileSync(variantsPath, 'utf8').split('\n')) {
			if(!line.startsWith('U+'))
				continue;
			const parts = line.trim().split('\t');
			if(parts.length < 3 || parts[1] !== 'kTraditionalVariant')
				continue;
			const simp = String.fromCodePoint(parseInt(parts[0].slice(2), 16));
			const trad = String.fromCodePoint(parseInt(parts[2].slice(2), 16));
			ensureGlyph(simp);
			ensureGlyph(trad);
			const sg = glyphNodes.get(simp);
			if(!sg.classifications.includes('簡化字'))
				sg.classifications.push('簡化字');
			insertGlyphEdge.run(simp, trad, '簡繁', null, 'Unihan kTraditionalVariant');
		}
	}
}
{
	const readingsPath = Path.join(unihanDir, 'Unihan_Readings.txt');
	if(Fs.existsSync(readingsPath)) {
		const km = new Map();
		for(const line of Fs.readFileSync(readingsPath, 'utf8').split('\n')) {
			if(!line.startsWith('U+'))
				continue;
			const parts = line.trim().split('\t');
			if(parts.length < 3 || parts[1] !== 'kMandarin')
				continue;
			const ch = String.fromCodePoint(parseInt(parts[0].slice(2), 16));
			km.set(ch, parts[2]);
		}
		for(const [key, g] of Array.from(glyphNodes)) {
			if(!g.classifications.includes('簡化字'))
				continue;
			const py = km.get(key);
			if(!py)
				continue;
			const pyFirst = py.split(' ')[0];
			addRaw(key, 'Unihan', { system: '現代漢語', components: { 拼音: pyFirst } }, pyFirst, null, undefined, undefined);
		}
	}
}

// 定键：多读才写读音，至多一读省略（连横杠）。
const keyCount = new Map();
for(const ra of rawAtts) {
	const multi = readingSet.get(ra.glyph + '|' + ra.source).size > 1;
	const base = ra.glyph + '-' + ra.source + (multi ? '-' + ra.readingKey : '');
	const n = (keyCount.get(base) || 0) + 1;
	keyCount.set(base, n);
	const key = n === 1 ? base : base + '#' + n;
	ra.finalKey = key;
	insertAtt.run(key, ra.glyph, ra.source, ra.reading ? JSON.stringify(ra.reading) : null, ra.gloss);
	if(ra.predictions) {
		for(const p of ra.predictions)
			insertPred.run(key, p.dialect, p.system, JSON.stringify(p.components));
	}
}

// 等价边：同字形同反切、异源互证（双向）。
const fqGroups = new Map();
for(const ra of rawAtts) {
	if(!ra.fanqie)
		continue;
	const gk = ra.glyph + '|' + ra.fanqie;
	if(!fqGroups.has(gk))
		fqGroups.set(gk, []);
	fqGroups.get(gk).push({ key: ra.finalKey, source: ra.source });
}
for(const members of Array.from(fqGroups.values())) {
	for(let i = 0; i < members.length; i++) {
		for(let j = i + 1; j < members.length; j++) {
			if(members[i].source !== members[j].source) {
				insertAttEdge.run(members[i].key, members[j].key, '等价', '同反切');
				insertAttEdge.run(members[j].key, members[i].key, '等价', '同反切');
			}
		}
	}
}

for(const g of Array.from(glyphNodes.values())) {
	insertGlyph.run(
		g.key,
		g.char,
		JSON.stringify(g.encodings),
		JSON.stringify(Array.from(new Set(g.classifications))),
		JSON.stringify(Array.from(new Set(g.tags))),
		g.representative,
	);
}

db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('built_at', new Date().toISOString());
db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('sources', '廣韻,切韻,玉篇,經典釋文');
db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('predictions', '北京,广州');
db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('identity_glyph_types', '異體');
db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('identity_reading_types', '系统音变,非系统音变,文白读,破读');
db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('identity_equiv_types', '等价');
db.exec('COMMIT;');
db.close();

const ro = new DatabaseSync(dbPath, { readOnly: true });
for(const t of ['attestation', 'glyph', 'attestation_edge', 'glyph_edge', 'prediction', 'phonology', 'phonology_edge', 'source'])
	console.log(t + ': ' + ro.prepare('SELECT COUNT(*) AS n FROM ' + t).get()['n']);
ro.close();
