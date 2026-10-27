// 现有功能重现：按字形查询信息（旧立面）。
// 旧 GlyphInfo 类型已收敛为本模块内部，不从公用类型库（core/types.mjs）导出。
// 数据源改为书证库 + 字形库（core/db.mjs）。

import * as Db from '../db.mjs';

//#region 内部类型（旧立面，仅本功能使用）

type GlyphClassification = '傳承字' | '簡化字' | '二級簡化字';
type GlyphProperties = '聲旁' | '次級聲旁';

type PhonologyRecord =
	| { domain: string; source: string; top: string; bottom: string }
	| { domain: string; source: string; initial: string; rhymeClass: string; rhyme: string; tone: string; division: string; medial: string }
	| { domain: string; initial: string; rhyme: string; tone: string };

type GlyphInfo = {
	identity: {
		key: string;
		unicodeCharacter: string | null;
		classifications: GlyphClassification[];
		properties: GlyphProperties[];
	};
	composition: {
		method: string | null;
		shapes: string[];
		sounds: string[];
		notes?: string;
	};
	phonology: PhonologyRecord[];
};

//#endregion

/** 依键名检测是否收录了某个字形。 */
export function HasGlyph(glyphKey: string): boolean {
	return Db.GetGlyph(glyphKey) !== null || Db.AttestationsByGlyph(glyphKey).length > 0;
}

const domainOrder = { '上古': 0, '早期中古': 1, '晚期中古': 2, '近古': 3, '現代': 4 };

function domainRank(d) {
	const top = d.split('/')[0];
	return top in domainOrder ? domainOrder[top] : 99;
}

/**
 * 查询字形信息（旧立面，现由书证库/字形库聚合）。
 * @param glyphKey 要检测的字形。
 */
export function QueryGlyphInfo(glyphKey: string): GlyphInfo | null {
	const boxed = Db.BoxGlyph(glyphKey);
	const atts = Db.AttestationsByGlyph(glyphKey);
	if(!boxed && atts.length === 0)
		return null;

	const info: GlyphInfo = {
		identity: {
			key: glyphKey,
			unicodeCharacter: glyphKey,
			classifications: [],
			properties: [],
		},
		composition: {
			method: null,
			shapes: [],
			sounds: [],
		},
		phonology: [],
	};

	if(boxed) {
		info.identity.unicodeCharacter = boxed.char;
		info.identity.classifications = boxed.classifications;
		info.identity.properties = boxed.tags.includes('聲旁') ? ['聲旁'] : [];
		info.composition.method = boxed.tags.filter(t => t !== '聲旁').join('');
		info.composition.shapes = boxed.shapes;
		info.composition.sounds = boxed.sounds;
	}

	for(const a of atts) {
		if(!a.reading)
			continue;
		const c = a.reading.components;

		if(a.source === '切韻') {
			info.phonology.push({
				domain: '早期中古',
				source: '切韻',
				top: c['反切上字'] || '',
				bottom: c['反切下字'] || '',
			});
		} else if(a.source === '廣韻') {
			info.phonology.push({
				domain: '晚期中古',
				source: '廣韻',
				initial: c['声'] || '',
				division: c['等'] || '',
				medial: c['呼'] || '',
				rhymeClass: c['摄'] || '',
				rhyme: c['韵'] || '',
				tone: c['调'] || '',
			});

			// 预测音（测量算子，非权威书证）。
			const bj = Db.PredictModern(a.key, '北京');
			if(bj)
				info.phonology.push({ domain: '現代/北京官話/預測音', initial: bj.components['声'] || '', rhyme: bj.components['韵'] || '', tone: bj.components['调'] || '' });
			const gz = Db.PredictModern(a.key, '广州');
			if(gz)
				info.phonology.push({ domain: '現代/粵語/預測音', initial: gz.components['声'] || '', rhyme: gz.components['韵'] || '', tone: gz.components['调'] || '' });
		}
	}

	info.phonology.sort(function(a, b) { return domainRank(a.domain) - domainRank(b.domain); });

	return info;
}
